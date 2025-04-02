import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/jwt"
import prisma from "@/lib/prisma"

// Middleware to check if user is authenticated
export async function authenticate(req: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        error: "Unauthorized: No token provided",
        status: 401,
        user: null,
      }
    }

    // Extract the token
    const token = authHeader.split(" ")[1]

    // Verify the token
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

    // Get the user from the database
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        businessName: true,
        contactPerson: true,
      },
    })

    if (!user) {
      return {
        error: "Unauthorized: User not found",
        status: 401,
        user: null,
      }
    }

    // Return the user
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

// Check if user has required role
export function checkRole(user: any, roles: string[]) {
  if (!user) {
    return {
      error: "Unauthorized: Authentication required",
      status: 401,
    }
  }

  // Convert roles to uppercase for case-insensitive comparison
  const userRole = user.role.toUpperCase()
  const allowedRoles = roles.map((role) => role.toUpperCase())

  if (!allowedRoles.includes(userRole)) {
    return {
      error: "Forbidden: Insufficient permissions",
      status: 403,
    }
  }

  return { error: null, status: 200 }
}

