import { useState, type ReactNode } from 'react'
import Topbar from './Topbar'
import Sidebar from './Sidebar'
import Footer from './Footer'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  // Mobile drawer open state
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false)

  // Desktop sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const handleToggleSidebar = () => {
    // If mobile, toggle mobile overlay drawer
    if (window.innerWidth < 768) {
      setIsSidebarMobileOpen(!isSidebarMobileOpen)
    } else {
      // If desktop, collapse sidebar to slim bar
      setIsSidebarCollapsed(!isSidebarCollapsed)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#16171d] font-sans flex flex-col transition-colors duration-200">
      
      {/* Dynamic Topbar Header */}
      <Topbar
        onToggleSidebar={handleToggleSidebar}
        isSidebarOpen={!isSidebarCollapsed}
      />

      {/* Side Navigation Menu Drawer */}
      <Sidebar
        isOpen={isSidebarMobileOpen}
        onClose={() => setIsSidebarMobileOpen(false)}
        isCollapsed={isSidebarCollapsed}
      />

      {/* Main Structural Viewport Area */}
      <div
        className={`flex-1 flex flex-col pt-16 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'md:pl-16' : 'md:pl-60'
        }`}
      >
        
        {/* Children Page Views */}
        <main className="flex-grow p-6 md:p-8 animate-in fade-in duration-300">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>

        {/* Unified Bottom Footer */}
        <Footer />

      </div>

    </div>
  )
}
