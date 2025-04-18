// app/api/v1/chain-data/route.ts
import { NextResponse } from "next/server";
import type { IChainData } from "@/type";

// 强制动态路由（禁用缓存）
export const dynamic = "force-dynamic";
export const runtime = "edge"; // 启用边缘计算（2025 推荐）

// 环境变量配置（通过 .env.local 管理）
const BACKEND_URL = process.env.CHAIN_API_ENDPOINT || "http://localhost:3001";

export async function GET() {
  try {
    // 代理到后端服务（2025 新增安全验证）
    const response = await fetch(
      `${BACKEND_URL}/chain-data/getSupportedChainData`,
      {
        next: { revalidate: 30 }, // ISR 增量更新
        headers: {
          "API-Key": process.env.INTERNAL_API_KEY!, // 服务间通信密钥
        },
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Backend error: ${error.message}`);
    }

    const data: IChainData[] = await response.json();

    // 2025 推荐响应格式
    return NextResponse.json(
      {
        success: true,
        data,
        timestamp: Date.now(),
      },
      {
        status: 200,
        headers: {
          "CDN-Cache-Control": "public, s-maxage=30", // 边缘节点缓存
          "Vercel-CDN-Cache-Control": "max-age=30",
        },
      },
    );
  } catch (error) {
    // 结构化错误处理
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        errorCode: "CHAIN_DATA_FETCH_FAILED",
      },
      {
        status: 500,
        headers: {
          "Error-Type": "ServerError",
        },
      },
    );
  }
}
