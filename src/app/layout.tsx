import Footer from "@/components/layout/Footer";
import Layout from "@/components/layout/Layout";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { Provider } from "react-redux";
import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { store } from "@/redux/store";
import { Providers } from "./providers";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "AgriNextGen",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/Agrine.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Suspense>
          <Providers>
            <Toaster />
            {children}
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
