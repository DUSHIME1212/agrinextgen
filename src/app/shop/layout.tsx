import Footer from "@/components/layout/Footer";
import Layout from "@/components/layout/Layout";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { Provider } from "react-redux";
import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { store } from "@/redux/store";
import { Suspense } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
