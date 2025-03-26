"use client"

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertCircle, CreditCard, Building, Truck, ShoppingCart, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import Link from 'next/link';

const shippingSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  streetAddress: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "ZIP code is required"),
  phone: z.string().min(10, "Phone number is required"),
});

const paymentSchema = z.object({
  paymentMethod: z.enum(["creditCard", "bankTransfer", "paypal"]),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
});

type ShippingFormValues = z.infer<typeof shippingSchema>;
type PaymentFormValues = z.infer<typeof paymentSchema>;

const Page: React.FC = () => {
  const  currentUser  = {
    role: 'customer',
  }
  const [activeStep, setActiveStep] = useState<"shipping" | "payment" | "confirmation">("shipping");
  const [shippingData, setShippingData] = useState<ShippingFormValues | null>(null);
  
  const cartItems = [
    { id: '1', name: 'Organic Tomato Seeds', price: 4.99, quantity: 2 },
    { id: '2', name: 'Garden Pruning Shears', price: 12.99, quantity: 1 },
    { id: '3', name: 'Natural Fertilizer - 2kg', price: 8.49, quantity: 1 },
  ];
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 5.99;
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + shipping + tax;
  
  const shippingForm = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      fullName: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
    },
  });
  
  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "creditCard",
    },
  });
  
  const onShippingSubmit = (values: ShippingFormValues) => {
    setShippingData(values);
    setActiveStep("payment");
  };
  
  const onPaymentSubmit = (values: PaymentFormValues) => {
    console.log("Payment data:", values);
    console.log("Shipping data:", shippingData);
    
    toast.success(
      <div>
        <strong>Order Placed Successfully</strong>
        <p>Thank you for your purchase!</p>
      </div>
    );
    
    setActiveStep("confirmation");
  };
  
  if (currentUser?.role !== 'customer') {
    return (
      <Layout
        customBreadcrumbPaths={[
          { name: 'Home', path: '/' },
          { name: 'Cart', path: '/cart' },
          { name: 'Checkout', path: '/checkout' }
        ]}
      >
        <div className="py-12">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              The checkout feature is only available for customers.
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout
      customBreadcrumbPaths={[
        { name: 'Home', path: '/' },
        { name: 'Cart', path: '/cart' },
        { name: 'Checkout', path: '/checkout' }
      ]}
    >
      <div className="py-12">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs 
              value={activeStep} 
              onValueChange={(value) => setActiveStep(value as "shipping" | "payment" | "confirmation")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="shipping" disabled={activeStep !== "shipping"}>
                  <Truck className="mr-2 h-4 w-4" />
                  Shipping
                </TabsTrigger>
                <TabsTrigger value="payment" disabled={activeStep !== "payment" && activeStep !== "confirmation"}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment
                </TabsTrigger>
                <TabsTrigger value="confirmation" disabled={activeStep !== "confirmation"}>
                  <Check className="mr-2 h-4 w-4" />
                  Confirmation
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="shipping">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                    <CardDescription>
                      Enter your shipping details to continue
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...shippingForm}>
                      <form onSubmit={shippingForm.handleSubmit(onShippingSubmit)} className="space-y-4">
                        <FormField
                          control={shippingForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={shippingForm.control}
                          name="streetAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Street Address</FormLabel>
                              <FormControl>
                                <Input placeholder="123 Main St" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={shippingForm.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="New York" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={shippingForm.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                  <Input placeholder="NY" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={shippingForm.control}
                            name="zipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ZIP Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="10001" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={shippingForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="(123) 456-7890" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="pt-4">
                          <Button type="submit" className="w-full">
                            Continue to Payment
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="payment">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>
                      Choose your preferred payment method
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...paymentForm}>
                      <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-6">
                        <FormField
                          control={paymentForm.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Payment Method</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="space-y-3"
                                >
                                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                                    <RadioGroupItem value="creditCard" id="creditCard" />
                                    <Label htmlFor="creditCard" className="flex-1 cursor-pointer flex items-center">
                                      <CreditCard className="h-4 w-4 mr-2" />
                                      Credit Card
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                                    <RadioGroupItem value="bankTransfer" id="bankTransfer" />
                                    <Label htmlFor="bankTransfer" className="flex-1 cursor-pointer flex items-center">
                                      <Building className="h-4 w-4 mr-2" />
                                      Bank Transfer
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                                    <RadioGroupItem value="paypal" id="paypal" />
                                    <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                                      PayPal
                                    </Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {paymentForm.watch("paymentMethod") === "creditCard" && (
                          <div className="space-y-4">
                            <FormField
                              control={paymentForm.control}
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
                                control={paymentForm.control}
                                name="cardExpiry"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Expiry Date</FormLabel>
                                    <FormControl>
                                      <Input placeholder="MM/YY" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={paymentForm.control}
                                name="cardCvc"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>CVC</FormLabel>
                                    <FormControl>
                                      <Input placeholder="123" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        )}
                        
                        <div className="pt-4 flex gap-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setActiveStep("shipping")}
                            className="flex-1"
                          >
                            Back
                          </Button>
                          <Button type="submit" className="flex-1">
                            Place Order
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="confirmation">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center text-primary">Order Confirmed!</CardTitle>
                    <CardDescription className="text-center">
                      Thank you for your purchase. Your order has been received.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      <Check className="h-12 w-12 text-primary" />
                    </div>
                    <div className="text-center mb-6">
                      <p className="font-semibold text-lg">Order #ORD12345</p>
                      <p className="text-muted-foreground">A confirmation email has been sent to your email address.</p>
                    </div>
                    <div className="w-full max-w-md">
                      <h3 className="font-medium mb-2">Order Details:</h3>
                      <div className="bg-muted p-4 rounded-md mb-4">
                        <div className="flex justify-between mb-2">
                          <span>Subtotal:</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span>Shipping:</span>
                          <span>${shipping.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span>Tax:</span>
                          <span>${tax.toFixed(2)}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-medium">
                          <span>Total:</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button asChild className="w-full max-w-xs">
                      <Link href="/shop">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Continue Shopping
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p>${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
