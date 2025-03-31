"use client";
import ChainPanel from "./components/chainPanel";
import Charts from "./components/charts";
import { useMarketStore, type MarketStoreState } from "@/store/market";
import Image from "next/image";
export default function Market() {
  const { selectedChain, shortName, name, logoUrl } = useMarketStore(
    (state) => state as MarketStoreState,
  );
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 p-4">
        <div className="flex flex-row items-center">
          <Image src={logoUrl} alt="icon" width={36} height={36}></Image>
          <span className="text-3xl font-extrabold tracking-tight sm:text-[5rem] px-2">{name}</span>
          <span className="text-sm text-[hsl(280,100%,70%)]">
            ({shortName})
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Charts></Charts>
        </div>
      </div>
      <ChainPanel></ChainPanel>
    </main>
  );
}
