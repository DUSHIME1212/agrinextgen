"use client";

import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  Heart,
  Search,
  User,
  ChevronDown,
  Sun,
  Moon,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavItem {
  name: string;
  path: string;
  children?: { name: string; path: string }[];
}

const navItems: NavItem[] = [
  { name: "Home", path: "/" },
  {
    name: "Shop",
    path: "/shop",
    children: [
      { name: "Seeds", path: "/shop/seeds" },
      { name: "Equipment", path: "/shop/equipment" },
      { name: "Fertilizers", path: "/shop/fertilizers" },
      { name: "Organic", path: "/shop/organic" },
    ],
  },
  { name: "Blog", path: "/blog" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [theme, setTheme] = useState("light");
  const location = usePathname();
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle theme toggle
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };
  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <header
      className={cn(
        "bg-background fixed left-0 right-0 top-0 px-8 md:px-16 z-50 transition-all duration-300",
        scrolled ? "py-2 shadow-sm" : "py-4",
        "border-border border-b",
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-primary text-xl font-bold">AgriNextGen</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden space-x-6 md:flex">
            {navItems.map((item) => (
              <div key={item.name} className="group relative">
                {item.children ? (
                  <button
                    className="nav-link flex items-center gap-1"
                    onClick={() => toggleDropdown(item.name)}
                  >
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
                  <Link
                    href={item.path}
                    className={cn(
                      "nav-link",
                      location === item.path && "active",
                    )}
                  >
                    {item.name}
                  </Link>
                )}

                {/* Dropdown Menu */}
                {item.children && (
                  <div
                    className={cn(
                      "bg-card shadow-glass border-border absolute left-0 top-full mt-1 min-w-[180px] origin-top-left overflow-hidden rounded-md border transition-all duration-200",
                      activeDropdown === item.name
                        ? "scale-100 opacity-100"
                        : "pointer-events-none scale-95 opacity-0",
                    )}
                  >
                    <div className="py-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.path}
                          className={(({ isActive }: { isActive: boolean }) =>
                            `rounded-md px-3 py-2 w-full text-sm font-medium ${
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "text-foreground hover:bg-secondary"
                            }`)({ isActive: true })}
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
            <button
              className="text-muted-foreground hover:text-foreground p-2 transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <Link
              href="/wishlist"
              className="text-muted-foreground hover:text-foreground relative p-2 transition-colors"
            >
              <Heart size={20} />
              <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-xs">
                0
              </Badge>
            </Link>

            <Link
              href="/cart"
              className="text-muted-foreground hover:text-foreground relative p-2 transition-colors"
            >
              <ShoppingCart size={20} />
              <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-xs">
                0
              </Badge>
            </Link>

            <Link
              href="/auth"
              className="text-muted-foreground hover:text-foreground p-2 transition-colors"
            >
              <User size={20} />
            </Link>

            <button
              className="text-muted-foreground hover:text-foreground p-2 transition-colors"
              onClick={toggleTheme}
              aria-label={
                theme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <Link
              href="/cart"
              className="text-muted-foreground hover:text-foreground relative p-2 transition-colors"
            >
              <ShoppingCart size={20} />
              <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-xs">
                0
              </Badge>
            </Link>

            <button
              className="text-muted-foreground hover:text-foreground p-2 transition-colors"
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
          "bg-background fixed inset-y-0 right-0 z-50 w-full max-w-xs transform shadow-lg transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="border-b px-6 py-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-primary text-xl font-bold">
                AgriNextGen
              </Link>
              <button
                className="text-muted-foreground hover:text-foreground p-2 transition-colors"
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
                        className="text-foreground flex w-full items-center justify-between py-2"
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
                          "space-y-1 overflow-hidden pl-4 transition-all flex flex-col duration-200",
                          activeDropdown === item.name
                            ? "max-h-40 opacity-100"
                            : "max-h-0 opacity-0",
                        )}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.path}
                            className={(({ isActive }: { isActive: boolean }) =>
                              `rounded-md w-full px-3 py-2 text-sm font-medium ${
                                isActive
                                  ? "bg-primary/0 text-primary"
                                  : "text-foreground hover:bg-secondary"
                              }`)({ isActive: true })}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.path}
                      className={(({ isActive }: { isActive: boolean }) =>
                        `rounded-md px-3 py-2 w-full text-sm font-medium ${
                          isActive
                            ? "bg-primary/0 text-primary"
                            : "text-foreground hover:bg-secondary"
                        }`)({ isActive: true })}
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
                  className="text-muted-foreground hover:text-foreground p-2 transition-colors"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>

                <Link
                  href="/wishlist"
                  className="text-muted-foreground hover:text-foreground p-2 transition-colors"
                >
                  <Heart size={20} />
                </Link>

                <Link
                  href="/auth"
                  className="text-muted-foreground hover:text-foreground p-2 transition-colors"
                >
                  <User size={20} />
                </Link>

                <button
                  className="text-muted-foreground hover:text-foreground p-2 transition-colors"
                  onClick={toggleTheme}
                  aria-label={
                    theme === "light"
                      ? "Switch to dark mode"
                      : "Switch to light mode"
                  }
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
  );
};

export default Navbar;
