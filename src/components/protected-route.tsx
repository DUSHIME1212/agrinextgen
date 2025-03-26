"use client"
import { useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { checkAuthStatus } from "@/redux/slices/authSlice"

interface ProtectedRouteProps {
  children: ReactNode
  allowedUserTypes?: ("customer" | "seller")[]
  className?: string
}

export default function ProtectedRoute({
  children,
  className,
  allowedUserTypes = ["customer", "seller"]
}: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { user, token, isLoading } = useAppSelector((state) => state.auth)
  const [isChecking, setIsChecking] = useState(true)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
    
    const verifyAuth = async () => {
      if (!token) {
        router.push(`/auth?callbackUrl=${pathname}`)
        return
      }

      try {
        await dispatch(checkAuthStatus()).unwrap()
        
        // Check if user should be redirected
        if (pathname === "/auth") {
          router.push(callbackUrl)
        } else if (allowedUserTypes.length > 0 && user?.role) {
          const normalizedRole = user.role.toLowerCase()
          if (!allowedUserTypes.includes(normalizedRole as "customer" | "seller")) {
            router.push("/dashboard")
          }
        }
        
        setIsChecking(false)
      } catch (error) {
        router.push(`/auth?callbackUrl=${pathname}`)
      }
    }

    verifyAuth()
  }, [dispatch, token, router, pathname, searchParams, allowedUserTypes, user?.role])

  if (isChecking || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <div className={className}>{children}</div>
}