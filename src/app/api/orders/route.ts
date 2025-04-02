import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { authenticate, checkRole } from "@/middleware/auth"


export async function GET(req: NextRequest) {
  try {
    
    const { error, status, user } = await authenticate(req)

    if (error) {
      return NextResponse.json({ error }, { status })
    }

    
    const { searchParams } = new URL(req.url)
    const orderStatus = searchParams.get("status")

    
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
    const { items, shippingAddress, paymentMethod } = body

    
    if (!items || !items.length || !shippingAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    
    const productIds = items.map((item: any) => item.productId)
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    })

    
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

