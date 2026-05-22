import Breadcrumb from './Breadcrumb'
import NotificationPanel from './NotificationPanel'
import UserDropdown from './UserDropdown'

interface TopbarProps {
  onToggleSidebar?: () => void
  isSidebarOpen?: boolean
}

export default function Topbar({ onToggleSidebar, isSidebarOpen }: TopbarProps) {
  return (
    <header className={`fixed top-0 right-0 h-16 bg-[#161821] dark:bg-[#16171d] border-b border-gray-800 dark:border-[#2e303a] flex items-center justify-between px-4 z-40 transition-all duration-300 ease-in-out ${
      isSidebarOpen ? 'md:left-60' : 'md:left-16'
    } left-0`}>
      
      {/* Left Side Navigation Controls */}
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle Hamburger */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-850/60 dark:hover:bg-[#2e303a] transition-all duration-200 outline-none cursor-pointer"
          title="Toggle Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Breadcrumb Path Indicator */}
        <Breadcrumb />
      </div>

      {/* Right Side Icons & Menu */}
      <div className="flex items-center gap-3">
        {/* Modular Notifications Panel */}
        <NotificationPanel />

        {/* Vertical Divider */}
        <div className="w-[1px] h-6 bg-gray-800 dark:bg-[#2e303a]" />

        {/* Modular User Profile Menu */}
        <UserDropdown />
      </div>

    </header>
  )
}
