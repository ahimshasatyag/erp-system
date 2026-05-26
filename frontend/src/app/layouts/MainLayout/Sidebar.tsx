import { useState, useEffect, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../../../assets/logo.png'
import logoSquare from '../../../assets/logos.jpg'
import { useSidebarMenus } from '../../../modules/menu/hooks/useMenu'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  isCollapsed?: boolean // For desktop collapse state
}

export default function Sidebar({ isOpen, onClose, isCollapsed }: SidebarProps) {
  const location = useLocation()
  const currentPath = location.pathname

  const resolvePath = (path?: string) => {
    if (!path) return '#';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return path.startsWith('/') ? path : `/${path}`;
  };

  const checkIsActive = (menuPath?: string) => {
    if (!menuPath) return false;
    const resolved = resolvePath(menuPath);
    if (resolved === '/') {
      return currentPath === '/';
    }
    return currentPath === resolved || currentPath.startsWith(resolved + '/');
  };

  // Active menu group toggle state (allows only one open at a time)
  const [activeGroup, setActiveGroup] = useState<string | null>(null)

  const toggleGroup = (title: string) => {
    setActiveGroup((prev) => (prev === title ? null : title))
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

  // Map icon names from database to local SVG elements
  const iconMap: { [key: string]: ReactNode } = {
    dashboardIcon: dashboardIcon,
    databaseIcon: databaseIcon,
    cartIcon: cartIcon,
    chartIcon: chartIcon,
    settingsIcon: settingsIcon,
  }

  // Fetch dynamic menus from database via React Query
  const { data: menuItems = [], isLoading } = useSidebarMenus()

  // Prepend static Dashboard menu item if it doesn't already exist in the database menu list
  const hasDashboard = menuItems.some(item => item.title.toLowerCase() === 'dashboard')
  const finalMenuItems = hasDashboard
    ? menuItems
    : [
      {
        title: 'Dashboard',
        path: '/',
        icon: 'dashboardIcon',
        submenu: null
      },
      ...menuItems
    ]

  // Auto-open active group on load or path changes
  useEffect(() => {
    const activeItem = finalMenuItems.find(item =>
      item.submenu?.some(sub => checkIsActive(sub.path))
    )
    if (activeItem) {
      setActiveGroup(activeItem.title)
    }
  }, [currentPath, finalMenuItems])

  // Close all open dropdowns when sidebar collapses (hamburger clicked)
  useEffect(() => {
    if (isCollapsed) {
      setActiveGroup(null)
    }
  }, [isCollapsed])

  // Render navigation list
  const renderMenuContent = () => {
    if (isLoading) {
      return (
        <div className="py-4 px-4 space-y-4">
          {!isCollapsed && (
            <div className="h-3 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          )}
          <div className="space-y-3 mt-4">
            <div className="h-10 w-full bg-gray-100 dark:bg-gray-800/60 rounded-lg animate-pulse" />
            <div className="h-10 w-full bg-gray-100 dark:bg-gray-800/60 rounded-lg animate-pulse" />
            <div className="h-10 w-full bg-gray-100 dark:bg-gray-800/60 rounded-lg animate-pulse" />
          </div>
        </div>
      )
    }

    return (
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
          {finalMenuItems.map((item, index) => {
            const isGroup = item.submenu && item.submenu.length > 0
            const isGroupOpen = activeGroup === item.title
            const isItemActive = checkIsActive(item.path)
            const isSubmenuActive = item.submenu?.some(sub => checkIsActive(sub.path))

            // Map deprecated book-variant-multiple to book-multiple for CSS compliance with modern MDI
            const rawIcon = item.icon || ''
            const mappedIcon = rawIcon.replace('mdi-book-variant-multiple', 'mdi-book-multiple')

            // Check if icon is a class name (contains spaces or starts with fa/mdi)
            const isClassIcon = mappedIcon && (mappedIcon.includes(' ') || mappedIcon.startsWith('fa') || mappedIcon.startsWith('mdi'))

            // Determine class colors dynamically for consistent state contrast
            const iconColorClass = isItemActive || isSubmenuActive
              ? 'text-white'
              : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'

            const resolvedIcon = isClassIcon ? (
              <span className={`shrink-0 flex items-center justify-center w-5 h-5 transition-colors duration-200 ${iconColorClass}`}>
                <i className={`${mappedIcon} text-base`} />
              </span>
            ) : (
              mappedIcon && iconMap[mappedIcon] ? iconMap[mappedIcon] : databaseIcon
            )

            return (
              <div key={index} className="w-full relative group">
                {isGroup ? (
                  /* Group parent item */
                  <div>
                    <button
                      onClick={() => toggleGroup(item.title)}
                      className={`group flex items-center justify-between transition-all duration-200 outline-none cursor-pointer ${
                        isCollapsed
                          ? 'mx-auto w-10 h-10 justify-center rounded-lg'
                          : 'w-full px-3 py-2.5 rounded-lg text-sm font-semibold'
                      } ${isSubmenuActive
                        ? 'bg-[var(--primary)] text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="shrink-0">{resolvedIcon}</span>
                        {!isCollapsed && <span>{item.title}</span>}
                      </div>
                      {!isCollapsed && (
                        <svg
                          className={`w-4 h-4 transition-transform duration-300 ${isGroupOpen ? 'rotate-180' : ''
                            }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </button>

                    {/* Submenu links with smooth transition */}
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${isGroupOpen && !isCollapsed
                          ? 'grid-rows-[1fr] opacity-100 mt-1.5 mb-1'
                          : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                        }`}
                    >
                      <div className="overflow-hidden ml-6 pl-2 border-l border-gray-100 dark:border-gray-700 space-y-1">
                        {item.submenu?.map((sub, idx) => {
                          const isSubActive = checkIsActive(sub.path)
                          return (
                            <Link
                              key={idx}
                              to={resolvePath(sub.path)}
                              className={`block text-left px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${isSubActive
                                ? 'text-[var(--primary)] bg-gray-100 font-bold dark:text-[var(--primary-container)] dark:bg-gray-800'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800/40'
                                }`}
                            >
                              {sub.title}
                            </Link>
                          )
                        })}
                      </div>
                    </div>

                    {/* Side Flyout Dropdown for Collapsed Mode (Positioned absolute inside layout, scrolling naturally) */}
                    {isCollapsed && (
                      <div className="absolute left-full top-0 ml-2 w-56 bg-white dark:bg-[#1f2028] rounded-lg shadow-2xl border border-gray-200 dark:border-[#2e303a] overflow-hidden opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 origin-left z-50">
                        <div className="px-6 py-4 bg-gray-50 dark:bg-[#181920] border-b border-gray-100 dark:border-[#2e303a]">
                          <span className="text-sm font-bold text-gray-900 dark:text-white tracking-wide block">{item.title}</span>
                        </div>
                        <div className="py-2 px-1.5 space-y-0.5">
                          {item.submenu?.map((sub, idx) => {
                            const isSubActive = checkIsActive(sub.path)
                            return (
                              <Link
                                key={idx}
                                to={resolvePath(sub.path)}
                                className={`block text-left px-6 py-2.5 rounded-md text-xs font-medium italic transition-colors duration-150 ${isSubActive
                                  ? 'text-[var(--primary)] bg-gray-50 font-bold dark:text-[var(--primary-container)] dark:bg-gray-800/60'
                                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800/40'
                                  }`}
                              >
                                {sub.title}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Single active link */
                  <>
                    <Link
                      to={resolvePath(item.path)}
                      className={`group flex items-center transition-all duration-200 ${
                        isCollapsed
                          ? 'mx-auto w-10 h-10 justify-center rounded-lg'
                          : 'w-full px-3 py-2.5 rounded-lg text-sm font-semibold gap-3'
                      } ${isItemActive
                        ? 'bg-[var(--primary)] text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                      <span className="shrink-0">{resolvedIcon}</span>
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>

                    {/* Simple Tooltip for Collapsed Mode (Positioned absolute inside layout, scrolling naturally) */}
                    {isCollapsed && (
                      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-gray-900 dark:bg-gray-800 text-white text-[11px] font-semibold rounded-md shadow-md opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 origin-left z-50 whitespace-nowrap">
                        {item.title}
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    )
  }

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
        className={`fixed top-0 bottom-0 left-0 h-screen bg-white dark:bg-[#1f2028] text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-[#2e303a] z-46 transition-all duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'w-16 overflow-visible' : 'w-60'}`}
      >
        {/* Brand Logo Header (Fixed at top of Sidebar) */}
        <div className="h-16 border-b border-gray-100 dark:border-[#2e303a] flex items-center justify-center w-full shrink-0 overflow-hidden">
          <a href="/" className="flex items-center justify-center w-full h-full px-4">
            <img
              src={isCollapsed ? logoSquare : logo}
              alt="EMMA ERP SYSTEM"
              className={`object-contain transition-all duration-300 ${isCollapsed ? 'h-10 w-10 rounded-md' : 'h-13 w-auto max-w-[210px]'
                }`}
            />
          </a>
        </div>

        {/* Scrollable menu area:
             - Expanded: own vertical scroll (overflow-y-auto), hidden scrollbar
             - Collapsed: overflow-visible so side flyouts are not clipped */}
        <div className={`flex-1 no-scrollbar ${
          isCollapsed
            ? 'overflow-visible'
            : 'overflow-y-auto overflow-x-hidden'
        }`}>
          {renderMenuContent()}
        </div>

      </aside>
    </>
  )
}
