"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Layout from "@/components/layout/Layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { loginUser, registerCustomer, registerSeller, checkAuthStatus } from "@/redux/slices/authSlice"

const customerSignInSchema = z.object({
  identifier: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

const customerSignUpSchema = z
  .object({
    username: z.string().min(2, { message: "Full name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

const sellerSignInSchema = z.object({
  identifier: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

const sellerSignUpSchema = z
  .object({
    businessName: z.string().min(2, { message: "Business name must be at least 2 characters" }),
    contactPerson: z.string().min(2, { message: "Contact person must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone: z.string().min(10, { message: "Please enter a valid phone number" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type CustomerSignInValues = z.infer<typeof customerSignInSchema>
type CustomerSignUpValues = z.infer<typeof customerSignUpSchema>
type SellerSignInValues = z.infer<typeof sellerSignInSchema>
type SellerSignUpValues = z.infer<typeof sellerSignUpSchema>

const Page: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const [activeTab, setActiveTab] = useState("customer")
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const dispatch = useAppDispatch()
  const { user, error, token, isLoading } = useAppSelector((state) => state.auth)

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          await dispatch(checkAuthStatus()).unwrap()
          router.push(callbackUrl)
        } catch (error) {

        }
      }
    }

    checkAuth()
  }, [dispatch, token, router, callbackUrl])


  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const customerSignInForm = useForm<CustomerSignInValues>({
    resolver: zodResolver(customerSignInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  const customerSignUpForm = useForm<CustomerSignUpValues>({
    resolver: zodResolver(customerSignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const sellerSignInForm = useForm<SellerSignInValues>({
    resolver: zodResolver(sellerSignInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  const sellerSignUpForm = useForm<SellerSignUpValues>({
    resolver: zodResolver(sellerSignUpSchema),
    defaultValues: {
      businessName: "",
      contactPerson: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  })

  // Handle customer sign in
  async function onCustomerSignInSubmit(values: CustomerSignInValues) {
    const resultAction = await dispatch(loginUser(values))

    if (loginUser.fulfilled.match(resultAction)) {
      toast.success(
        <div>
          <strong>Sign in successful</strong>
          <p>Welcome back to AgriNextGen Market!</p>
        </div>,
      )
      router.push(callbackUrl||"/dashboard")
    }
  }

  // Done
  async function onCustomerSignUpSubmit(values: CustomerSignUpValues) {
    const { confirmPassword, username, ...rest } = values
    const userData = { username, ...rest }

    const resultAction = await dispatch(registerCustomer(userData))

    if (registerCustomer.fulfilled.match(resultAction)) {
      toast.success(
        <div>
          <strong>Account created successfully</strong>
          <p>Your account is now ready to use.</p>
        </div>,
      )
      setAuthMode("signin")
      customerSignInForm.setValue("identifier", values.email)
    }
  }

  async function onSellerSignInSubmit(values: SellerSignInValues) {
    const resultAction = await dispatch(loginUser(values))

    if (loginUser.fulfilled.match(resultAction)) {
      toast.success(
        <div>
          <strong>Sign in successful</strong>
          <p>Welcome back to AgriNextGen Market!</p>
        </div>,
      )
      router.push(callbackUrl)
    }
  }

  // Handle seller sign up
  async function onSellerSignUpSubmit(values: SellerSignUpValues) {
    const { confirmPassword, phone: phoneNumber, ...userData } = values
    const updatedUserData = { ...userData, phoneNumber }

    const resultAction = await dispatch(registerSeller(updatedUserData))

    if (registerSeller.fulfilled.match(resultAction)) {
      toast.success(
        <div>
          <strong>Account created successfully</strong>
          <p>Your seller account is now ready to use.</p>
        </div>,
      )
      setAuthMode("signin")
      sellerSignInForm.setValue("identifier", values.email)
    }
  }


  useEffect(() => {
    setShowPassword(false)
    setShowConfirmPassword(false)
  }, [activeTab, authMode])

  return (
    <Layout
      customBreadcrumbPaths={[
        { name: "Home", path: "/" },
        { name: "Authentication", path: "/auth" },
      ]}
    >
      <div className="py-12 max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Account</h1>

        <Tabs defaultValue="customer" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-1 mb-8">
            <TabsTrigger value="customer">Customer</TabsTrigger>
          </TabsList>

          <TabsContent value="customer">
            <div className="space-y-4">
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-medium">
                  {authMode === "signin" ? "Customer Login" : "Create Customer Account"}
                </h2>
                <Button
                  variant="link"
                  onClick={() => {
                    setAuthMode(authMode === "signin" ? "signup" : "signin")
                    customerSignInForm.reset()
                    customerSignUpForm.reset()
                  }}
                  className="text-primary"
                >
                  {authMode === "signin" ? "Create Account" : "Sign In"}
                </Button>
              </div>

              {authMode === "signin" ? (
                <Form {...customerSignInForm}>
                  <form onSubmit={customerSignInForm.handleSubmit(onCustomerSignInSubmit)} className="space-y-6">
                    <FormField
                      control={customerSignInForm.control}
                      name="identifier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={customerSignInForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type={showPassword ? "text" : "password"} {...field} />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="text-sm text-right">
                      <a href="#" className="text-primary hover:underline">
                        Forgot your password?
                      </a>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...customerSignUpForm}>
                  <form onSubmit={customerSignUpForm.handleSubmit(onCustomerSignUpSubmit)} className="space-y-4">
                    <FormField
                      control={customerSignUpForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="DUSHIME Aime" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={customerSignUpForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={customerSignUpForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type={showPassword ? "text" : "password"} {...field} />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={customerSignUpForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type={showConfirmPassword ? "text" : "password"} {...field} />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="text-sm">
                      <p className="text-muted-foreground">
                        By creating an account, you agree to our{" "}
                        <a href="#" className="text-primary hover:underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                      </p>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </TabsContent>

          <TabsContent value="seller">
            <div className="space-y-4">
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-medium">
                  {authMode === "signin" ? "Seller Login" : "Create Seller Account"}
                </h2>
                <Button
                  variant="link"
                  onClick={() => {
                    setAuthMode(authMode === "signin" ? "signup" : "signin")
                    sellerSignInForm.reset()
                    sellerSignUpForm.reset()
                  }}
                  className="text-primary"
                >
                  {authMode === "signin" ? "Create Account" : "Sign In"}
                </Button>
              </div>

              {authMode === "signin" ? (
                <Form {...sellerSignInForm}>
                  <form onSubmit={sellerSignInForm.handleSubmit(onSellerSignInSubmit)} className="space-y-6">
                    <FormField
                      control={sellerSignInForm.control}
                      name="identifier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="business@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={sellerSignInForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type={showPassword ? "text" : "password"} {...field} />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="text-sm text-right">
                      <a href="#" className="text-primary hover:underline">
                        Forgot your password?
                      </a>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...sellerSignUpForm}>
                  <form onSubmit={sellerSignUpForm.handleSubmit(onSellerSignUpSubmit)} className="space-y-4">
                    <FormField
                      control={sellerSignUpForm.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Farm or Business" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={sellerSignUpForm.control}
                      name="contactPerson"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Person</FormLabel>
                          <FormControl>
                            <Input placeholder="DUSHIME Aime" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={sellerSignUpForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="business@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={sellerSignUpForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+ 250 782 454 192" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={sellerSignUpForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type={showPassword ? "text" : "password"} {...field} />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={sellerSignUpForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type={showConfirmPassword ? "text" : "password"} {...field} />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="text-sm">
                      <p className="text-muted-foreground">
                        By creating a seller account, you agree to our{" "}
                        <a href="#" className="text-primary hover:underline">
                          Seller Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                      </p>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Seller Account"
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}

export default Page

