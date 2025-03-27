"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { FilePlus, Home, LogOut, Package, PieChart, Settings, ShoppingBag, User, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppDispatch } from "@/redux/hooks"
import { useAuth } from "@/hooks/useAuth"
import { logout } from "@/redux/slices/authSlice"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type UserRole = "SELLER" | "CUSTOMER" | "ADMIN"

export interface UserType {
  id: string
  email: string
  name?: string
  businessName?: string
  contactPerson?: string
  phoneNumber?: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  status: "success" | "error"
  message: string
  data: {
    token: string
    user: UserType
  }
}

const DashboardSidebar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user, userRole } = useAuth()

  const isSeller = userRole?.toLowerCase() === "seller"
  const displayName =  "User"
  const initials = displayName.substring(0, 2).toUpperCase()

  console.log(user);
  

  const handleLogout = async () => {
    await dispatch(logout())
    router.push("/")
  }

  const sellerLinks = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Analytics", path: "/dashboard/analytics", icon: PieChart },
    { name: "Products", path: "/dashboard/products", icon: Package },
    { name: "Add Product", path: "/dashboard/add-product", icon: FilePlus },
  ]

  const customerLinks = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Order History", path: "/order-history", icon: ShoppingBag },
    { name: "Transactions", path: "/transactions", icon: PieChart },
  ]

  const navigationLinks = isSeller ? sellerLinks : customerLinks

  const isLinkActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true
    }
    return pathname.startsWith(path) && path !== "/dashboard"
  }

  return (
    <div className="max-md:bg-muted-foreground backdrop-blur-lg">
      <Sidebar >
        <SidebarHeader className="flex h-14 items-center border-b px-4">
          <div className="flex items-center max-md:hidden gap-2 font-semibold">{isSeller ? "Seller Portal" : "Customer Portal"}</div>
          <SidebarTrigger className="ml-auto md:hidden" />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationLinks.map((link) => (
                  <SidebarMenuItem key={link.path}>
                    <SidebarMenuButton asChild isActive={isLinkActive(link.path)} tooltip={link.name}>
                      <Link href={link.path}>
                        <link.icon />
                        <span>{link.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Account Settings">
                    <Link href="/dashboard/settings">
                      <Settings />
                      <span>Account Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-2 px-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user?.profileImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ04IQPD-wCoIQ3vpWQy5mjc1HTVrCP1ZvJyg&s"} alt={displayName} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-1 items-center justify-between overflow-hidden">
                  <span className="truncate">{user?.user.username}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="mt-4 text-xs text-muted-foreground">
            {isSeller ? "Seller Portal" : "Customer Portal"} v1.0
          </div>
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}

export default DashboardSidebar

