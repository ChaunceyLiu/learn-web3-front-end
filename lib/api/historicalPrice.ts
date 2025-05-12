import qs from "qs";

export interface IHistoricalData {
  cursor: string;
  prices: IHistoricalPricesData[];
}

export interface IHistoricalPricesData {
  time: string;
  price: string;
}

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_HOST || "/api";

export async function fetchHistoricalPrice(params: {
  period: string;
  chainIndex: string;
}): Promise<IHistoricalData[]> {
  const res = await fetch(
    `${API_ENDPOINT}/chain-data/getHistoricalPrice?${qs.stringify(params)}`,
  );
  if (!res.ok) {
    // 由最近的 error.js 处理
    throw new Error("Failed to fetch data");
  }
  return res.json();
}
