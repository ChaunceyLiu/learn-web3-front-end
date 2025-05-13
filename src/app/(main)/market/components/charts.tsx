"use client";

import {
  createChart,
  LineSeries,
  type DeepPartial,
  type LineStyleOptions,
  type SeriesOptionsCommon,
} from "lightweight-charts";
import { useCallback, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { useMarketStore, type MarketStoreState } from "@/store/market";
import { fetchHistoricalPrice } from "@lib/historicalPrice";
import type { IHistoricalPricesData } from "@lib/historicalPrice";

// ==================== 类型定义 ====================
type DataPoint = {
  time: number;
  value: number;
};

type ChartConfig = {
  layout: {
    background: { color: string };
    textColor: string;
  };
  dimensions: {
    height: number;
    initialWidth: number;
  };
  lineStyle: DeepPartial<LineStyleOptions & SeriesOptionsCommon>;
};

// ==================== 全局配置 ====================
const CHART_CONFIG: ChartConfig = {
  layout: {
    background: { color: "transparent" },
    textColor: "#fff",
  },
  dimensions: {
    height: 300,
    initialWidth: 800,
  },
  lineStyle: {
    color: "#05CBE7",
    lineWidth: 2,
  },
};

const TIME_OPTIONS = [
  { name: "1m", value: "1m" },
  { name: "5m", value: "5m" },
  { name: "30m", value: "30m" },
  { name: "1h", value: "1h" },
  { name: "1d", value: "1d" },
];

const SWR_CONFIG = {
  revalidateOnFocus: false,
  refreshInterval: 1000,
  dedupingInterval: 500,
  errorRetryCount: 3,
};

// ==================== 自定义 Hooks ====================
const useChartManager = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ReturnType<typeof createChart>>(null);
  const lineSeries = useRef<any>(null);
  const isMounted = useRef(true);

  // 初始化图表
  const initializeChart = useCallback(() => {
    if (!chartContainerRef.current || chartInstance.current) return;

    chartInstance.current = createChart(chartContainerRef.current, {
      ...CHART_CONFIG.layout,
      width:
        chartContainerRef.current.clientWidth ||
        CHART_CONFIG.dimensions.initialWidth,
      height: CHART_CONFIG.dimensions.height,
    });

    // lineSeries.current = chartInstance.current.addLineSeries(CHART_CONFIG.lineStyle);
    lineSeries.current = chartInstance.current.addSeries(
      LineSeries,
      CHART_CONFIG.lineStyle,
    );
  }, []);

  // 安全更新数据
  const safeUpdate = useCallback((dataPoint: DataPoint) => {
    try {
      lineSeries.current?.update(dataPoint);
      chartInstance.current?.timeScale().scrollToPosition(5, false);
    } catch (error) {
      console.error("图表更新失败:", error);
    }
  }, []);

  // 设置历史数据
  const setHistoricalData = useCallback((data: DataPoint[]) => {
    if (!lineSeries.current) return;
    lineSeries.current.setData(data);
    chartInstance.current?.timeScale().fitContent();
  }, []);

  // 清理函数
  useEffect(
    () => () => {
      chartInstance.current?.remove();
      chartInstance.current = null;
      isMounted.current = false;
    },
    [],
  );

  return { chartContainerRef, initializeChart, safeUpdate, setHistoricalData };
};

const usePriceData = (selectedChain: string, dimension: string) => {
  const fetcher = useCallback(async ([endpoint, params]: [string, any]) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = new Error("行情数据获取失败");
      Object.assign(error, { info: await response.json() });
      throw error;
    }

    return response.json();
  }, []);

  const { data: rawData } = useSWR<IHistoricalPricesData[]>(
    ["/api/chain-data/getRealTimePrice", { chainIndex: selectedChain }],
    fetcher,
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
  }, [selectedChain, dimension]);

  return { rawData, fetchChartData };
};

// ==================== 子组件 ====================
const TimeButtonGroup = ({
  options,
  onChange,
}: {
  options: typeof TIME_OPTIONS;
  onChange: (value: string) => void;
}) => (
  <div>
    {options.map((option) => (
      <button
        key={option.value}
        className="mr-2 rounded bg-blue-500 px-4 py-2 text-white"
        onClick={() => onChange(option.value)}
      >
        {option.name}
      </button>
    ))}
  </div>
);

// ==================== 主组件 ====================
export default function TradingChart() {
  const { selectedChain } = useMarketStore(
    (state) => state as MarketStoreState,
  );
  const [dimension, setDimension] = useState("1m");
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  const { chartContainerRef, initializeChart, safeUpdate, setHistoricalData } =
    useChartManager();
  const { rawData, fetchChartData } = usePriceData(selectedChain, dimension);

  // 初始化加载历史数据
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const historicalData = await fetchChartData();
        if (historicalData?.length) {
          setHistoricalData(historicalData);
          setInitialDataLoaded(true);
        }
      } catch (error) {
        console.error("初始化数据加载失败:", error);
      }
    };

    initializeChart();
    if (!initialDataLoaded) void loadInitialData();
  }, [fetchChartData, initialDataLoaded, initializeChart, setHistoricalData]);

  // 实时数据更新
  useEffect(() => {
    if (!rawData || !initialDataLoaded) return;

    const realTimePoint = {
      time: new Date().getTime(),
      value: Number(rawData[0]?.price),
    };

    safeUpdate(realTimePoint);
  }, [rawData, initialDataLoaded, safeUpdate]);

  return (
    <div>
      <div ref={chartContainerRef} style={{ width: "100%" }} />
      <TimeButtonGroup options={TIME_OPTIONS} onChange={setDimension} />
    </div>
  );
}
