import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { authenticate, checkRole } from "@/middleware/auth"


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    
    const { error, status, user } = await authenticate(req)

    if (error) {
      return NextResponse.json({ error }, { status })
    }

    
    const roleCheck = checkRole(user, ["CUSTOMER", "ADMIN"])
    if (roleCheck.error) {
      return NextResponse.json({ error: roleCheck.error }, { status: roleCheck.status })
    }

    const wishlistId = params.id

    
    const wishlistItem = await prisma.wishlist.findUnique({
      where: { id: wishlistId },
    })

    if (!wishlistItem) {
      return NextResponse.json({ error: "Wishlist item not found" }, { status: 404 })
    }

    
    if (wishlistItem.userId !== user.id) {
      return NextResponse.json({ error: "You are not authorized to remove this wishlist item" }, { status: 403 })
    }

    
    await prisma.wishlist.delete({
      where: { id: wishlistId },
    })

    return NextResponse.json({ message: "Item removed from wishlist" }, { status: 200 })
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return NextResponse.json({ error: "Failed to remove from wishlist" }, { status: 500 })
  }
}

