//app/market/components/chainPanel.tsx
"use client";
import ChainInfo from "./chainInfo";
import BottomDrawer from "./bottomDrawer";
import { useEffect, useState } from "react";
import { useMarketStore } from "@/store/market";
import type { MarketStoreState } from "@/store/market";
import { useQuery } from "@tanstack/react-query";
import { fetchChainData } from "../page";

export interface IChainData {
  name: string;
  logUrl: string;
  shortName: string;
  chainIndex: string;
}

export interface IChainPrice {
  chainIndex: string;
  tokenAddress: string;
}

async function getChainData(params: IChainPrice[]) {
  const _params = new URLSearchParams({
    q: JSON.stringify(params),
  });
  const res = await fetch(
    `http://localhost:3001/chain-data/getCurrenciesPrice?${_params}`,
  );
  if (!res.ok) {
    // 由最近的 error.js 处理
    throw new Error("Failed to fetch data");
  }
  return res.json();
}
// 1️⃣ 使用 React Query 进行数据获取和缓存
export default function ChainPanel(props: any) {
  console.log("ChainPanel", props);
  const [data, setData] = useState<Array<IChainData & { price: string }>>([]);
  const updateSelectedChain = useMarketStore(
    (state) => (state as MarketStoreState).updateSelectedChain,
  );

  const selectChain = (chain: IChainData) => {
    updateSelectedChain(chain);
  };

  // React Query 客户端自动继承预取数据
  // const {
  //   data: cachedData,
  //   error,
  //   isPending,
  // } = useQuery({
  //   queryKey: [["chainData"]],
  //   queryFn: fetchChainData,
  // });

  // useEffect(() => {
  //   const result: Array<IChainData & { price: string }> = [];

  //   const fetchAndCache = async () => {
  //     console.log("cachedData", cachedData);
  //     if (cachedData) {
  //       // 3️⃣ 使用缓存数据继续后续逻辑
  //       const res = await getChainData(
  //         cachedData?.data?.map((chain) => ({
  //           chainIndex: chain.chainIndex,
  //           tokenAddress: "",
  //         })),
  //       );
  //       const priceMap = new Map();
  //       res.forEach((price: IChainPrice) => {
  //         priceMap.set(price.chainIndex, price);
  //       });
  //       cachedData?.data?.forEach((chain: IChainData) => {
  //         result.push({
  //           ...chain,
  //           price: priceMap.get(chain.chainIndex).price,
  //         });
  //       });
  //       setData(result);
  //     }
  //   };

  //   fetchAndCache();
  // }, [cachedData]);
  // // useEffect(() => {
  // //   queryClient.prefetchQuery({
  // //     queryKey: ["supportedChainData"],
  // //     queryFn: getData,
  // //     staleTime: 5000, // 5秒内不重复请求
  // //   });
  // // }, [queryClient]);

  // // useEffect(() => {
  // //   const fetchData = async () => {
  // //     const _data: IChainData[] = await getData();
  // //     const result: Array<IChainData & { price: string }> = [];
  // //     if (_data) {
  // //       const res = await getChainData(
  // //         _data?.map((chain: IChainData) => ({
  // //           chainIndex: chain.chainIndex,
  // //           tokenAddress: "",
  // //         })),
  // //       );
  // //       const priceMap = new Map();
  // //       res.forEach((price: IChainPrice) => {
  // //         priceMap.set(price.chainIndex, price);
  // //       });
  // //       _data.forEach((chain: IChainData) => {
  // //         result.push({
  // //           ...chain,
  // //           price: priceMap.get(chain.chainIndex).price,
  // //         });
  // //       });
  // //       setData(result);
  // //     }
  // //   };
  // //   fetchData();
  // // }, []);

  return (
    <BottomDrawer>
      <ChainInfo data={data} handleClick={selectChain} />
    </BottomDrawer>
  );
}
