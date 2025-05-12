import type { QueryFunction } from "@tanstack/react-query";
import type { IChainData } from "@/type";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_HOST || "/api";

export const fetchChainData: QueryFunction<IChainData[]> = async () => {
  const response = await fetch(
    `${API_ENDPOINT}/chain-data/getSupportedChainData`,
    {
      next: {
        tags: ["chain-data"], // 使用Next.js缓存标签
        revalidate: 60, // 增量静态生成(ISR)
      },
      headers: { "Content-Type": "application/json" },
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`[${response.status}] ${error.message}`);
  }

  return response.json();
};
