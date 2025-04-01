import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { authenticate, checkRole } from "@/middleware/auth"

// Get payment details
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Authenticate user
    const { error, status, user } = await authenticate(req)

    if (error) {
      return NextResponse.json({ error }, { status })
    }

    const paymentId = params.id

    // Get payment
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
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
    })

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    // Check if payment belongs to user or user is admin
    if (!user || (payment.userId !== user.id && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "You are not authorized to view this payment" }, { status: 403 })
    }

    return NextResponse.json(payment)
  } catch (error) {
    console.error("Error fetching payment:", error)
    return NextResponse.json({ error: "Failed to fetch payment" }, { status: 500 })
  }
}

// Update payment status
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Authenticate user
    const { error, status, user } = await authenticate(req)

    if (error) {
      return NextResponse.json({ error }, { status })
    }

    // Check if user is admin
    const roleCheck = checkRole(user, ["ADMIN"])
    if (roleCheck.error) {
      return NextResponse.json({ error: roleCheck.error }, { status: roleCheck.status })
    }

    const paymentId = params.id
    const body = await req.json()
    const { status: paymentStatus } = body

    // Validate input
    if (!paymentStatus) {
      return NextResponse.json({ error: "Payment status is required" }, { status: 400 })
    }

    // Get payment
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: true,
      },
    })

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    // Update payment status
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: paymentStatus,
      },
      include: {
        order: true,
      },
    })

    // Update order status if payment status changes
    if (paymentStatus === "completed" && payment.order.paymentStatus !== "paid") {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          paymentStatus: "paid",
          status: "processing",
        },
      })
    } else if (paymentStatus === "failed" && payment.order.paymentStatus !== "failed") {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          paymentStatus: "failed",
        },
      })
    }

    return NextResponse.json(updatedPayment)
  } catch (error) {
    console.error("Error updating payment:", error)
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 })
  }
}

