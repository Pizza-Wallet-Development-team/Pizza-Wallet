import { TokenWithAmounts } from "@lifi/sdk";

// all reusable interfaces here -
export interface TokenAmountList {
  [ChainKey: string]: Array<TokenWithAmounts>;
}
