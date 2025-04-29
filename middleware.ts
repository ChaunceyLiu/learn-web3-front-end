// // middleware.ts (2025年最新语法)
// import { NextRequest, NextResponse } from 'next/server'

// export function middleware(request: NextRequest) {
//   const url = request.nextUrl
//   const headers = new Headers(request.headers)
  
//   // 设置新的标准头 ✅
//   headers.set('x-next-pathname', url.pathname)
//   console.log('middleware', url.pathname)
  
//   // 必须返回克隆后的响应 ✅
//   return NextResponse.next({
//     request: {
//       headers 
//     }
//   })
// }