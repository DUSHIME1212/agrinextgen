"use client"

import Layout from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/hooks/useAuth"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { fetchCart, removeFromCart, updateCartItemQuantity } from "@/redux/slices/cartSlice"
import { ArrowRight, Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type React from "react"
import { useEffect } from "react"
import { toast } from "sonner"

const CartPage: React.FC = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAuth()
  const { cart, isLoading } = useAppSelector((state) => state.cart)

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart())
    }
  }, [dispatch, isAuthenticated])

  const handleUpdateQuantity = (id: string, currentQuantity: number, amount: number) => {
    const newQuantity = currentQuantity + amount
    if (newQuantity < 1) return

    dispatch(updateCartItemQuantity({ id, quantity: newQuantity }))
  }

  const handleRemoveItem = (id: string, name: string) => {
    dispatch(removeFromCart(id))
    toast.success(`You removed ${name} from your cart.`)
  }

  const handleClearCart = () => {
    if (cart?.items) {
      cart.items.forEach((item) => {
        dispatch(removeFromCart(item.id))
      })
    }
    toast.success("Your cart has been cleared.")
  }

  const handleCheckout = () => {
    if (isAuthenticated) {
      router.push("/checkout")
    } else {
      toast.error("Please login to checkout.")
      router.push("/auth?callbackUrl=/checkout")
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const calculateTotal = () => {
    if (!cart || !cart.items || cart.items.length === 0) return 0

    return cart.items.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    )
  }

  const cartItems = cart?.items || []

  return (
    <Layout
      customBreadcrumbPaths={[
        { name: "Home", path: "/" },
        { name: "Cart", path: "/cart" },
      ]}
      className="min-h-screen"
    >
      <div className="py-12 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 space-y-6">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
              <Button asChild>
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Cart Items ({cartItems.length})</CardTitle>
                    <Button variant="outline" size="sm" onClick={handleClearCart}>
                      Clear Cart
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center space-x-4">
                              <div className="h-16 w-16 rounded overflow-hidden bg-secondary">
                                <img
                                  src={item.product.productimg?.[0]?.url || "/placeholder.svg"}
                                  alt={item.product.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <Link
                                  href={`/product/${item.product.id}`}
                                  className="font-medium hover:underline line-clamp-1"
                                >
                                  {item.product.name}
                                </Link>
                                <p className="text-sm text-muted-foreground">
                                  Seller: {item.product.productStatus || "Unknown"}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(item.price)}</TableCell>
                          <TableCell>
                            <div className="flex items-center border rounded-md max-w-[100px]">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-none"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="px-2 py-1 min-w-[30px] text-center">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-none"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{formatCurrency(item.price * item.quantity)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => handleRemoveItem(item.id, item.product.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleCheckout} disabled={cartItems.length === 0}>
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <div className="mt-6 text-sm text-muted-foreground">
                <p className="mb-2">We accept:</p>
                <div className="flex space-x-2">
                  <div className="px-3 py-1 border rounded">Credit Card</div>
                  <div className="px-3 py-1 border rounded">PayPal</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default CartPage

