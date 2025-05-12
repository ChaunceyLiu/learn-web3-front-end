import Image from "next/image";
import type { IChainData } from "@/type";
import { Virtuoso } from "react-virtuoso";
import { useEffect, useMemo, useState } from "react";

type ChainItem = IChainData & { price: string };

export default function ChainInfo({
  data,
  handleClick,
  onCloseDrawer,
}: {
  data: Array<ChainItem>;
  handleClick?: (chain: IChainData) => void;
  onCloseDrawer?: () => void;
}) {
  const memoizedData = useMemo(
    () => data.map((d) => ({ ...d, _hash: crypto.randomUUID() })),
    [data],
  );
  return (
    <main className="flex h-[100vh] w-[100vw] flex-col px-4 py-4">
      <Virtuoso
        style={{
          height: "100%",
          overflowY: "auto", // 强制启用滚动条
          position: "relative",
        }}
        data={memoizedData}
        itemContent={(_, chain: ChainItem) => {
          return (
            <div
              className="flex h-[74px] flex-row items-center gap-4 px-4 py-2"
              key={chain.shortName + chain.chainIndex}
              onClick={() => {
                onCloseDrawer && onCloseDrawer();
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
        }}
      />
    </main>
  );
}
