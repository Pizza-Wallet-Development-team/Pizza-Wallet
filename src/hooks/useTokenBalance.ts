/* eslint-disable consistent-return */
import type { Token, TokenAmount } from "@lifi/sdk";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useLiFi } from "../providers";
// import { useWeb3React } from "@web3-react/core";
import { formatTokenAmount } from "../helpers/formatters";
import { useWeb3AuthExecutionStore } from "../stores/web3Auth/useWeb3AuthExecutionStore";

const defaultRefetchInterval = 60_000;

export const useTokenBalance = (token?: Token, accountAddress?: string) => {
  const lifi = useLiFi();
  // const { account } = useWallet();
  // const { provider } = useWeb3React();
  // const account = provider;
  const queryClient = useQueryClient();
  const { address } = useWeb3AuthExecutionStore((state: any) => state);
  //const walletAddress = accountAddress ?? process.env.REACT_APP_TEST_ACCOUNT;

  const getTokenBalancesWithRetry = useCallback(
    async (
      accountAddress: string,
      tokens: Token[],
      depth = 0,
    ): Promise<TokenAmount[] | undefined> => {
      try {
        const tokenBalances = await lifi.getTokenBalances(
          accountAddress as string,
          tokens,
        );
        if (!tokenBalances.every((token) => token.blockNumber)) {
          if (depth > 10) {
            console.warn("Token balance backoff depth exceeded.");
            return undefined;
          }
          await new Promise((resolve) => {
            setTimeout(resolve, 1.5 ** depth * 100);
          });
          return getTokenBalancesWithRetry(accountAddress, tokens, depth + 1);
        }
        return tokenBalances;
      } catch (error) {
        //
      }
    },
    [lifi],
  );

  const tokenBalanceQueryKey = useMemo(
    () => ["token-balance", address, token?.chainId, token?.address],
    [token?.address, token?.chainId, address],
  );

  const { data, isLoading, refetch } = useQuery(
    tokenBalanceQueryKey,
    async ({ queryKey: [, accountAddress] }) => {
      const cachedToken = queryClient
        .getQueryData<Token[]>([
          "token-balances",
          accountAddress,
          token!.chainId,
        ])
        ?.find((t) => t.address === token!.address);

      if (cachedToken) {
        return cachedToken as TokenAmount;
      }

      const tokenBalances = await getTokenBalancesWithRetry(
        accountAddress as string,
        [token!],
      );

      if (!tokenBalances?.length) {
        throw Error("Could not get tokens balance.");
      }

      const cachedTokenAmount =
        queryClient.getQueryData<TokenAmount>(tokenBalanceQueryKey);

      const formattedAmount = formatTokenAmount(tokenBalances[0].amount);

      if (cachedTokenAmount?.amount !== formattedAmount) {
        queryClient.setQueryDefaults(tokenBalanceQueryKey, {
          refetchInterval: defaultRefetchInterval,
          staleTime: defaultRefetchInterval,
        });
      }

      queryClient.setQueryData<TokenAmount[]>(
        ["token-balances", accountAddress, token!.chainId],
        (data) => {
          if (data) {
            const index = data.findIndex(
              (dataToken) => dataToken.address === token!.address,
            );
            data[index] = {
              ...data[index],
              amount: formattedAmount,
            };
          }
          return data;
        },
      );

      return {
        ...tokenBalances[0],
        amount: formattedAmount,
      } as TokenAmount;
    },
    {
      enabled: Boolean(address && token),
      refetchInterval: defaultRefetchInterval,
      staleTime: defaultRefetchInterval,
    },
  );

  const refetchAllBalances = () => {
    queryClient.refetchQueries([
      "token-balances",
      token?.chainId,
      accountAddress,
    ]);
  };

  const refetchNewBalance = useCallback(() => {
    queryClient.setQueryDefaults(tokenBalanceQueryKey, {
      refetchInterval: 250,
      staleTime: 250,
    });
  }, [queryClient, tokenBalanceQueryKey]);

  return {
    token: data,
    isLoading,
    refetch,
    refetchNewBalance,
    refetchAllBalances,
    getTokenBalancesWithRetry,
  };
};
