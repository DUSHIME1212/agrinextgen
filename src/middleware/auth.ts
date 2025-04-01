import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/jwt"
import prisma from "@/lib/prisma"


export async function authenticate(req: NextRequest) {
  try {
    
    const authHeader = req.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        error: "Unauthorized: No token provided",
        status: 401,
        user: null,
      }
    }
    const token = authHeader.split(" ")[1]
    if (!token) {
      return {
        error: "Unauthorized: No token provided",
        status: 401,
        user: null,
      }
    }
    const payload = verifyToken(token)

    if (!payload) {
      return {
        error: "Unauthorized: Invalid token",
        status: 401,
        user: null,
      }
    }
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    if (!user) {
      return {
        error: "Unauthorized: User not found",
        status: 401,
        user: null,
      }
    }
    return {
      error: null,
      status: 200,
      user,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return {
      error: "Internal server error",
      status: 500,
      user: null,
    }
  }
}
export function checkRole(user: any, roles: string[]) {
  if (!user) {
    return {
      error: "Unauthorized: Authentication required",
      status: 401,
    }
  }

  if (!roles.includes(user.role)) {
    return {
      error: "Forbidden: Insufficient permissions",
      status: 403,
    }
  }

  return { error: null, status: 200 }
}

