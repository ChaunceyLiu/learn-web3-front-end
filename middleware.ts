// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

const PROD = "https://learn-web3-back-end.vercel.app";
const DEV = "http://localhost:3000";

export const config = {
  matcher: [
    {
      source: '/api/(.*)',
      missing: [
        { type: 'header', key: 'x-middleware-bypass' }
      ]
    }
  ]
}

export default function middleware(request: NextRequest) {
  const debugHeader = new Headers(request.headers);
  debugHeader.set('x-middleware-version', '2025.5');

  // 提取路径和查询参数
  const originalPath = request.nextUrl.pathname;
  const pathWithoutApi = originalPath.split('/api/')[1] || '';
  const searchParams = request.nextUrl.search; // 包含 ? 符号的查询参数

  // 构造完整的新 URL（包含查询参数）
  const newUrl = new URL(
    `/${pathWithoutApi}${searchParams}`, // 添加查询参数
    PROD
  );

  return NextResponse.rewrite(newUrl, { headers: debugHeader });
}