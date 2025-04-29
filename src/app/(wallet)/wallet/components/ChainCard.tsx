"use client";
import { useBlockNumber, useEstimateFeesPerGas } from "wagmi";
const ChainCard = ({
  className,
  chain = 1,
}: {
  className?: string;
  chain: any;
}) => {
  const { data: blockNumber, isLoading: isBlockNumberLoading } = useBlockNumber(
    { chainId: chain.id, watch: true },
  );
  const { data: gasPriceInfo, isLoading: isGasPriceLoading } =
    useEstimateFeesPerGas({ chainId: chain.id });

  return (
    <div className={className}>
      <table border={1} className="border-collapse border-spacing-y-4">
        <tbody className="[&>tr>td]:py-2">
          <tr>
            <td className="w-[200px]">Chain Name: </td>
            <td>
              <label className="color-blue">{chain.name}</label>
            </td>
          </tr>
          <tr>
            <td>Chain Id: </td>
            <td>
              <label className="color-blue">{chain.id}</label>
            </td>
          </tr>
          <tr>
            <td>Block Explorer Url:</td>
            <td width={400}>
              <a
                href={chain.blockExplorers?.default?.url}
                className="color-blue"
              >
                {chain.blockExplorers?.default?.url}
              </a>
            </td>
          </tr>
          <tr>
            <td>Native Currency: </td>
            <td>
              <label className="color-blue">
                {chain.nativeCurrency?.name} ({chain.nativeCurrency?.symbol})
              </label>
            </td>
          </tr>
          <tr>
            <td>Block Number:</td>
            <td>
              <label className="color-blue">
                {isBlockNumberLoading ? null : blockNumber?.toString?.()}
              </label>
            </td>
          </tr>
          <tr>
            <td>max fee per gas(EIP-1559 Transactions):</td>
            <td>
              <label className="color-blue">
                {isGasPriceLoading
                  ? null
                  : gasPriceInfo?.formatted?.maxFeePerGas}{" "}
                gwei
              </label>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default ChainCard;
