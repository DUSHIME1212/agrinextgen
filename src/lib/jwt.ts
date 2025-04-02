import jwt from "jsonwebtoken"
import type { User } from "@prisma/client"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"


type TokenPayload = {
  id: string
  email: string
  role: string
}


export function generateToken(user: User): string {
  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}


export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch (error) {
    return null
  }
}

