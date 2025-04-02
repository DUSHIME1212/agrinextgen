"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Heart, ShoppingCart, Eye, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { addToCart } from "@/redux/slices/cartSlice"
import { addToWishlist, removeFromWishlist } from "@/redux/slices/wishlistSlice"

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  category: string
  isNew?: boolean
  isSale?: boolean
  isOutOfStock?: boolean
  discount?: number
  rating?: number
  onQuickView?: () => void
  className?: string
  slug?: string
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  category,
  isNew = false,
  isSale = false,
  isOutOfStock = false,
  discount,
  rating,
  slug,
  onQuickView,
  className,
}) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Check if product is in wishlist
  useEffect(() => {
    if (wishlistItems.length > 0) {
      const inWishlist = wishlistItems.some((item) => item.productId === id)
      setIsWishlisted(inWishlist)
    }
  }, [wishlistItems, id])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const formattedPrice = formatPrice(price)

  const formatDiscountPrice = (price: number, discount: number) => {
    const discountedPrice = price - discount
    return {
      original: formatPrice(price),
      discounted: formatPrice(discountedPrice),
    }
  }

  const discountPrices = discount ? formatDiscountPrice(price, discount) : null

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isOutOfStock) return

    if (!isAuthenticated) {
      router.push("/auth?callbackUrl=" + encodeURIComponent(window.location.pathname))
      toast.error("Please login to add items to your cart")
      return
    }

    setIsAddingToCart(true)

    try {
      await dispatch(addToCart({ productId: id, quantity: 1 })).unwrap()
      toast.success(`${name} has been added to your cart`)
    } catch (error) {
      toast.error("Failed to add item to cart")
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      router.push("/auth?callbackUrl=" + encodeURIComponent(window.location.pathname))
      toast.error("Please login to manage your wishlist")
      return
    }

    setIsAddingToWishlist(true)

    try {
      if (isWishlisted) {
        const wishlistItem = wishlistItems.find((item) => item.productId === id)
        if (wishlistItem) {
          await dispatch(removeFromWishlist(wishlistItem.id)).unwrap()
          toast.success(`${name} has been removed from your wishlist`)
        }
      } else {
        await dispatch(addToWishlist(id)).unwrap()
        toast.success(`${name} has been added to your wishlist`)
      }
    } catch (error) {
      toast.error("Failed to update wishlist")
    } finally {
      setIsAddingToWishlist(false)
    }
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (onQuickView) {
      onQuickView()
    }
  }

  return (
    <div
      className={cn(
        "card product-card group flex flex-col relative p-4 overflow-clip text-primary-foreground transition-all duration-300 hover:translate-y-[-5px] border rounded-lg",
        isOutOfStock && "opacity-70",
        className,
      )}
    >
      {/* Status badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
        {isNew && <Badge className="bg-primary text-white">New</Badge>}

        {isSale && <Badge className="bg-destructive text-white">Sale</Badge>}

        {isOutOfStock && (
          <Badge variant="secondary" className="bg-muted text-foreground">
            Out of Stock
          </Badge>
        )}
      </div>

      {/* Product image */}
      <div className="min-h-72 overflow-clip">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Quick actions */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex translate-y-4 transform gap-2 transition-transform duration-300 group-hover:translate-y-0">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-primary text-primary-foreground shadow-md transition-colors hover:bg-primary hover:text-primary-foreground"
              onClick={handleQuickView}
              title="Quick view"
            >
              <Eye size={18} />
            </Button>

            <Button
              size="icon"
              variant="secondary"
              className={cn(
                "rounded-full bg-primary text-primary-foreground shadow-md transition-colors",
                isWishlisted
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "hover:bg-primary hover:text-primary-foreground",
              )}
              onClick={handleToggleWishlist}
              disabled={isAddingToWishlist}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              {isAddingToWishlist ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Heart size={18} className={isWishlisted ? "fill-current" : ""} />
              )}
            </Button>

            <Button
              size="icon"
              variant="secondary"
              disabled={isOutOfStock || isAddingToCart}
              className={cn(
                "rounded-full bg-primary text-primary-foreground shadow-md transition-colors hover:bg-primary hover:text-white",
                isAddingToCart && "bg-primary text-white",
              )}
              onClick={handleAddToCart}
              title="Add to cart"
            >
              {isAddingToCart ? <Loader2 size={18} className="animate-spin" /> : <ShoppingCart size={18} />}
            </Button>
          </div>
        </div>
      </div>
      <Link href={`/product/${id}`} className="block">
        <div className="mb-1 text-sm text-muted-foreground">{category}</div>
        <h3 className="mb-2 line-clamp-2 min-h-12 font-medium transition-colors text-muted-foreground hover:text-primary">
          {name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {discountPrices ? (
              <>
                <span className="font-semibold">{discountPrices.discounted}</span>
                <span className="text-sm text-muted-foreground line-through">{discountPrices.original}</span>
              </>
            ) : (
              <span className="font-semibold">{formattedPrice}</span>
            )}
          </div>

          {rating && (
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground">{rating}</span>
            </div>
          )}
        </div>
      </Link>
      <Button asChild className="z-20 cursor-pointer text-center mt-4">
        <Link href={`/product/${id}`} className="font-medium hover:underline">
          View Full Details
        </Link>
      </Button>
    </div>
  )
}

export default ProductCard

