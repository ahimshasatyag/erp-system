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
    const steps: BreadcrumbStep[] = []

    if (pathname === '/' || pathname === '') {
      steps.push({ label: 'Dashboard' })
      return steps
    }

    // CSR List
    else if (pathname === '/csr') {
      steps.push({ label: 'Customer Request (CSR)' });
    }
    // CSR Add
    else if (pathname === '/csr/create') {
      steps.push({ label: 'Customer Request (CSR)', path: '/csr' });
      steps.push({ label: 'Tambah' });
    }
    // CSR Edit/Detail Route
    else if (pathname.startsWith('/csr/') && pathname.endsWith('/edit')) {
      const code = pathname.split('/')[2];
      const formattedCode = code.replace(/\./g, '/');
      steps.push({ label: 'Customer Request (CSR)', path: '/csr' });
      steps.push({ label: `Edit ${formattedCode}` });
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
    <nav className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold text-gray-400 dark:text-gray-400">
      {breadcrumbs.map((step, index) => {
        const isLast = index === breadcrumbs.length - 1

        return (
          <div key={index} className="flex items-center space-x-1.5">
            {index > 0 && (
              <svg
                className="w-3 h-3 text-gray-600 dark:text-gray-600 shrink-0"
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
              <span className="text-white dark:text-gray-200">
                {step.label}
              </span>
            ) : (
              <Link
                to={step.path || '#'}
                className="hover:text-white dark:hover:text-rose-400 transition-colors flex items-center gap-1"
              >
                <span>{step.label}</span>
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
