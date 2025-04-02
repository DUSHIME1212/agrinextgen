import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting database seeding...")
  console.log("Cleaning up existing data...")
  await prisma.productImage.deleteMany({})
  await prisma.cartItem.deleteMany({})
  await prisma.cart.deleteMany({})
  await prisma.wishlist.deleteMany({})
  await prisma.review.deleteMany({})
  await prisma.orderItem.deleteMany({})
  await prisma.payment.deleteMany({})
  await prisma.order.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.user.deleteMany({})

  console.log("Creating users...")
  const adminPassword = await bcrypt.hash("admin123", 10)
  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: adminPassword,
      name: "Admin User",
      role: "ADMIN",
    },
  })
  console.log(`Created admin user: ${admin.email}`)

  const sellerPassword = await bcrypt.hash("seller123", 10)
  const seller = await prisma.user.create({
    data: {
      email: "seller@example.com",
      password: sellerPassword,
      name: "Seller User",
      role: "SELLER",
      businessName: "Green Thumb Nursery",
      contactPerson: "John Doe",
      phoneNumber: "555-123-4567",
    },
  })
  console.log(`Created seller user: ${seller.email}`)

  const customerPassword = await bcrypt.hash("customer123", 10)
  const customer = await prisma.user.create({
    data: {
      email: "customer@example.com",
      password: customerPassword,
      name: "Customer User",
      role: "CUSTOMER",
    },
  })
  console.log(`Created customer user: ${customer.email}`)

  console.log("Creating products...")
  
  const products = [
    {
      name: "Organic Tomato Seeds",
      price: 4.99,
      productStatus: "In Stock",
      productDescription:
        "High-quality organic tomato seeds for your garden. These heirloom seeds produce juicy, flavorful tomatoes perfect for salads and cooking.",
      features: "Non-GMO\nOrganic certified\nHigh germination rate\nDisease resistant",
      growingSeason: "Spring, Summer",
      sunExposure: "Full Sun",
      wateringNeeds: "Regular",
      spacing: "24-36 inches",
      harvestTime: "70-85 days",
      soilRequirements: "Well-draining, rich in organic matter",
      plantingDepth: "1/4 inch",
      companions: "Basil, Marigold, Carrots",
      SKU: "SEED-TOM-001",
      Brand: "GreenGrow",
      Category: "Seeds & Plants",
      Certification: "USDA Organic",
      shippingReturns: "Free shipping on orders over $25. Returns accepted within 30 days of purchase if unopened.",
      isNew: true,
      discount: 0,
      rating: 4.8,
      slug: "organic-tomato-seeds",
      sellerId: seller.id,
      verified: true,
      images: [
        "https://seed2plant.in/cdn/shop/products/tomatoseeds.jpg?v=1604033216",
        "https://5.imimg.com/data5/SELLER/Default/2020/9/JF/FP/AA/38589522/organic-tomato-seeds.jpg",
      ],
    },
    {
      name: "Heavy-Duty Garden Shears",
      price: 24.95,
      productStatus: "In Stock",
      productDescription:
        "Professional-grade garden shears with ergonomic handles and sharp stainless steel blades. Perfect for pruning shrubs, small branches, and harvesting.",
      features: "Stainless steel blades\nErgonomic non-slip handles\nSafety lock mechanism\nLightweight yet durable",
      SKU: "TOOL-SHR-002",
      Brand: "FarmTech",
      Category: "Equipment & Tools",
      shippingReturns: "Free shipping on orders over $25. 1-year warranty against manufacturing defects.",
      isNew: false,
      discount: 5.0,
      rating: 4.6,
      slug: "heavy-duty-garden-shears",
      sellerId: seller.id,
      verified: true,
      images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGOv8yuRzbBs-ZWK1HoP3o4lBvx8eFibdCWA&s"],
    },
    {
      name: "Organic Compost - 5kg Bag",
      price: 19.99,
      productStatus: "In Stock",
      productDescription:
        "Premium organic compost made from plant matter and natural ingredients. Enriches soil and provides essential nutrients for healthy plant growth.",
      features: "OMRI Listed\nPeat-free\nSlow-release nutrients\nImproves soil structure",
      SKU: "FERT-COM-003",
      Brand: "Organica",
      Category: "Fertilizers",
      Certification: "OMRI Listed",
      shippingReturns: "Shipping calculated at checkout. Not eligible for return due to nature of product.",
      isNew: false,
      discount: 2.5,
      rating: 4.9,
      slug: "organic-compost-5kg",
      sellerId: seller.id,
      verified: true,
      images: ["https://m.media-amazon.com/images/I/612JPcKSEPL.jpg"],
    },
    {
      name: "Advanced Drip Irrigation Kit",
      price: 59.99,
      productStatus: "In Stock",
      productDescription:
        "Complete drip irrigation system for efficient watering of garden beds and potted plants. Saves water and ensures consistent moisture for your plants.",
      features: "Water-saving design\nCustomizable layout\nTimer compatible\nEasy installation",
      SKU: "IRRI-DRP-004",
      Brand: "AquaFlow",
      Category: "Irrigation Systems",
      shippingReturns: "Free shipping. 30-day money-back guarantee if unused and in original packaging.",
      isNew: false,
      discount: 0,
      rating: 4.7,
      slug: "advanced-drip-irrigation-kit",
      sellerId: seller.id,
      verified: true,
      images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD75dOmrB0CW7h73Xc7SXIdYutAOdsWadxzA&s"],
    },
    {
      name: "Organic Pest Control Spray",
      price: 12.5,
      productStatus: "In Stock",
      productDescription:
        "Natural pest control solution made with essential oils and plant extracts. Effective against aphids, mites, and other common garden pests.",
      features:
        "OMRI Listed for organic gardening\nNon-toxic to beneficial insects\nSafe for edible plants\nBiodegradable",
      SKU: "PEST-ORG-005",
      Brand: "NatureWise",
      Category: "Organic Products",
      Certification: "OMRI Listed",
      shippingReturns: "Shipping calculated at checkout. Returns accepted within 14 days if unopened.",
      isNew: true,
      discount: 0,
      rating: 4.3,
      slug: "organic-pest-control-spray",
      sellerId: seller.id,
      verified: true,
      images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdlLutwTuVBE9iU9FkKZSLPdGMvWPymsJ9ZQ&s"],
    },
    {
      name: "Livestock Feed Supplement",
      price: 39.99,
      productStatus: "In Stock",
      productDescription:
        "Nutritional supplement for livestock with essential vitamins and minerals. Supports healthy growth and immune function in cattle, sheep, and goats.",
      features:
        "Balanced vitamin and mineral profile\nEnhances feed efficiency\nSupports immune health\nPalatable formula",
      SKU: "LIVE-SUP-006",
      Brand: "AgriPro",
      Category: "Livestock Supplies",
      shippingReturns: "Shipping calculated at checkout. Not eligible for return due to nature of product.",
      isNew: false,
      discount: 7.5,
      rating: 4.5,
      slug: "livestock-feed-supplement",
      sellerId: seller.id,
      verified: true,
      images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeqnW5DfuNk9niD1aliHSEL-kN11KcJdkipg&s"],
    },
    {
      name: "Soil pH Testing Kit",
      price: 18.75,
      productStatus: "In Stock",
      productDescription:
        "Professional-grade soil pH testing kit with accurate results in minutes. Essential for determining the right amendments for your garden soil.",
      features: "Easy to use\nAccurate results\nIncludes 40 test strips\nComprehensive guide included",
      SKU: "TOOL-PH-007",
      Brand: "FarmTech",
      Category: "Equipment & Tools",
      shippingReturns: "Free shipping on orders over $25. Returns accepted within 30 days if unopened.",
      isNew: false,
      discount: 0,
      rating: 4.2,
      slug: "soil-ph-testing-kit",
      sellerId: seller.id,
      verified: true,
      images: ["https://www.gardenhealth.com/wp-content/uploads/2020/01/soil-ph-testing-kit-gardman-16063-co.webp"],
    },
    {
      name: "Heirloom Vegetable Seed Collection",
      price: 29.95,
      productStatus: "In Stock",
      productDescription:
        "Collection of 15 heirloom vegetable seed varieties, including tomatoes, peppers, lettuce, carrots, and more. Perfect for starting a diverse garden.",
      features: "Non-GMO seeds\n15 popular varieties\nHigh germination rate\nReusable storage tin",
      growingSeason: "Spring, Summer",
      sunExposure: "Full Sun to Partial Shade",
      wateringNeeds: "Varies by variety",
      SKU: "SEED-COL-008",
      Brand: "GreenGrow",
      Category: "Seeds & Plants",
      Certification: "Non-GMO Project Verified",
      shippingReturns: "Free shipping on orders over $25. Returns accepted within 30 days if unopened.",
      isNew: true,
      discount: 0,
      rating: 4.9,
      slug: "heirloom-vegetable-seed-collection",
      sellerId: seller.id,
      verified: true,
      images: ["https://m.media-amazon.com/images/I/81UmOcUxOzL.jpg"],
    },
  ]

  for (const productData of products) {
    const { images, ...data } = productData


    const product = await prisma.product.create({
      data: {
        ...data,
        documentId: `prod_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      },
    })
    console.log(`Created product: ${product.name}`)

    if (images && images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map((url) => ({
          productId: product.id,
          url,
        })),
      })
    }
    await prisma.review.create({
      data: {
        productId: product.id,
        userId: customer.id,
        rating: Math.floor(Math.random() * 2) + 4, 
        comment: "Great product! Exactly as described and arrived quickly.",
      },
    })
  }

  
  const cart = await prisma.cart.create({
    data: {
      userId: customer.id,
    },
  })

  
  const cartProducts = await prisma.product.findMany({
    take: 2,
  })

  for (const product of cartProducts) {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: product.id,
        quantity: 1,
        price: product.price,
      },
    })
  }

  
  const wishlistProducts = await prisma.product.findMany({
    skip: 2,
    take: 2,
  })

  for (const product of wishlistProducts) {
    await prisma.wishlist.create({
      data: {
        userId: customer.id,
        productId: product.id,
      },
    })
  }

  
  const orderProducts = await prisma.product.findMany({
    skip: 4,
    take: 2,
  })

  let totalAmount = 0
  const orderItems = []

  for (const product of orderProducts) {
    const price = product.discount ? product.price - product.discount : product.price
    const quantity = Math.floor(Math.random() * 2) + 1 
    totalAmount += price * quantity

    orderItems.push({
      productId: product.id,
      quantity,
      price,
    })
  }

  const order = await prisma.order.create({
    data: {
      customerId: customer.id,
      totalAmount,
      status: "delivered",
      paymentStatus: "paid",
      paymentMethod: "credit_card",
      shippingAddress: "123 Main St, Anytown, USA 12345",
      orderItems: {
        create: orderItems,
      },
    },
  })

  
  await prisma.payment.create({
    data: {
      userId: customer.id,
      orderId: order.id,
      amount: totalAmount,
      method: "credit_card",
      status: "completed",
      transactionId: `txn_${Date.now()}`,
    },
  })

  console.log("Database seeding completed successfully!")
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

