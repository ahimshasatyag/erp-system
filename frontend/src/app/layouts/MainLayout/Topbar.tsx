import Breadcrumb from './Breadcrumb'
import NotificationPanel from './NotificationPanel'
import UserDropdown from './UserDropdown'

interface TopbarProps {
  onToggleSidebar?: () => void
  isSidebarOpen?: boolean
}

export default function Topbar({ onToggleSidebar }: TopbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#1f2028] border-b border-gray-200 dark:border-[#2e303a] flex items-center justify-between px-4 z-40 transition-colors duration-200">
      
      {/* Brand & Left Side Navigation */}
      <div className="flex items-center gap-4">
        {/* LOGO AREA */}
        <a href="/" className="flex items-center gap-2 font-sans">
          <div className="flex flex-col items-start leading-none">
            <span className="font-extrabold text-[22px] tracking-tight text-[var(--primary)] animate-pulse">
              EMMA
            </span>
            <span className="text-[9px] font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
              ERP SYSTEM
            </span>
          </div>
        </a>

        {/* Sidebar Toggle Hamburger */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2e303a] transition-all duration-200 outline-none cursor-pointer"
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
        <div className="w-[1px] h-6 bg-gray-200 dark:bg-[#2e303a]" />

        {/* Modular User Profile Menu */}
        <UserDropdown />
      </div>

    </header>
  )
}
