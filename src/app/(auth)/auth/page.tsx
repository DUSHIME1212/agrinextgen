"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  loginUser,
  registerCustomer,
  registerSeller,
  checkAuthStatus,
} from "@/redux/slices/authSlice";

const customerSignInSchema = z.object({
  identifier: z
    .string()
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

const customerSignUpSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: "Full name must be at least 2 characters" })
      .trim(),
    email: z
      .string()
      .email({ message: "Please enter a valid email address" })
      .trim(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const sellerSignInSchema = z.object({
  identifier: z
    .string()
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

const sellerSignUpSchema = z
  .object({
    businessName: z
      .string()
      .min(2, { message: "Business name must be at least 2 characters" })
      .trim(),
    contactPerson: z
      .string()
      .min(2, { message: "Contact person must be at least 2 characters" })
      .trim(),
    email: z
      .string()
      .email({ message: "Please enter a valid email address" })
      .trim(),
    phoneNumber: z
      .string()
      .min(10, { message: "Please enter a valid phone number" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type CustomerSignInValues = z.infer<typeof customerSignInSchema>;
type CustomerSignUpValues = z.infer<typeof customerSignUpSchema>;
type SellerSignInValues = z.infer<typeof sellerSignInSchema>;
type SellerSignUpValues = z.infer<typeof sellerSignUpSchema>;

const Page: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [activeTab, setActiveTab] = useState("customer");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useAppDispatch();
  interface AuthState {
    user: Record<string, any> | null;
    error: string | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
  }

  const { user, error, token, isLoading, isAuthenticated } = useAppSelector(
    (state: { auth: AuthState }) => state.auth,
  );

  
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          await dispatch(checkAuthStatus()).unwrap();
          if (isAuthenticated) {
            router.push("/dashboard");
          }
        } catch (error) {
          
        }
      }
    };

    checkAuth();
  }, [dispatch, token, router, isAuthenticated]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const customerSignInForm = useForm<CustomerSignInValues>({
    resolver: zodResolver(customerSignInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const customerSignUpForm = useForm<CustomerSignUpValues>({
    resolver: zodResolver(customerSignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const sellerSignInForm = useForm<SellerSignInValues>({
    resolver: zodResolver(sellerSignInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const sellerSignUpForm = useForm<SellerSignUpValues>({
    resolver: zodResolver(sellerSignUpSchema),
    defaultValues: {
      businessName: "",
      contactPerson: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  
  async function onCustomerSignInSubmit(values: CustomerSignInValues) {
    try {
      const resultAction = await dispatch(loginUser(values)).unwrap();
      toast.success(
        <div>
          <strong>Sign in successful</strong>
          <p>Welcome back to AgriNextGen Market!</p>
        </div>,
      );
      router.push(callbackUrl);
    } catch (error) {
      
    }
  }

  
  async function onCustomerSignUpSubmit(values: CustomerSignUpValues) {
    try {
      const { confirmPassword, username, ...rest } = values;
      const userData = {
        username,
        email: rest.email,
        password: rest.password,
      };

      await dispatch(registerCustomer(userData)).unwrap();
      toast.success(
        <div>
          <strong>Account created successfully</strong>
          <p>Your account is now ready to use.</p>
        </div>,
      );
      setAuthMode("signin");
      customerSignInForm.setValue("identifier", values.email);
    } catch (error) {
      
    }
  }

  
  async function onSellerSignInSubmit(values: SellerSignInValues) {
    try {
      await dispatch(loginUser(values)).unwrap();
      toast.success(
        <div>
          <strong>Sign in successful</strong>
          <p>Welcome back to AgriNextGen Market!</p>
        </div>,
      );
      router.push(callbackUrl);
    } catch (error) {
      
    }
  }

  
  async function onSellerSignUpSubmit(values: SellerSignUpValues) {
    try {
      const { confirmPassword, phoneNumber, ...userData } = values;
      const updatedUserData = {
        ...userData,
        phoneNumber,
      };

      await dispatch(registerSeller(updatedUserData)).unwrap();
      toast.success(
        <div>
          <strong>Account created successfully</strong>
          <p>Your seller account is now ready to use.</p>
        </div>,
      );
      setAuthMode("signin");
      sellerSignInForm.setValue("identifier", values.email);
    } catch (error) {
      
    }
  }

  useEffect(() => {
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [activeTab, authMode]);

  return (
    <Layout
      customBreadcrumbPaths={[
        { name: "Home", path: "/" },
        { name: "Authentication", path: "/auth" },
      ]}
    >
      <div className="mx-auto max-w-md py-12">
        <h1 className="mb-8 text-center text-3xl font-bold">Account</h1>

        <Tabs defaultValue="customer" onValueChange={setActiveTab}>
          <TabsList className="mb-8 grid w-full grid-cols-2">
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="seller">Seller</TabsTrigger>
          </TabsList>

          <TabsContent value="customer">
            <div className="space-y-4">
              <div className="mb-6 flex justify-between">
                <h2 className="text-xl font-medium">
                  {authMode === "signin"
                    ? "Customer Login"
                    : "Create Customer Account"}
                </h2>
                <Button
                  variant="link"
                  onClick={() => {
                    setAuthMode(authMode === "signin" ? "signup" : "signin");
                    customerSignInForm.reset();
                    customerSignUpForm.reset();
                  }}
                  className="text-primary"
                >
                  {authMode === "signin" ? "Create Account" : "Sign In"}
                </Button>
              </div>

              {authMode === "signin" ? (
                <Form {...customerSignInForm}>
                  <form
                    onSubmit={customerSignInForm.handleSubmit(
                      onCustomerSignInSubmit,
                    )}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label htmlFor="identifier" className="text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="identifier"
                        placeholder="you@example.com"
                        {...customerSignInForm.register("identifier")}
                      />
                      {customerSignInForm.formState.errors.identifier && (
                        <p className="text-sm font-medium text-destructive">
                          {customerSignInForm.formState.errors.identifier.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          {...customerSignInForm.register("password")}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </Button>
                      </div>
                      {customerSignInForm.formState.errors.password && (
                        <p className="text-sm font-medium text-destructive">
                          {customerSignInForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="text-right text-sm">
                      <a href="#" className="text-primary hover:underline">
                        Forgot your password?
                      </a>
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
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
                  <form
                    onSubmit={customerSignUpForm.handleSubmit(
                      onCustomerSignUpSubmit,
                    )}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label htmlFor="username" className="text-sm font-medium">
                        Full Name
                      </label>
                      <Input
                        id="username"
                        placeholder="DUSHIME Aime"
                        {...customerSignUpForm.register("username")}
                      />
                      {customerSignUpForm.formState.errors.username && (
                        <p className="text-sm font-medium text-destructive">
                          {customerSignUpForm.formState.errors.username.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="email"
                        placeholder="you@example.com"
                        {...customerSignUpForm.register("email")}
                      />
                      {customerSignUpForm.formState.errors.email && (
                        <p className="text-sm font-medium text-destructive">
                          {customerSignUpForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          {...customerSignUpForm.register("password")}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </Button>
                      </div>
                      {customerSignUpForm.formState.errors.password && (
                        <p className="text-sm font-medium text-destructive">
                          {customerSignUpForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          {...customerSignUpForm.register("confirmPassword")}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </Button>
                      </div>
                      {customerSignUpForm.formState.errors.confirmPassword && (
                        <p className="text-sm font-medium text-destructive">
                          {customerSignUpForm.formState.errors.confirmPassword
                            .message}
                        </p>
                      )}
                    </div>

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
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
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
              <div className="mb-6 flex justify-between">
                <h2 className="text-xl font-medium">
                  {authMode === "signin"
                    ? "Seller Login"
                    : "Create Seller Account"}
                </h2>
                <Button
                  variant="link"
                  onClick={() => {
                    setAuthMode(authMode === "signin" ? "signup" : "signin");
                    sellerSignInForm.reset();
                    sellerSignUpForm.reset();
                  }}
                  className="text-primary"
                >
                  {authMode === "signin" ? "Create Account" : "Sign In"}
                </Button>
              </div>

              {authMode === "signin" ? (
                <Form {...sellerSignInForm}>
                  <form
                    onSubmit={sellerSignInForm.handleSubmit(
                      onSellerSignInSubmit,
                    )}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label htmlFor="identifier" className="text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="identifier"
                        placeholder="business@example.com"
                        {...sellerSignInForm.register("identifier")}
                      />
                      {sellerSignInForm.formState.errors.identifier && (
                        <p className="text-sm font-medium text-destructive">
                          {sellerSignInForm.formState.errors.identifier.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          {...sellerSignInForm.register("password")}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </Button>
                      </div>
                      {sellerSignInForm.formState.errors.password && (
                        <p className="text-sm font-medium text-destructive">
                          {sellerSignInForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="text-right text-sm">
                      <a href="#" className="text-primary hover:underline">
                        Forgot your password?
                      </a>
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
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
                  <form
                    onSubmit={sellerSignUpForm.handleSubmit(
                      onSellerSignUpSubmit,
                    )}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label
                        htmlFor="businessName"
                        className="text-sm font-medium"
                      >
                        Business Name
                      </label>
                      <Input
                        id="businessName"
                        placeholder="Your Farm or Business"
                        {...sellerSignUpForm.register("businessName")}
                      />
                      {sellerSignUpForm.formState.errors.businessName && (
                        <p className="text-sm font-medium text-destructive">
                          {sellerSignUpForm.formState.errors.businessName
                            .message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="contactPerson"
                        className="text-sm font-medium"
                      >
                        Contact Person
                      </label>
                      <Input
                        id="contactPerson"
                        placeholder="DUSHIME Aime"
                        {...sellerSignUpForm.register("contactPerson")}
                      />
                      {sellerSignUpForm.formState.errors.contactPerson && (
                        <p className="text-sm font-medium text-destructive">
                          {sellerSignUpForm.formState.errors.contactPerson
                            .message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="email"
                        placeholder="business@example.com"
                        {...sellerSignUpForm.register("email")}
                      />
                      {sellerSignUpForm.formState.errors.email && (
                        <p className="text-sm font-medium text-destructive">
                          {sellerSignUpForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="phoneNumber"
                        className="text-sm font-medium"
                      >
                        Phone Number
                      </label>
                      <Input
                        id="phoneNumber"
                        placeholder="+250 782 454 192"
                        {...sellerSignUpForm.register("phoneNumber")}
                      />
                      {sellerSignUpForm.formState.errors.phoneNumber && (
                        <p className="text-sm font-medium text-destructive">
                          {sellerSignUpForm.formState.errors.phoneNumber.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          {...sellerSignUpForm.register("password")}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </Button>
                      </div>
                      {sellerSignUpForm.formState.errors.password && (
                        <p className="text-sm font-medium text-destructive">
                          {sellerSignUpForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          {...sellerSignUpForm.register("confirmPassword")}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </Button>
                      </div>
                      {sellerSignUpForm.formState.errors.confirmPassword && (
                        <p className="text-sm font-medium text-destructive">
                          {sellerSignUpForm.formState.errors.confirmPassword
                            .message}
                        </p>
                      )}
                    </div>

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
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
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
  );
};

export default Page;