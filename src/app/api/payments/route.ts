import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { authenticate, checkRole } from "@/middleware/auth"


export async function GET(req: NextRequest) {
  try {
    
    const { error, status, user } = await authenticate(req)

    if (error) {
      return NextResponse.json({ error }, { status })
    }

    
    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    const payments = await prisma.payment.findMany({
      where: { userId: user.id },
      include: {
        order: {
          include: {
            orderItems: {
              include: {
                product: {
                  include: {
                    productimg: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error("Error fetching payments:", error)
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
}


export async function POST(req: NextRequest) {
  try {
    
    const { error, status, user } = await authenticate(req)

    if (error) {
      return NextResponse.json({ error }, { status })
    }

    
    const roleCheck = checkRole(user, ["CUSTOMER", "ADMIN"])
    if (roleCheck.error) {
      return NextResponse.json({ error: roleCheck.error }, { status: roleCheck.status })
    }

    
    const body = await req.json()
    const { orderId, amount, method, transactionId } = body

    
    if (!orderId || !amount || !method || !transactionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    
    if (!user || (order.customerId !== user.id && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "You are not authorized to make payment for this order" }, { status: 403 })
    }

    
    const existingPayment = await prisma.payment.findUnique({
      where: { orderId },
    })

    if (existingPayment) {
      return NextResponse.json({ error: "Payment already exists for this order" }, { status: 400 })
    }

    
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        orderId,
        amount,
        method,
        transactionId,
        status: "completed", 
      },
    })

    
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "paid",
        status: "processing", 
      },
    })

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error("Error creating payment:", error)
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}

