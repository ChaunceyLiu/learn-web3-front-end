// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export async function middleware(request: NextRequest) {
//   if (request.nextUrl.pathname.startsWith('/api')) {
//     const target = new URL(
//       request.nextUrl.pathname.replace('/api', ''),
//       'http://localhost:3000'
//     )
    
//     return NextResponse.rewrite(target, {
//       request: {
//         headers: new Headers(request.headers)
//       }
//     })
//   }
//   return NextResponse.next()
// }