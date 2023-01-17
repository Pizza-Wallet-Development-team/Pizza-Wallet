import React from "react";
import styled from "styled-components";
import { Avatar, Image, Tag, Tooltip } from "antd";
import { useChain } from "../../../hooks/useChain";
import { useToken } from "../../../hooks/useToken";
import {
  formatTokenAmount,
  formatTokenPrice,
  limitDigits,
} from "../../../helpers/formatters";
import { Token } from "../Token";
import { getGasCostsBreakdown } from "./utils";
import {
  faGasPump,
  faClock,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StepActions } from "./StepActions";

const Card = styled("div")`
  width: 95%;
  border: 0.125rem solid #3e389f;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  margin: auto;
  margin-top: 30px;
  &:hover {
    background: #e8e8e8;
  }
`;

const Flex = styled("div")`
  display: flex;
  justify-content: start;
  justify-content: ${(props: {
    justifyContent?: string;
    marginBottom?: string;
    marginLeft?: string;
  }) => props.justifyContent};

  margin-bottom: ${(props) => props.marginBottom};
  margin-left: ${(props) => props.marginLeft};
`;

const SymbolText = styled("p")`
  color: #3e389f;
  font-family: "Rubik", sans-serif;
  font-size: 18px;
  font-weight: bold;
  line-height: 1.5rem;
  letter-spacing: 0.02em;
`;

const Text2 = styled("p")`
  color: #3e389f;
  font-family: "Rubik", sans-serif;
  font-size: 13px;
  line-height: 1.5rem;
`;

const FontAwesomeIconStyled = styled(FontAwesomeIcon)`
  font-size: 15px;
  color: #3e389f;
`;

interface ISwapRouteCard {
  toToken: any;
  toAmount: any;
  route: any;
  handleSelectRoute: any;
}

export const SwapRouteCard: React.FC<ISwapRouteCard> = ({
  toToken,
  toAmount,
  route,
  handleSelectRoute,
}) => {
  const { chain } = useChain(toToken.chainId);
  const { token, isLoading } = useToken(toToken.chainId, toToken.address);
  const step = route.steps[0];
  const gasCostUSD = parseFloat(route.gasCostUSD ?? "") || 0.01;
  const gasCosts = getGasCostsBreakdown(route);

  const tag = route.tags?.length ? route.tags[0] : "NORMAL";
  const tagColor = tag === "RECOMMENDED" ? "green" : "cyan";

  const executionTimeMinutes = Math.ceil(
    route.steps
      .map((step: any) => step.estimate.executionDuration)
      .reduce((duration: number, x: number) => duration + x, 0) / 60,
  );

  const gasCostTooltipText = (
    <span>
      {gasCosts.map((gas) => (
        <>
          <p>Estimated network fee</p>
          <p key={`${gas.token.address}${gas.token.symbol}`}>
            {gas.amount?.toFixed(6)} {gas.token.symbol} {`($${gas.amountUSD})`}
          </p>
        </>
      ))}
    </span>
  );

  const tokenWithAmount = { ...toToken, amount: toAmount };

  return (
    <Card onClick={() => handleSelectRoute(route)}>
      <Flex marginBottom={"20px"} justifyContent={"space-between"}>
        <Tag color={tagColor}>{tag}</Tag>
        <Tooltip placement="top" title={gasCostTooltipText}>
          <div style={{ display: "flex" }}>
            <div style={{ display: "inline-block", marginRight: "5px" }}>
              <FontAwesomeIconStyled icon={faGasPump} />
            </div>

            <Text2>${gasCostUSD}</Text2>
          </div>
        </Tooltip>
        <Tooltip
          placement="top"
          title={"Estimated swap execution time in minutes"}
        >
          <div style={{ display: "flex" }}>
            <div style={{ display: "inline-block", marginRight: "5px" }}>
              <FontAwesomeIconStyled icon={faClock} />
            </div>

            <Text2>{executionTimeMinutes}m</Text2>
          </div>
        </Tooltip>
        <Tooltip
          placement="top"
          title={
            "A number of swap steps. Each step can contain 1-2 transaction which require a signature"
          }
        >
          <div style={{ display: "flex" }}>
            <div style={{ display: "inline-block", marginRight: "5px" }}>
              <FontAwesomeIconStyled icon={faLayerGroup} />
            </div>

            <Text2>{route.steps.length}</Text2>
          </div>
        </Tooltip>
      </Flex>
      <Token token={tokenWithAmount} step={step} />
      <div>
        {route.steps.map((step: any) => (
          <StepActions key={step.id} _step={step} />
        ))}
      </div>
    </Card>
  );
};
