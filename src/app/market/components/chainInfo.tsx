import Image from "next/image";
import type { IChainData } from "./chainPanel";

export default function ChainInfo({
  data,
  handleClick,
  onCloseDrawer,
}: {
  data: Array<IChainData & { price: string }>;
  handleClick?: (chain: IChainData) => void;
  onCloseDrawer?: () => void;
}) {
  return (
    <main className="px-4 py-10">
      {data.map((chain: any) => {
        return (
          <div
            className="flex h-[74px] flex-row items-center gap-4 px-4 py-2"
            key={chain.ShortName + chain.chainIndex}
            onClick={() => {
              onCloseDrawer && onCloseDrawer()
              handleClick && handleClick(chain);
            }}
          >
            <div className="flex grow flex-row items-center gap-4">
              <Image src={chain.logoUrl} alt="logo" width={48} height={48} />
              <div>
                <div>{chain.name}</div>
                <div className="text-sm text-gray-600">{chain.shortName}</div>
              </div>
            </div>
            <div>
              {chain.price ? (
                <div className="text-right">
                  <div>{Number(chain.price).toFixed(2)}</div>
                  <div className="text-sm text-gray-600">USD</div>
                </div>
              ) : (
                <div className="text-gray-600">Loading...</div>
              )}
            </div>
          </div>
        );
      })}
    </main>
  );
}
