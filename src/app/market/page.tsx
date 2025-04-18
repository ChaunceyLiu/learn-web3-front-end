// app/market/page.tsx
import ChainPanel from "./components/chainPanel";
import Charts from "./components/charts";
import BaseInfoCard from "./components/baseInfoCard";
import type { QueryFunction } from "@tanstack/react-query";
import type { IChainData } from "@/type";
import { createQueryClient } from "@/trpc/query-client";
import { api } from "@/trpc/server";

interface IResult {
  data: IChainData[];
  success: boolean;
  timeStamp: number;
}

// 强化类型的安全查询函数
export const fetchChainData: QueryFunction<IResult> = async () => {
  const res = await fetch(
    "http://localhost:3001/chain-data/getSupportedChainData",
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache", // 禁用浏览器缓存
      },
    },
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch chain data");
  }
  console.log("fetchChainData", res);
  return res.json();
};

export default async function Market() {
  console.log("Market================");
  const queryClient = createQueryClient();
  console.log("Market================", queryClient);
  // 服务端预取
  const res = await fetchChainData(null as any);
  console.log("fetchChainData================", res);

  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
    <main className="bg-gradient-to-{} flex min-h-screen flex-col items-center from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 p-4">
        <BaseInfoCard></BaseInfoCard>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          {/* <Charts></Charts> */}
        </div>
      </div>
      <ChainPanel initialDataLoaded={res}></ChainPanel>
    </main>
    // </HydrationBoundary>
  );
}
