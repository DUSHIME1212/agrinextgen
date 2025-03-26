"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FilePlus, Package, PieChart, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { useAppDispatch } from "@/redux/hooks";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/redux/slices/authSlice";

export type UserRole = 'SELLER' | 'CUSTOMER' | 'ADMIN'; // Use uppercase to match your API

export interface User {
  id: string;
  email: string;
  name?: string;
  businessName?: string;
  contactPerson?: string;
  phoneNumber?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  status: 'success' | 'error';
  message: string;
  data: {
    token: string;
    user: User;
  };
}

const DashBoardLayout = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { isAuthenticated, user, userRole } = useAuth();

    const location = usePathname();
  console.log(user);

  console.log(userRole);
  
  
  const userType = {
    type: userRole,
  };
  const handleLogout = async () => {
    await dispatch(logout());
    router.push("/");
  };
  const navigationLinks =
    userType.type === "seller"
      ? [
          { name: "dashboard", path: "/dashboard", icon: PieChart },
          { name: "Analytics", path: "/dashboard/analytics", icon: PieChart },
          { name: "Products", path: "/dashboard/products", icon: Package },
          {
            name: "Add Product",
            path: "/dashboard/add-product",
            icon: FilePlus,
          },
        ]
      : [
          { name: "dashboard", path: "/dashboard", icon: PieChart },
          { name: "Order History", path: "/order-history", icon: PieChart },
          { name: "Transactions", path: "/transactions", icon: ShoppingBag },
        ];
  return (
    <Sidebar className="flex min-h-screen flex-col justify-between gap-8 md:flex-row">
      <div className="flex h-full flex-col justify-between px-2">
        <SidebarHeader className="px-3 py-2">
          <h2 className="text-lg font-bold">
            {userType.type === "seller" ? "Seller Dashboard" : "Account"}
          </h2>
        </SidebarHeader>
        <SidebarContent>
          <div>
            {navigationLinks.map((link) => (
              <div key={link.path}>
                <Button
                  asChild
                  className={`w-full justify-start bg-none capitalize ${
                    (location?.split("/").pop()?.toLowerCase() ?? "").includes(
                      link.path.toLowerCase(),
                    )
                      ? "tepr"
                      : "bg- text-primary hover:text-primary-foreground"
                  }`}
                  data-tooltip={link.name}
                >
                  <Link href={link.path}>
                    <link.icon />
                    <span>{link.name}</span>
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </SidebarContent>
        <SidebarFooter className="mb-20">
          <div className="px-3 py-2 text-xs text-sidebar-foreground/70">
            {userType.type === "seller"
              ? "Seller Portal v1.0"
              : "Customer Portal v1.0"}
            <Button className="w-full" onClick={handleLogout} variant={"destructive"}>
              Logout
            </Button>
          </div>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
};

export default DashBoardLayout;
