"use client"

import { FilePlus, Package, PieChart, ShoppingBag, Sidebar, History } from 'lucide-react'
import React from 'react'
import { SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const AppSidebar = () => {
  const  location  = usePathname()
    const userType = {
        type: "seller",
    }
    const navigationLinks = userType.type  === 'seller' 
    ? [
        { name: 'Overview', path: '/dashboard', icon: PieChart },
        { name: 'Analytics', path: '/dashboard/analytics', icon: PieChart },
        { name: 'Products', path: '/dashboard/products', icon: Package },
        { name: 'Add Product', path: '/dashboard/add-product', icon: FilePlus },
        { name: 'Orders', path: '/dashboard/orders', icon: ShoppingBag },
      ]
    : [
        { name: 'Overview', path: '/dashboard', icon: PieChart },
        { name: 'Order History', path: '/order-history', icon: History },
        { name: 'Transactions', path: '/transactions', icon: ShoppingBag },
      ];
  return (
    <div className="flex flex-col md:flex-row py-8 gap-8 w-full">
    <Sidebar className="sidebar-left sidebar-floating">
      <SidebarHeader className="px-3 py-2">
        <h2 className="font-bold text-lg">
          {userType.type === 'seller' ? 'Seller Dashboard' : 'Account'}
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navigationLinks.map((link) => (
            <SidebarMenuItem key={link.path}>
              <SidebarMenuButton 
                asChild 
                isActive={location === link.path || 
                        (link.path === '/dashboard' && location === '/dashboard')}
                tooltip={link.name}
              >
                <Link
                  href={link.path}
                >
                  <link.icon />
                  <span>{link.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2 text-xs text-sidebar-foreground/70">
          {userType.type === 'seller' ? 'Seller Portal v1.0' : 'Customer Portal v1.0'}
        </div>
      </SidebarFooter>
    </Sidebar>
  </div>
  )
}

export default AppSidebar