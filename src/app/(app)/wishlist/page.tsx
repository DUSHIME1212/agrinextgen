"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Layout from "@/components/layout/Layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, AlertCircle, Loader2, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { fetchWishlist, removeFromWishlist } from "@/redux/slices/wishlistSlice"
import { addToCart } from "@/redux/slices/cartSlice"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

const WishlistPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { items, isLoading } = useAppSelector((state) => state.wishlist)
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const [removingItems, setRemovingItems] = useState<Record<string, boolean>>({})
  const [addingToCart, setAddingToCart] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist())
    } else {
      router.push("/auth?callbackUrl=/wishlist")
    }
  }, [dispatch, isAuthenticated, router])

  const handleRemoveFromWishlist = async (id: string, name: string) => {
    setRemovingItems((prev) => ({ ...prev, [id]: true }))
    try {
      await dispatch(removeFromWishlist(id)).unwrap()
      toast.success(`${name} has been removed from your wishlist`)
    } catch (error) {
      toast.error("Failed to remove item from wishlist")
    } finally {
      setRemovingItems((prev) => ({ ...prev, [id]: false }))
    }
  }

  const handleAddToCart = async (productId: string, name: string) => {
    setAddingToCart((prev) => ({ ...prev, [productId]: true }))
    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap()
      toast.success(`${name} has been added to your cart`)
    } catch (error) {
      toast.error("Failed to add item to cart")
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }))
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    )
  }

  return (
    <div
      className="p-8"
    >
      <div className="py-12 ">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              <Heart className="h-4 w-4 mr-2 text-primary" />
              {items.length} {items.length === 1 ? "item" : "items"}
            </Badge>
          </div>
        </div>

        {user?.role === "CUSTOMER" || user?.role === "ADMIN" || user?.role === "SELLER" ? (
          items.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => (
                <div key={item.id}>
                  <Card className="group overflow-hidden transition-all duration-300 hover:shadow-md">
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <img
                        src={item.product.productimg?.[0]?.url || "/placeholder.svg"}
                        alt={item.product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => handleRemoveFromWishlist(item.id, item.product.name)}
                        disabled={removingItems[item.id]}
                      >
                        {removingItems[item.id] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <div className="mb-1 text-sm text-muted-foreground">{item.product.Category || "Product"}</div>
                      <Link href={`/product/${item.product.slug}`}>
                        <h3 className="mb-2 line-clamp-2 min-h-12 font-medium hover:text-primary transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {item.product.discount ? (
                            <>
                              <p className="font-bold text-primary">
                                ${(item.product.price - item.product.discount).toFixed(2)}
                              </p>
                              <p className="text-sm text-muted-foreground line-through">
                                ${item.product.price.toFixed(2)}
                              </p>
                            </>
                          ) : (
                            <p className="font-bold text-primary">${item.product.price.toFixed(2)}</p>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{item.product.productStatus}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleRemoveFromWishlist(item.id, item.product.name)}
                          disabled={removingItems[item.id]}
                        >
                          {removingItems[item.id] ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Heart className="mr-2 h-4 w-4 fill-current text-destructive" />
                          )}
                          Remove
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleAddToCart(item.product.id, item.product.name)}
                          disabled={addingToCart[item.product.id]}
                        >
                          {addingToCart[item.product.id] ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <ShoppingCart className="mr-2 h-4 w-4" />
                          )}
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-muted/20 rounded-lg border border-dashed">
              <Heart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="mb-2 text-xl font-medium">Your wishlist is empty</h2>
              <p className="mb-6 text-muted-foreground max-w-md mx-auto">
                Items added to your wishlist will be saved here. Discover products you love and add them to your
                wishlist for later.
              </p>
              <Button asChild className="mx-auto">
                <Link href="/shop">Explore Products</Link>
              </Button>
            </div>
          )
        ) : (
          <Alert variant="destructive" className="max-w-xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              The wishlist feature is only available for customers. Please sign in with a customer account to access
              this feature.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}

export default WishlistPage