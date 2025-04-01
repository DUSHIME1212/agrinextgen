import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { generateToken } from "@/lib/jwt"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    console.log("Registration request body:", body); 
    const { email, password, name, role, businessName, contactPerson, phoneNumber } = body

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

  
    const hashedPassword = await bcrypt.hash(password, 10)

 
    const userData = {
      email,
      password: hashedPassword,
      name,
      role: role || "CUSTOMER",
      ...(businessName && { businessName }),
      ...(contactPerson && { contactPerson }),
      ...(phoneNumber && { phoneNumber }),
    }

    const user = await prisma.user.create({
      data: userData,
    })
    const token = generateToken(user)
    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}

