"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Menu, X, ShoppingCart, Heart, Search, User, ChevronDown, Sun, Moon, LayoutGrid, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import Logo from "../home/Logo"
import { useAppDispatch } from "@/redux/hooks"
import  logout, { logoutUser }  from "@/redux/slices/authSlice"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"

interface NavItem {
  name: string
  path: string
  children?: { name: string; path: string }[]
}
interface user {
  user: {
    data: {
      user: {
        name: string
        email: string
        image: string
      }
    }
  }
}

const navItems: NavItem[] = [
  { name: "Home", path: "/" },
  {
    name: "Shop",
    path: "/shop",
  },
  { name: "Blog", path: "/blog" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
]

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [theme, setTheme] = useState("light")
  const location = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user, userRole } = useAuth()

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    await dispatch(logoutUser())
    router.push("/")
  }
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark")
  }

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name)
  }

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 bg-background px-8 transition-all duration-300 md:px-16 lg:px-32",
        scrolled ? "py-2 shadow-sm" : "py-4",
        "border-b border-border",
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2">
            <Logo className="size-8" />
            <span className="text-xl font-bold text-primary">AgriNextGen</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden space-x-6 md:flex">
            {navItems.map((item) => (
              <div key={item.name} className="group relative">
                {item.children ? (
                  <button className="nav-link flex items-center gap-1" onClick={() => toggleDropdown(item.name)}>
                    {item.name}
                    <ChevronDown
                      size={16}
                      className={cn(
                        "transition-transform duration-200",
                        activeDropdown === item.name ? "rotate-180" : "",
                      )}
                    />
                  </button>
                ) : (
                  <Link href={item.path} className={cn("nav-link", location === item.path && "active")}>
                    {item.name}
                  </Link>
                )}

                {/* Dropdown Menu */}
                {item.children && (
                  <div
                    className={cn(
                      "shadow-glass absolute left-0 top-full mt-1 min-w-[180px] origin-top-left overflow-hidden rounded-md border border-border bg-card transition-all duration-200",
                      activeDropdown === item.name ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
                    )}
                  >
                    <div className="py-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.path}
                          className="block px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden items-center space-x-2 md:flex">
            <button className="p-2 text-muted-foreground transition-colors hover:text-foreground" aria-label="Search">
              <Search size={20} />
            </button>

            <Link
              href="/wishlist"
              className="relative p-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Heart size={20} />
              <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-xs">0</Badge>
            </Link>

            <Link href="/cart" className="relative p-2 text-muted-foreground transition-colors hover:text-foreground">
              <ShoppingCart size={20} />
              <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-xs">0</Badge>
            </Link>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 text-muted-foreground transition-colors hover:text-foreground">
                    <User size={20} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{user?.name || user?.businessName || "User"}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Profile Settings</Link>
                  </DropdownMenuItem>
                  {userRole === "customer" && (
                    <DropdownMenuItem asChild>
                      <Link href="/order-history">Order History</Link>
                    </DropdownMenuItem>
                  )}
                  {userRole === "seller" && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/products">My Products</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth" className="p-2 text-muted-foreground transition-colors hover:text-foreground">
                <User size={20} />
              </Link>
            )}

            <button
              className="p-2 text-muted-foreground transition-colors hover:text-foreground"
              onClick={toggleTheme}
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <Link href="/cart" className="relative p-2 text-muted-foreground transition-colors hover:text-foreground">
              <ShoppingCart size={20} />
              <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-xs">0</Badge>
            </Link>

            <button
              className="p-2 text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-xs transform bg-background shadow-lg transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="border-b px-6 py-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold text-primary">
                AgriNextGen
              </Link>
              <button
                className="p-2 text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <div key={item.name} className="space-y-2">
                  {item.children ? (
                    <>
                      <button
                        className="flex w-full items-center justify-between py-2 text-foreground"
                        onClick={() => toggleDropdown(item.name)}
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          size={16}
                          className={cn(
                            "transition-transform duration-200",
                            activeDropdown === item.name ? "rotate-180" : "",
                          )}
                        />
                      </button>

                      <div
                        className={cn(
                          "flex flex-col space-y-1 overflow-hidden pl-4 transition-all duration-200",
                          activeDropdown === item.name ? "max-h-40 opacity-100" : "max-h-0 opacity-0",
                        )}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.path}
                            className="w-full rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.path}
                      className="w-full rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div className="border-t px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <button
                  className="p-2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>

                <Link href="/wishlist" className="p-2 text-muted-foreground transition-colors hover:text-foreground">
                  <Heart size={20} />
                </Link>

                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="p-2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <LogOut size={20} />
                  </button>
                ) : (
                  <Link href="/auth" className="p-2 text-muted-foreground transition-colors hover:text-foreground">
                    <User size={20} />
                  </Link>
                )}

                <button
                  className="p-2 text-muted-foreground transition-colors hover:text-foreground"
                  onClick={toggleTheme}
                  aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                >
                  {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                </button>
              </div>

              <Link href="/shop" className="btn btn-primary px-4 py-2">
                <LayoutGrid size={16} className="mr-2" />
                Shop
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  )
}

export default Navbar

