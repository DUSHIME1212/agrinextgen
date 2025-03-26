import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import {
  PieChart,
  ShoppingBag,
  Package,
  History,
  Settings,
  Users,
  FilePlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarFooter,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import DashBoardLayout from "@/components/DashBoardLayout";
import ProtectedRoute from "@/components/protected-route";

interface DashboardLayoutProps {
  userType: "seller" | "buyer";
  customBreadcrumbPaths?: { name: string; path: string }[];
  children?: React.ReactNode;
}

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ProtectedRoute allowedUserTypes={["customer", "seller"]}>
      <SidebarProvider className="bg-card">
        <DashBoardLayout />
        <main className="w-full">
          <div className="" />
          {children}
        </main>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
