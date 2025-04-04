import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { authenticate, checkRole } from "@/middleware/auth"


export async function GET(req: NextRequest) {
  try {
    
    const { error, status, user } = await authenticate(req)

    if (error) {
      return NextResponse.json({ error }, { status })
    }


    const roleCheck = checkRole(user, ["CUSTOMER", "ADMIN"])
    if (roleCheck.error) {
      return NextResponse.json({ error: roleCheck.error }, { status: roleCheck.status })
    }

    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    let cart = await prisma.cart.findFirst({
      where: { userId: user.id },
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

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
        },
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
    }

    return NextResponse.json(cart)
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
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
    const { productId, quantity } = body

    
    if (!productId || !quantity || quantity <= 0) {
      return NextResponse.json({ error: "Invalid product ID or quantity" }, { status: 400 })
    }

    
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    
    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    let cart = await prisma.cart.findFirst({
      where: { userId: user.id },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
        },
      })
    }

    
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    })

    if (existingItem) {
      
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
          price: product.price,
        },
      })
    } else {
      
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          price: product.price,
        },
      })
    }


    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
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
    console.error("Error adding item to cart:", error)
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 })
  }
}

