"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, CreditCard, CheckCircle } from "lucide-react"
import Layout from "@/components/layout/Layout"
import { useAppSelector } from "@/redux/hooks"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"

const paymentSchema = z.object({
  cardName: z.string().min(3, { message: "Name on card is required" }),
  cardNumber: z
    .string()
    .min(16, { message: "Card number must be at least 16 digits" })
    .max(19, { message: "Card number must not exceed 19 digits" })
    .regex(/^[0-9\s-]+$/, { message: "Card number must contain only digits, spaces, or hyphens" }),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, { message: "Expiry date must be in MM/YY format" }),
  cvv: z
    .string()
    .min(3, { message: "CVV must be at least 3 digits" })
    .max(4, { message: "CVV must not exceed 4 digits" })
    .regex(/^[0-9]+$/, { message: "CVV must contain only digits" }),
  paymentMethod: z.enum(["credit", "debit", "paypal"], {
    required_error: "Please select a payment method",
  }),
})

type PaymentFormValues = z.infer<typeof paymentSchema>

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const amount = searchParams.get("amount") || "0.00"

  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [transactionId, setTransactionId] = useState("")

  const { cart } = useAppSelector((state) => state.cart)
  const { user } = useAppSelector((state) => state.auth)

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      paymentMethod: "credit",
    },
  })

  const onSubmit = async (data: PaymentFormValues) => {
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate a random transaction ID
      const randomTransactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`
      setTransactionId(randomTransactionId)

      // Show success message
      toast.success("Payment processed successfully!")

      // Set payment as complete
      setIsComplete(true)
    } catch (error) {
      toast.error("Payment processing failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (isComplete) {
    return (
      <Layout
        customBreadcrumbPaths={[
          { name: "Home", path: "/" },
          { name: "Checkout", path: "/checkout" },
          { name: "Payment", path: "/payment" },
          { name: "Receipt", path: "/payment?receipt=true" },
        ]}
      >
        <div className="max-w-3xl mx-auto py-12">
          <Card className="border-green-200">
            <CardHeader className="bg-green-50 border-b border-green-100">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <CardTitle className="text-green-700">Payment Successful</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="text-center mb-6">
                <p className="text-muted-foreground">Thank you for your purchase!</p>
                <p className="text-sm text-muted-foreground">A confirmation email has been sent to {user?.email}</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Transaction ID:</span>
                  <span>{transactionId}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Order ID:</span>
                  <span>{orderId || "N/A"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Payment Method:</span>
                  <span>
                    {form.getValues().paymentMethod === "credit"
                      ? "Credit Card"
                      : form.getValues().paymentMethod === "debit"
                        ? "Debit Card"
                        : "PayPal"}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Card Number:</span>
                  <span>**** **** **** {form.getValues().cardNumber.slice(-4)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4">
                  <span>Total Amount:</span>
                  <span>${Number.parseFloat(amount).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={() => window.print()}>
                Print Receipt
              </Button>
              <Button onClick={() => router.push("/orders")}>View Orders</Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout
      customBreadcrumbPaths={[
        { name: "Home", path: "/" },
        { name: "Checkout", path: "/checkout" },
        { name: "Payment", path: "/payment" },
      ]}
    >
      <div className="max-w-3xl mx-auto py-12">
        <h1 className="text-2xl font-bold mb-6">Payment Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Payment Method</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="credit" id="credit" />
                                <FormLabel htmlFor="credit" className="cursor-pointer">
                                  Credit Card
                                </FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="debit" id="debit" />
                                <FormLabel htmlFor="debit" className="cursor-pointer">
                                  Debit Card
                                </FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="paypal" id="paypal" />
                                <FormLabel htmlFor="paypal" className="cursor-pointer">
                                  PayPal
                                </FormLabel>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cardName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name on Card</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl>
                            <Input placeholder="4242 4242 4242 4242" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="expiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date (MM/YY)</FormLabel>
                            <FormControl>
                              <Input placeholder="12/25" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cvv"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVV</FormLabel>
                            <FormControl>
                              <Input placeholder="123" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isProcessing}>
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Pay ${Number.parseFloat(amount).toFixed(2)}
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart?.items &&
                  cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.product.name} (x{item.quantity})
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-medium">
                    <span>Subtotal</span>
                    <span>${Number.parseFloat(amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-4">
                    <span>Total</span>
                    <span>${Number.parseFloat(amount).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}

