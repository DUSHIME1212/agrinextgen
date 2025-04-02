"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Heart, Minus, Plus, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog"
import { toast } from "sonner"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { addToCart } from "@/redux/slices/cartSlice"
import { addToWishlist, removeFromWishlist } from "@/redux/slices/wishlistSlice"
import { useRouter } from "next/navigation"

interface ProductQuickViewProps {
  isOpen: boolean
  onClose: () => void
  product: {
    id: string
    name: string
    price: number
    images: string[]
    category: string
    description: string
    isNew?: boolean
    isSale?: boolean
    isOutOfStock?: boolean
    discount?: number
    rating?: number
    slug?: string
    variants?: Array<{
      name: string
      options: string[]
    }>
  }
}

const ProductQuickView: React.FC<ProductQuickViewProps> = ({ isOpen, onClose, product }) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist)

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  
  useEffect(() => {
    if (wishlistItems.length > 0) {
      const inWishlist = wishlistItems.some((item) => item.productId === product.id)
      setIsWishlisted(inWishlist)
    }
  }, [wishlistItems, product.id])

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price)

  const formattedDiscountPrice = product.discount
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(product.price - product.discount)
    : null

  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount
    if (newQuantity > 0) {
      setQuantity(newQuantity)
    }
  }

  const handleVariantChange = (variantName: string, option: string) => {
    setSelectedVariants((prev: Record<string, string>) => ({
      ...prev,
      [variantName]: option,
    }))
  }

  const handleAddToCart = async () => {
    if (product.isOutOfStock) return

    if (!isAuthenticated) {
      router.push("/auth?callbackUrl=" + encodeURIComponent(window.location.pathname))
      onClose()
      toast.error("Please login to add items to your cart")
      return
    }

    setIsAddingToCart(true)

    try {
      await dispatch(addToCart({ productId: product.id, quantity })).unwrap()
      toast.success(`${product.name} has been added to your cart`)
    } catch (error) {
      toast.error("Failed to add item to cart")
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      router.push("/auth?callbackUrl=" + encodeURIComponent(window.location.pathname))
      onClose()
      toast.error("Please login to manage your wishlist")
      return
    }

    setIsAddingToWishlist(true)

    try {
      if (isWishlisted) {
        
        const wishlistItem = wishlistItems.find((item) => item.productId === product.id)
        if (wishlistItem) {
          await dispatch(removeFromWishlist(wishlistItem.id)).unwrap()
          toast.success(`${product.name} has been removed from your wishlist`)
        }
      } else {
        await dispatch(addToWishlist(product.id)).unwrap()
        toast.success(`${product.name} has been added to your wishlist`)
      }
    } catch (error) {
      toast.error("Failed to update wishlist")
    } finally {
      setIsAddingToWishlist(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Product Images */}
          <div className="bg-muted p-6 flex flex-col">
            <div className="relative aspect-square bg-background rounded-md overflow-hidden mb-4">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="object-cover w-full h-full"
              />

              <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                {product.isNew && <Badge className="bg-primary text-white">New</Badge>}

                {product.isSale && <Badge className="bg-destructive text-white">Sale</Badge>}

                {product.isOutOfStock && (
                  <Badge variant="secondary" className="bg-muted text-foreground">
                    Out of Stock
                  </Badge>
                )}
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-20 h-20 rounded-md overflow-hidden border-2 transition-all",
                      selectedImage === index ? "border-primary" : "border-transparent hover:border-primary/50",
                    )}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} - view ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="p-6 relative">
            <DialogClose className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X size={24} />
            </DialogClose>

            <div className="mb-6">
              <div className="text-sm text-muted-foreground mb-1">{product.category}</div>
              <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>

              <div className="flex items-center gap-2 mb-4">
                {product.discount ? (
                  <>
                    <span className="font-semibold text-xl">{formattedDiscountPrice}</span>
                    <span className="text-muted-foreground line-through">{formattedPrice}</span>
                    <Badge className="bg-destructive text-white ml-2">{product.discount}% OFF</Badge>
                  </>
                ) : (
                  <span className="font-semibold text-xl">{formattedPrice}</span>
                )}
              </div>

              <p className="text-muted-foreground mb-6 line-clamp-3">{product.description}</p>
            </div>

            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4 mb-6">
                {product.variants.map((variant) => (
                  <div key={variant.name}>
                    <h4 className="font-medium mb-2">
                      {variant.name}:{" "}
                      <span className="text-primary">{selectedVariants[variant.name] || "Select an option"}</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {variant.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleVariantChange(variant.name, option)}
                          className={cn(
                            "px-3 py-1 border rounded-md transition-all",
                            selectedVariants[variant.name] === option
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary",
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mb-6">
              <h4 className="font-medium mb-2">Quantity</h4>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-r-none"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus size={18} />
                </Button>
                <div className="h-10 px-4 flex items-center justify-center border-y border-input">{quantity}</div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-l-none"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus size={18} />
                </Button>
              </div>
            </div>
            <div className="flex gap-2 mb-6">
              <Button
                className="flex-1"
                size="lg"
                disabled={product.isOutOfStock || isAddingToCart}
                onClick={handleAddToCart}
              >
                {isAddingToCart ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>Add to Cart</>
                )}
              </Button>

              <Button
                variant="outline"
                size="icon"
                className={cn("h-12 w-12", isWishlisted && "text-primary border-primary")}
                onClick={handleToggleWishlist}
                disabled={isAddingToWishlist}
              >
                {isAddingToWishlist ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Heart size={20} className={isWishlisted ? "fill-primary" : ""} />
                )}
              </Button>
            </div>

            <div className="text-center">
              <Link
                href={`/product/${product.id}`}
                className="text-primary font-medium hover:underline"
                onClick={onClose}
              >
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProductQuickView

