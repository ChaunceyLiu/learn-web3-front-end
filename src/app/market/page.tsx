// app/market/page.tsx
import ChainPanel from "./components/chainPanel";
import Charts from "./components/charts";
import BaseInfoCard from "./components/baseInfoCard";
import { createQueryClient } from "@/trpc/query-client";
import { fetchChainData } from "@lib/chainData";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";


export default async function Market() {
  const queryClient = createQueryClient();
  // 使用React Query标准预取方式
  await queryClient.prefetchQuery({
    queryKey: ["chainData"],
    queryFn: fetchChainData,
    staleTime: 60_000, // 1分钟缓存
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="bg-gradient-to-{} flex min-h-screen flex-col items-center from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 p-4">
          <BaseInfoCard></BaseInfoCard>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Charts></Charts>
          </div>
        </div>
        <ChainPanel></ChainPanel>
      </main>
    </HydrationBoundary>
  );
}
