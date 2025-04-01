import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { generateToken } from "@/lib/jwt"

export async function POST(req: NextRequest) {
    try {
      const body = await req.json()
      const { identifier, password } = body
  

      const user = await prisma.user.findUnique({
        where: { email: identifier },
      })
  
      if (!user) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
      }
  
      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password)
  
      if (!isPasswordValid) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
      }
      const token = generateToken(user)
  
      // Return user data and token
      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          ...(user.businessName && { businessName: user.businessName }),
          ...(user.contactPerson && { contactPerson: user.contactPerson }),
        },
        token,
      })
    } catch (error) {
      console.error("Login error:", error)
      return NextResponse.json({ error: "Failed to login" }, { status: 500 })
    }
  }
  
  