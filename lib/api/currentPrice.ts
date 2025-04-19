import type { QueryFunctionContext } from "@tanstack/react-query";
import type { IChainPrice, ICurrentPrice } from "@/type";

const API_ENDPOINT = process.env.CHAIN_DATA_API || "http://localhost:3001";

export const fetchCurrentPrice = async (
  context: QueryFunctionContext<[string, IChainPrice[]]>,
): Promise<ICurrentPrice[]> => {
  const [, params] = context.queryKey;

  const _params = new URLSearchParams({
    q: JSON.stringify(params),
  });

  const response = await fetch(
    `${API_ENDPOINT}/chain-data/getCurrenciesPrice?${_params}`,
    {
      next: {
        tags: ["chain-data"],
        revalidate: 60,
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
