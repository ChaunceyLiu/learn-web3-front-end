"use client";
import { useMarketStore, type MarketStoreState } from "@/store/market";
import Image from "next/image";
export default function Market() {
  const { shortName, name, logoUrl } = useMarketStore(
    (state) => state as MarketStoreState,
  );
  return (
    <div className="flex flex-row items-center">
      <Image src={logoUrl} alt="icon" width={36} height={36}></Image>
      <span className="px-2 text-3xl font-extrabold tracking-tight sm:text-[5rem]">
        {name}
      </span>
      <span className="text-sm text-[hsl(280,100%,70%)]">({shortName})</span>
    </div>
  );
}
