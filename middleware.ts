import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"


type RouteConfig = {
  path: string | RegExp
  allowedUserTypes?: ("customer" | "seller")[]
}


const customerRoutes: RouteConfig[] = [
  { path: "/wishlist", allowedUserTypes: ["customer"] },
  { path: "/checkout", allowedUserTypes: ["customer"] },
  { path: "/order-history", allowedUserTypes: ["customer"] },
  { path: "/transactions", allowedUserTypes: ["customer"] },
  { path: /^\/order\/.*$/, allowedUserTypes: ["customer"] },
]


const sellerRoutes: RouteConfig[] = [
  { path: "/dashboard/products", allowedUserTypes: ["seller"] },
  { path: "/dashboard/add-product", allowedUserTypes: ["seller"] },
  { path: "/dashboard/analytics", allowedUserTypes: ["seller"] },
  { path: "/store-history", allowedUserTypes: ["seller"] },
]


const sharedProtectedRoutes: RouteConfig[] = [{ path: "/dashboard" }, { path: "/settings" }]


const protectedRoutes = [...customerRoutes, ...sellerRoutes, ...sharedProtectedRoutes]


const publicRoutes = [
  "/",
  "/auth",
  "/products",
  "/about",
  "/contact",
  "/api/auth/login",
  "/api/auth/register/customer",
  "/api/auth/register/seller",
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (
    publicRoutes.some((route) => pathname === route || pathname.startsWith("/api/") || pathname.startsWith("/_next/"))
  ) {
    return NextResponse.next()
  }


  const matchedRoute = protectedRoutes.find((route) =>
    typeof route.path === "string" ? pathname === route.path : route.path.test(pathname),
  )

  if (!matchedRoute) {
    return NextResponse.next()
  }


  const token = request.cookies.get("token")?.value

  if (!token) {
    const url = new URL("/auth", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  try {

    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify<{ role: string }>(token, secretKey)
    

    if (matchedRoute.allowedUserTypes && matchedRoute.allowedUserTypes.length > 0) {
      const userRole = payload.role.toLowerCase()  as string

      if (!matchedRoute.allowedUserTypes.includes(userRole as "customer" | "seller")) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }
    return NextResponse.next()
  } catch (error) {
    const response = NextResponse.redirect(new URL("/auth", request.url))
    response.cookies.delete("token")
    return response
  }
}


export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}

