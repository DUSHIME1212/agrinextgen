import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { authenticate, checkRole } from "@/middleware/auth"

// Update cart item
export async function PUT(req: NextRequest, { params }: { params: { itemId: string } }) {
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

    const itemId = params.itemId
    const body = await req.json()
    const { quantity } = body
    
    if (!quantity || quantity <= 0) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 })
    }
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
      },
    })

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    if (!user || cartItem.cart.userId !== user.id) {
      return NextResponse.json({ error: "You are not authorized to update this cart item" }, { status: 403 })
    }
    await prisma.cartItem.update({
      where: { id: itemId },
      data: {
        quantity,
      },
    })
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        items: {
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

    return NextResponse.json(updatedCart)
  } catch (error) {
    console.error("Error updating cart item:", error)
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 })
  }
}
export async function DELETE(req: NextRequest, { params }: { params: { itemId: string } }) {
  try {
    const { error, status, user } = await authenticate(req)

    if (error) {
      return NextResponse.json({ error }, { status })
    }
    const roleCheck = checkRole(user, ["CUSTOMER", "ADMIN"])
    if (roleCheck.error) {
      return NextResponse.json({ error: roleCheck.error }, { status: roleCheck.status })
    }

    const itemId = params.itemId

    // Get cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
      },
    })

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }
    if (!user || cartItem.cart.userId !== user.id) {
      return NextResponse.json({ error: "You are not authorized to remove this cart item" }, { status: 403 })
    }
    await prisma.cartItem.delete({
      where: { id: itemId },
    })
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        items: {
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

    return NextResponse.json(updatedCart)
  } catch (error) {
    console.error("Error removing cart item:", error)
    return NextResponse.json({ error: "Failed to remove cart item" }, { status: 500 })
  }
}

