"use client";
import { createChart, LineSeries } from "lightweight-charts";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMarketStore, type MarketStoreState } from "@/store/market";
import useSWR from "swr";
import { fetchHistoricalPrice } from "@lib/historicalPrice";
import type { IHistoricalPricesData } from "@lib/historicalPrice";

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
          // "X-Chain-Index": params.chainIndex, // 区块链专用头
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
      `/api/chain-data/getRealTimePrice`,
      [
        {
          chainIndex: selectedChain,
          tokenAddress: "0xbd3531da5cf5857e7cfaa92426877b022e612cf8",
        },
      ],
    ],
    ([endpoint, params]: [string, Record<string, any>]) =>
      postFetcher(endpoint)(params),
    SWR_CONFIG,
  );

  const fetchChartData = useCallback(async () => {
    const data = await fetchHistoricalPrice({
      chainIndex: selectedChain,
      period: dimension,
    });
    return data?.[0]?.prices
      .map((item) => ({
        time: Number(item.time) / 1000,
        value: Number(item.price),
      }))
      .sort((a, b) => a.time - b.time);
  }, [selectedChain, dimension]); // 添加依赖项

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
      loadInitialData().catch((e) => {
        console.error("数据加载失败:", e);
      });
    }

    // 正确清理函数
    return () => {
      if (chartInstance.current) {
        chartInstance.current.remove();
        chartInstance.current = null;
      }
    };
  }, [dimension, selectedChain, initialDataLoaded, fetchChartData]);

  useEffect(() => {
    const controller = abortController.current;
    return () => {
      isMounted.current = false;
      controller.abort();

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
