"use client"

import type React from "react"

import { useState } from "react"
import { ShoppingCart, ArrowRight, Trash2, Loader2 } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { removeFromCart, updateCartItemQuantity } from "@/redux/slices/cartSlice"
import { useRouter } from "next/navigation"

interface CartPopupProps {
  isOpen: boolean
  onClose: () => void
}

const CartPopup: React.FC<CartPopupProps> = ({ isOpen, onClose }) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { cart, isLoading } = useAppSelector((state) => state.cart)
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [removingItems, setRemovingItems] = useState<Record<string, boolean>>({})

  const items = cart?.items || []
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

  const formattedSubtotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(subtotal)

  const handleQuantityChange = (id: string, amount: number) => {
    const item = items.find((item) => item.id === id)

    if (!item) return

    const newQuantity = item.quantity + amount

    if (newQuantity < 1) {
      handleRemoveItem(id, item.product.name)
      return
    }

    dispatch(updateCartItemQuantity({ id, quantity: newQuantity }))
  }

  const handleRemoveItem = async (id: string, name: string) => {
    setRemovingItems((prev) => ({ ...prev, [id]: true }))
    try {
      await dispatch(removeFromCart(id)).unwrap()
      toast.success(`${name} has been removed from your cart`)
    } catch (error) {
      toast.error("Failed to remove item from cart")
    } finally {
      setRemovingItems((prev) => ({ ...prev, [id]: false }))
    }
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push("/auth?callbackUrl=/checkout")
      onClose()
      toast.error("Please login to proceed to checkout")
      return
    }

    router.push("/checkout")
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader className="pb-4 border-b">
          <SheetTitle className="flex items-center">
            <ShoppingCart size={20} className="mr-2" />
            Your Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <ShoppingCart size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-4 text-center">
              Looks like you haven't added anything to your cart yet.
            </p>
            <SheetClose asChild>
              <Button asChild>
                <Link href="/shop">Start Shopping</Link>
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-4">
                {items.map((item) => {
                  const formattedPrice = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(item.price)

                  return (
                    <li key={item.id} className="flex space-x-4">
                      <div className="h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={item.product.productimg?.[0]?.url || "/placeholder.svg"}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.product.id}`}
                          className="font-medium hover:text-primary truncate block"
                          onClick={onClose}
                        >
                          {item.product.name}
                        </Link>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border rounded-md">
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="px-2 py-1 text-muted-foreground hover:text-foreground"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="px-2 py-1 min-w-[24px] text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="px-2 py-1 text-muted-foreground hover:text-foreground"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <span className="font-medium">{formattedPrice}</span>

                          <button
                            onClick={() => handleRemoveItem(item.id, item.product.name)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            aria-label={`Remove ${item.product.name} from cart`}
                            disabled={removingItems[item.id]}
                          >
                            {removingItems[item.id] ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="pt-4 border-t space-y-4">
              <div className="flex items-center justify-between font-medium">
                <span>Subtotal</span>
                <span>{formattedSubtotal}</span>
              </div>
              <p className="text-sm text-muted-foreground">Shipping and taxes calculated at checkout</p>

              <div className="grid grid-cols-2 gap-2">
                <SheetClose asChild>
                  <Button variant="outline" asChild>
                    <Link href="/cart">View Cart</Link>
                  </Button>
                </SheetClose>

                <Button onClick={handleCheckout} className="flex items-center justify-center">
                  Checkout
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default CartPopup

