"use client";
import { createChart, LineSeries } from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import qs from "qs";
import { useMarketStore, type MarketStoreState } from "@/store/market";
import useSWR from "swr";

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
  const [dimension, setDimension] = useState("1m");
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const lastUpdateTime = useRef<number>(0);
  const abortController = useRef(new AbortController());
  const isMounted = useRef(true);

  // SWR配置s
  const SWR_CONFIG = {
    revalidateOnFocus: false,
    refreshInterval: 1000, // 1秒轮询
    dedupingInterval: 500,
    errorRetryCount: 3,
    onSuccess: (newData: IHistoricalPricesData[]) => {
      // 标记初始数据加载完成
      if (!initialDataLoaded && newData?.length > 0) {
        setInitialDataLoaded(true);
      }
    },
  };

  // 在组件外定义全局fetcher（推荐使用工厂模式）
  const postFetcher =
    (endpoint: string) => async (params: Record<string, any>) => {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Chain-Index": params.chainIndex, // 区块链专用头
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = new Error("行情数据获取失败");
        (error as any).info = await response.json();
        throw error;
      }

      return response.json();
    };

  const { data: rawData } = useSWR<IHistoricalPricesData[]>(
    [
      `http://localhost:3001/chain-data/getRealTimePrice`,
      [
        {
          chainIndex: selectedChain,
          tokenAddress: "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72",
        },
      ],
    ],
    ([endpoint, params]: [string, Record<string, any>]) =>
      postFetcher(endpoint)(params),
    SWR_CONFIG,
  );
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

  // 实时数据更新改造
  useEffect(() => {
    if (
      !isMounted.current ||
      !rawData ||
      !lineSeries.current ||
      !initialDataLoaded
    )
      return;

    const safeUpdate = () => {
      try {
        const realTimePoints = {
          time: new Date().getTime(),
          value: Number(rawData?.[0]?.price),
        };

        if (realTimePoints.time && realTimePoints.value) {
          lineSeries.current.update(realTimePoints);

          // 使用RAF保证更新时序
          requestAnimationFrame(() => {
            chartInstance.current?.timeScale().scrollToPosition(5, false);
          });
        }
      } catch (error) {
        console.error("Safe update failed:", error);
      }
    };

    safeUpdate();
  }, [rawData, initialDataLoaded]);

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
    const loadInitialData = async () => {
      const historicalData = await fetchChartData();
      if (historicalData && historicalData?.length > 0) {
        lineSeries.current?.setData(historicalData);
        lastUpdateTime.current = Math.max(...historicalData.map((p) => p.time));
        chartInstance.current?.timeScale().fitContent();
        setInitialDataLoaded(true);
        isMounted.current = true;
      }
    };

    if (!initialDataLoaded) {
      loadInitialData();
    }

    // 正确清理函数
    return () => {
      if (chartInstance.current) {
        chartInstance.current.remove();
        chartInstance.current = null;
      }
    };
  }, [dimension, selectedChain, initialDataLoaded]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      abortController.current.abort();

      // 完全清理图表相关引用
      if (chartInstance.current) {
        chartInstance.current.remove();
        chartInstance.current = null;
        lineSeries.current = null;
      }
    };
  }, []);

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
