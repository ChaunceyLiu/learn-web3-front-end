import { create } from "zustand";
import { type IChainData } from "@/type";

export interface MarketState {
  selectedChain: string;
}

export interface MarketStoreState {
  selectedChain: string;
  logoUrl: string;
  name: string;
  shortName: string;
  updateSelectedChain: (chain: IChainData) => void;
}

export const useMarketStore = create((set) => ({
  selectedChain: "1",
  name: "Ethereum",
  shortName: "eth",
  logoUrl: "https://static.coinall.ltd/cdn/wallet/logo/ETH-20220328.png",

  updateSelectedChain: (chain: IChainData) =>
    set(() => ({
      selectedChain: chain.chainIndex,
      ...chain,
    })),
}));
