"use client";
import { createChart, LineSeries } from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import qs from "qs";
import { useMarketStore, type MarketStoreState } from "@/store/market";

interface IHistoricalData {
  cursor: string;
  prices: IHistoricalPricesData[];
}

interface IHistoricalPricesData {
  time: string;
  price: string;
}

async function getData(params: {
  period: string;
  chainIndex: string;
}): Promise<IHistoricalData[]> {
  const res = await fetch(
    `http://localhost:3001/chain-data/getHistoricalPrice?${qs.stringify(params)}`,
  );
  if (!res.ok) {
    // 由最近的 error.js 处理
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export default function TradingChart() {
  const { selectedChain } = useMarketStore(
    (state) => state as MarketStoreState,
  );
  const chartContainer = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ReturnType<typeof createChart>>(null);
  const lineSeries = useRef<any>(null);
  const [dimension, setDimension] = useState("1d");
  const fetchChartData = async () => {
    const data = await getData({
      chainIndex: selectedChain,
      period: dimension,
    });
    return data?.[0]?.prices
      .map((item) => ({
        time: Number(item.time) / 1000,
        value: Number(item.price),
      }))
      .sort((a, b) => a.time - b.time);
  };

  useEffect(() => {
    if (!chartInstance.current) {
      chartInstance.current = createChart(chartContainer.current!, {
        layout: {
          background: { color: "transparent" },
          textColor: "#fff",
        },
        width: chartContainer.current?.clientWidth || 0,
        height: 300,
      });

      lineSeries.current = chartInstance.current.addSeries(LineSeries, {
        color: "#05CBE7",
        lineWidth: 2,
      });
    }

    // 数据更新逻辑
    const loadData = async () => {
      const data = await fetchChartData();
      lineSeries.current?.setData(data);
      chartInstance.current?.timeScale().fitContent();
    };

    loadData();

    // 正确清理函数
    return () => {
      if (chartInstance.current) {
        chartInstance.current.remove();
        chartInstance.current = null;
      }
    };
  }, [dimension, selectedChain]);

  const options = [
    { name: "1m", value: "1m" },
    { name: "5m", value: "5m" },
    { name: "30m", value: "30m" },
    { name: "1h", value: "1h" },
    { name: "1d", value: "1d" },
  ];

  return (
    <div>
      <div ref={chartContainer} style={{ width: "100%" }} />
      <div>
        {options.map((option) => (
          <button
            key={option.value}
            className="mr-2 rounded bg-blue-500 px-4 py-2 text-white"
            onClick={() => {
              // Handle the click event for the button
              setDimension(option.value);
            }}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
}
