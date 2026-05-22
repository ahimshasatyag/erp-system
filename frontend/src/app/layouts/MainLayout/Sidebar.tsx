import { useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  isCollapsed?: boolean // For desktop collapse state
}

interface MenuItem {
  title: string
  path?: string
  icon: ReactNode
  submenu?: { title: string; path: string }[]
}

export default function Sidebar({ isOpen, onClose, isCollapsed }: SidebarProps) {
  const location = useLocation()
  const currentPath = location.pathname

  // Menu groups toggle states
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({
    'Master Data': false,
    'Transactions': false,
    'Reports': false,
  })

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  // Icons SVGs
  const dashboardIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )

  const databaseIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  )

  const cartIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  )

  const chartIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )

  const settingsIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  )

  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      path: '/',
      icon: dashboardIcon,
    },
    {
      title: 'Master Data',
      icon: databaseIcon,
      submenu: [
        { title: 'Users List', path: '/users' },
        { title: 'User Levels', path: '/levels' },
        { title: 'Settings System', path: '/settings' },
      ],
    },
    {
      title: 'Transactions',
      icon: cartIcon,
      submenu: [
        { title: 'Purchase Orders', path: '/po' },
        { title: 'Sales Orders', path: '/so' },
        { title: 'Invoice List', path: '/invoices' },
      ],
    },
    {
      title: 'Reports',
      icon: chartIcon,
      submenu: [
        { title: 'Sales Reports', path: '/reports/sales' },
        { title: 'Inventory Logs', path: '/reports/inventory' },
      ],
    },
    {
      title: 'System Settings',
      path: '/settings',
      icon: settingsIcon,
    },
  ]

  // Render navigation list
  const renderMenuContent = () => (
    <div className="py-4">
      {/* Title */}
      {!isCollapsed && (
        <div className="px-5 py-2">
          <p className="text-[10.5px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">
            Navigation Menu
          </p>
        </div>
      )}

      {/* Menu Tree */}
      <nav className="mt-3 px-3 space-y-1">
        {menuItems.map((item, index) => {
          const isGroup = !!item.submenu
          const isGroupOpen = openGroups[item.title]
          const isItemActive = item.path === currentPath
          const isSubmenuActive = item.submenu?.some(sub => sub.path === currentPath)

          return (
            <div key={index} className="w-full">
              {isGroup ? (
                /* Group parent item */
                <div>
                  <button
                    onClick={() => toggleGroup(item.title)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 outline-none cursor-pointer ${
                      isSubmenuActive
                        ? 'bg-[var(--primary)] text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="shrink-0">{item.icon}</span>
                      {!isCollapsed && <span>{item.title}</span>}
                    </div>
                    {!isCollapsed && (
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isGroupOpen ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>

                  {/* Submenu links */}
                  {isGroupOpen && !isCollapsed && (
                    <div className="mt-1 ml-6 pl-2 border-l border-gray-250/70 dark:border-gray-700 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                      {item.submenu?.map((sub, idx) => {
                        const isSubActive = sub.path === currentPath
                        return (
                          <Link
                            key={idx}
                            to={sub.path}
                            className={`block px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                              isSubActive
                                ? 'text-[var(--primary)] bg-gray-100 font-bold dark:text-[var(--primary-container)] dark:bg-gray-800'
                                : 'text-gray-550 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800/40'
                            }`}
                          >
                            {sub.title}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* Single active link */
                <Link
                  to={item.path || '#'}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isItemActive
                      ? 'bg-[var(--primary)] text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )

  return (
    <>
      {/* MOBILE SIDEBAR DRAWER OVERLAY */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-45 md:hidden transition-opacity duration-300 animate-in fade-in"
        />
      )}

      {/* SIDEBAR MAIN PANEL */}
      <aside
        className={`fixed top-0 bottom-0 left-0 bg-white dark:bg-[#1f2028] text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-[#2e303a] z-46 transition-all duration-300 ease-in-out flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'w-16' : 'w-60'}`}
      >
        {/* Brand Logo Header (Fixed at top of Sidebar) */}
        <div className="h-16 border-b border-gray-150 dark:border-[#2e303a] flex items-center justify-center md:justify-start px-4 shrink-0 overflow-hidden">
          <a href="/" className="flex items-center gap-2 font-sans">
            <div className="flex flex-col items-start leading-none">
              <span className="font-extrabold text-[22px] tracking-tight text-[var(--primary)] animate-pulse">
                EMMA
              </span>
              {!isCollapsed && (
                <span className="text-[9px] font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
                  ERP SYSTEM
                </span>
              )}
            </div>
          </a>
        </div>

        {/* Scrollable menu area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
          {renderMenuContent()}
        </div>

        {/* Footer info/System indicators inside Sidebar */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-150 dark:border-[#2e303a] bg-gray-50 dark:bg-[#1f2028]/10 text-center text-[10px] text-gray-400 dark:text-gray-500">
            <p>System Version: 2.1.0-RC</p>
            <p className="mt-0.5">DB Status: Connected</p>
          </div>
        )}
      </aside>
    </>
  )
}
