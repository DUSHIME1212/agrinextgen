import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { authenticate, checkRole } from "@/middleware/auth"
import { slugify } from "@/lib/utils"


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const sellerId = searchParams.get("sellerId")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    
    const where: any = {
      
    }

    if (category) {
      where.Category = category
    }

    if (sellerId) {
      where.sellerId = sellerId
    }

    
    const products = await prisma.product.findMany({
      where,
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
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    })

    
    const total = await prisma.product.count({ where })

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}


export async function POST(req: NextRequest) {
  try {
    
    const { error, status, user } = await authenticate(req)

    if (error) {
      return NextResponse.json({ error }, { status })
    }

    
    const roleCheck = checkRole(user, ["SELLER", "ADMIN"])
    if (roleCheck.error) {
      return NextResponse.json({ error: roleCheck.error }, { status: roleCheck.status })
    }

    
    const body = await req.json()
    const {
      name,
      price,
      productStatus,
      productDescription,
      features,
      growingSeason,
      sunExposure,
      wateringNeeds,
      spacing,
      harvestTime,
      soilRequirements,
      plantingDepth,
      companions,
      SKU,
      Brand,
      ShelfLife,
      Category,
      Storage,
      Certification,
      shippingReturns,
      isNew,
      discount,
      images,
    } = body

    
    const slug = slugify(name)

    
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    })

    if (existingProduct) {
      return NextResponse.json({ error: "Product with this name already exists" }, { status: 400 })
    }

    
    const product = await prisma.product.create({
      data: {
        documentId: `prod_${Date.now()}`,
        name,
        price: Number.parseFloat(price),
        productStatus,
        productDescription,
        features,
        growingSeason,
        sunExposure,
        wateringNeeds,
        spacing,
        harvestTime,
        soilRequirements,
        plantingDepth,
        companions,
        SKU,
        Brand,
        ShelfLife,
        Category,
        Storage,
        Certification,
        shippingReturns,
        verified: user.role === "ADMIN", 
        isNew: isNew || true,
        discount: discount ? Number.parseFloat(discount) : null,
        slug,
        sellerId: user.id,
      },
    })

    
    if (images && images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map((url: string) => ({
          productId: product.id,
          url,
        })),
      })
    }

    
    const productWithImages = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        productimg: true,
      },
    })

    return NextResponse.json(productWithImages, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

