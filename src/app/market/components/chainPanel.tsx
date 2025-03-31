"use client";
import ChainInfo from "./chainInfo";
import BottomDrawer from "./bottomDrawer";
import { useEffect, useState } from "react";
import { useMarketStore } from "@/store/market";
import type { MarketStoreState } from "@/store/market";

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

async function getData(): Promise<IChainData[]> {
  const res = await fetch(
    "http://localhost:3001/chain-data/getSupportedChainData",
  );
  if (!res.ok) {
    // 由最近的 error.js 处理
    throw new Error("Failed to fetch data");
  }
  return res.json();
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

export default function ChainPanel() {
  const [data, setData] = useState<Array<IChainData & { price: string }>>([]);
  const updateSelectedChain = useMarketStore(
    (state) => (state as MarketStoreState).updateSelectedChain,
  );

  const selectChain = (chain: IChainData) => {
    updateSelectedChain(chain);
  };

  useEffect(() => {
    const fetchData = async () => {
      const _data: IChainData[] = await getData();
      const result: Array<IChainData & { price: string }> = [];
      if (_data) {
        const res = await getChainData(
          _data?.map((chain: IChainData) => ({
            chainIndex: chain.chainIndex,
            tokenAddress: "",
          })),
        );
        const priceMap = new Map();
        res.forEach((price: IChainPrice) => {
          priceMap.set(price.chainIndex, price);
        });
        _data.forEach((chain: IChainData) => {
          result.push({
            ...chain,
            price: priceMap.get(chain.chainIndex).price,
          });
        });
        setData(result);
      }
    };
    fetchData();
  }, []);

  return (
    <BottomDrawer>
      <ChainInfo data={data} handleClick={selectChain} />
    </BottomDrawer>
  );
}
