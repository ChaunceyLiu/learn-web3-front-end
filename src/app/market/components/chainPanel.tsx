//app/market/components/chainPanel.tsx
"use client";
import ChainInfo from "./chainInfo";
import BottomDrawer from "./bottomDrawer";
import { useEffect, useState } from "react";
import { useMarketStore } from "@/store/market";
import type { MarketStoreState } from "@/store/market";
import { useQuery } from "@tanstack/react-query";
import { fetchChainData } from "@lib/chainData";
import { fetchCurrentPrice } from "@lib/currentPrice";
import type { IChainData } from "@/type";

// 1️⃣ 使用 React Query 进行数据获取和缓存
export default function ChainPanel() {
  const [mergedData, setMergedData] = useState<
    Array<IChainData & { price: string }>
  >([]);
  const updateSelectedChain = useMarketStore(
    (state) => (state as MarketStoreState).updateSelectedChain,
  );

  const selectChain = (chain: IChainData) => {
    updateSelectedChain(chain);
  };

  // React Query 客户端自动继承预取数据
  // 第一阶段：获取chainData
  const { data: chainData, isPending: isChainLoading } = useQuery({
    queryKey: ["chainData"],
    queryFn: fetchChainData,
    // 2025新增网络优先级标记
    meta: { priority: "high" },
  });

  console.log("chainData", chainData);
  // 第二阶段：基于chainData获取价格
  const { data: priceData, isPending: isPriceLoading } = useQuery({
    queryKey: chainData
      ? [
          "currentPrice",
          chainData.map((c) => ({
            chainIndex: c.chainIndex,
            tokenAddress: "",
          })),
        ]
      : ["currentPrice", []], // 处理未加载数据的情况
    queryFn: fetchCurrentPrice,
    enabled: !!chainData, // 串行触发条件
  });

  useEffect(() => {
    if (chainData && priceData) {
      const priceMap = new Map(priceData.map((p) => [p.chainIndex, p.price]));

      setMergedData(
        chainData.map((chain) => ({
          ...chain,
          price: priceMap.get(chain.chainIndex) || "0.00",
        })),
      );
    }
  }, [chainData, priceData]); // 仅依赖必要数据

  return (
    <BottomDrawer>
      <ChainInfo data={mergedData} handleClick={selectChain} />
    </BottomDrawer>
  );
}
