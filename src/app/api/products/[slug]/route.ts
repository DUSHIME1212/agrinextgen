import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { authenticate } from "@/middleware/auth"

// Get product by slug
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = await params

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        productimg: true,
        seller: {
          select: {
            id: true,
            name: true,
            businessName: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

// Update product by slug
export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { error, status, user } = await authenticate(req)
    if (error) return NextResponse.json({ error }, { status })

    const { slug } = params
    const body = await req.json()

    const product = await prisma.product.findUnique({
      where: { slug },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Authorization check
    if (product.sellerId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { slug },
      data: { ...body, updatedAt: new Date() },
    })

    // Handle images if provided
    if (body.images) {
      await prisma.productImage.deleteMany({ where: { productId: product.id } })
      await prisma.productImage.createMany({
        data: body.images.map((url: string) => ({
          productId: product.id,
          url,
        })),
      })
    }

    return NextResponse.json(await prisma.product.findUnique({
      where: { slug },
      include: { productimg: true },
    }))
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

// Delete product by slug
export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { error, status, user } = await authenticate(req)
    if (error) return NextResponse.json({ error }, { status })

    const { slug } = params

    const product = await prisma.product.findUnique({
      where: { slug },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Authorization check
    if (product.sellerId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Delete related records
    await prisma.productImage.deleteMany({ where: { productId: product.id } })
    await prisma.product.delete({ where: { slug } })

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}