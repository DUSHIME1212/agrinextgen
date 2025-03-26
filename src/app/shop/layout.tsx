
import Navbar from "@/components/layout/Navbar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Navbar/>
      <main>
        {children}
      </main>
    </SidebarProvider>
  )
}