import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { authenticate, checkRole } from "@/middleware/auth"


export async function GET(req: NextRequest) {
  try {
    
    const { error, status, user } = await authenticate(req)

    if (error) {
      return NextResponse.json({ error }, { status })
    }

    
    const roleCheck = checkRole(user, ["CUSTOMER", "ADMIN", "SELLER"]) 
    if (roleCheck.error) {
      return NextResponse.json({ error: roleCheck.error }, { status: roleCheck.status })
    }

    
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: user.id },
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
    })

    return NextResponse.json(wishlist)
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 })
  }
}


export async function POST(req: NextRequest) {
  try {
    
    const { error, status, user } = await authenticate(req)

    if (error) {
      return NextResponse.json({ error }, { status })
    }

    
    const roleCheck = checkRole(user, ["CUSTOMER", "ADMIN", "SELLER"]) 
    if (roleCheck.error) {
      return NextResponse.json({ error: roleCheck.error }, { status: roleCheck.status })
    }

    
    const body = await req.json()
    const { productId } = body

    
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    
    const existingItem = await prisma.wishlist.findFirst({
      where: {
        userId: user.id,
        productId,
      },
    })

    if (existingItem) {
      return NextResponse.json({ error: "Product already in wishlist" }, { status: 400 })
    }

    
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: user.id,
        productId,
      },
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
    })

    return NextResponse.json(wishlistItem, { status: 201 })
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 })
  }
}

