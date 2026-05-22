import { useLocation, Link } from 'react-router-dom'

interface BreadcrumbStep {
  label: string
  path?: string
}

export default function Breadcrumb() {
  const location = useLocation()
  const path = location.pathname

  // Maps exact routes to user-friendly structured breadcrumbs
  const getBreadcrumbs = (pathname: string): BreadcrumbStep[] => {
    const steps: BreadcrumbStep[] = [{ label: 'Home', path: '/' }]

    if (pathname === '/' || pathname === '') {
      steps.push({ label: 'Dashboard' })
      return steps
    }

    // Master Data
    if (pathname === '/users') {
      steps.push({ label: 'Master Data' })
      steps.push({ label: 'Users List' })
    } else if (pathname === '/levels') {
      steps.push({ label: 'Master Data' })
      steps.push({ label: 'User Levels' })
    } else if (pathname === '/settings') {
      steps.push({ label: 'Settings' })
    }
    // Transactions
    else if (pathname === '/po') {
      steps.push({ label: 'Transactions' })
      steps.push({ label: 'Purchase Orders' })
    } else if (pathname === '/so') {
      steps.push({ label: 'Transactions' })
      steps.push({ label: 'Sales Orders' })
    } else if (pathname === '/invoices') {
      steps.push({ label: 'Transactions' })
      steps.push({ label: 'Invoices' })
    }
    // Reports
    else if (pathname === '/reports/sales') {
      steps.push({ label: 'Reports' })
      steps.push({ label: 'Sales Reports' })
    } else if (pathname === '/reports/inventory') {
      steps.push({ label: 'Reports' })
      steps.push({ label: 'Inventory Logs' })
    }
    // Dynamic Fallback
    else {
      const segments = pathname.split('/').filter(Boolean)
      segments.forEach((seg, index) => {
        const formatted = seg
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase())
        
        const accumPath = '/' + segments.slice(0, index + 1).join('/')
        const isLast = index === segments.length - 1

        steps.push({
          label: formatted,
          path: isLast ? undefined : accumPath
        })
      })
    }

    return steps
  }

  const breadcrumbs = getBreadcrumbs(path)

  return (
    <nav className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
      {breadcrumbs.map((step, index) => {
        const isLast = index === breadcrumbs.length - 1

        return (
          <div key={index} className="flex items-center space-x-1.5">
            {index > 0 && (
              <svg
                className="w-3 h-3 text-gray-300 dark:text-gray-600 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}

            {isLast ? (
              <span className="text-gray-800 dark:text-gray-200 truncate max-w-[150px]">
                {step.label}
              </span>
            ) : (
              <Link
                to={step.path || '#'}
                className="hover:text-[var(--primary)] dark:hover:text-rose-400 transition-colors flex items-center gap-1"
              >
                {step.label === 'Home' && (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                )}
                <span>{step.label}</span>
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
