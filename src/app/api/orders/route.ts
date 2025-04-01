import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { authenticate, checkRole } from "@/middleware/auth"

// Get user's orders
export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const { error, status, user } = await authenticate(req)

    if (error) {
      return NextResponse.json({ error }, { status })
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const orderStatus = searchParams.get("status")

    // Build where clause
    const where: any = {}

    if (user.role === "CUSTOMER") {
      where.customerId = user.id
    } else if (user.role === "SELLER") {
      where.orderItems = {
        some: {
          product: {
            sellerId: user.id,
          },
        },
      }
    }

    if (orderStatus) {
      where.status = orderStatus
    }

    // Get orders
    const orders = await prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                productimg: true,
                seller: {
                  select: {
                    id: true,
                    name: true,
                    businessName: true,
                  },
                },
              },
            },
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

// Create a new order
export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const { error, status, user } = await authenticate(req)

    if (error) {
      return NextResponse.json({ error }, { status })
    }

    // Check if user is a customer
    const roleCheck = checkRole(user, ["CUSTOMER", "ADMIN"])
    if (roleCheck.error) {
      return NextResponse.json({ error: roleCheck.error }, { status: roleCheck.status })
    }

    // Parse request body
    const body = await req.json()
    const { items, shippingAddress, paymentMethod } = body

    // Validate input
    if (!items || !items.length || !shippingAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get product details for all items
    const productIds = items.map((item: any) => item.productId)
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    })

    // Calculate total amount
    let totalAmount = 0
    const orderItems = items.map((item: any) => {
      const product = products.find((p) => p.id === item.productId)
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`)
      }

      const price = product.discount ? product.price - product.discount : product.price

      totalAmount += price * item.quantity

      return {
        productId: item.productId,
        quantity: item.quantity,
        price,
      }
    })

    // Create order
    const order = await prisma.order.create({
      data: {
        customerId: user.id,
        totalAmount,
        shippingAddress,
        paymentMethod,
        orderItems: {
          create: orderItems,
        },
      },
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
    })

    // Clear user's cart after order is created
    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
    })

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      })
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

