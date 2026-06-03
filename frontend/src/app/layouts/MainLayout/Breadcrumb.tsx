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
    // LKT List
    else if (pathname === '/lkt') {
      steps.push({ label: 'Laporan Kunjungan Teknis (LKT)' });
    }
    // LKT Add
    else if (pathname === '/lkt/create') {
      steps.push({ label: 'Laporan Kunjungan Teknis (LKT)', path: '/lkt' });
      steps.push({ label: 'Tambah' });
    }
    // LKT Realisasi Add Route
    else if (pathname.startsWith('/lkt/realisasi/create/')) {
      const code = pathname.split('/')[4] || '';
      const formattedCode = code.replace(/\./g, '/');
      steps.push({ label: 'Laporan Kunjungan Teknisi (LKT)', path: '/lkt' });
      steps.push({ label: `Detail ${formattedCode}`, path: `/lkt/${code}/edit` });
      steps.push({ label: 'Create' });
    }
    // LKT Realisasi Edit/Detail Route
    else if (pathname.startsWith('/lkt/realisasi/') && pathname.endsWith('/edit')) {
      const subCode = pathname.split('/')[3] || '';
      const parts = subCode.split('.');
      const noUrut = parts.pop() || '';
      
      const searchParams = new URLSearchParams(location.search);
      const paramLkt = searchParams.get('lkt');
      
      let lktCode = paramLkt || parts.join('.');
      if (lktCode.startsWith('RS-')) {
        lktCode = 'LKT-' + lktCode.substring(3);
      }
      const formattedLktCode = lktCode ? lktCode.replace(/\./g, '/') : '';
      
      const mode = searchParams.get('mode') || 'detail';
      const isEditing = mode === 'edit';

      steps.push({ label: 'Laporan Kunjungan Teknisi (LKT)', path: '/lkt' });
      if (formattedLktCode) {
        steps.push({ label: `Detail ${formattedLktCode}`, path: `/lkt/${lktCode}/edit` });
      }
      steps.push({ label: `${isEditing ? 'Edit' : 'Detail'} Realisasi ${noUrut}` });
    }
    // LKT Edit/Detail Route
    else if (pathname.startsWith('/lkt/') && pathname.endsWith('/edit')) {
      const parts = pathname.split('/');
      const code = parts[2];
      const cstCode = parts[3] ? parts[3].replace(/\./g, '/') : '';
      const mode = new URLSearchParams(location.search).get('mode') || 'detail';
      const isEditing = mode === 'edit';

      steps.push({ label: 'Laporan Kunjungan Teknisi (LKT)', path: '/lkt' });
      steps.push({ label: `${isEditing ? 'Edit' : 'Detail'} ${code.replace(/\./g, '/')}` });
    }
    // CST List
    else if (pathname === '/cst') {
      steps.push({ label: 'Customer Service Ticket (CST)' });
    }
    // CST Edit/Detail Route
    else if (pathname.startsWith('/cst/') && pathname.endsWith('/edit')) {
      const code = pathname.split('/')[2];
      const formattedCode = code.replace(/\./g, '/');
      steps.push({ label: 'Customer Service Ticket (CST)', path: '/cst' });
      steps.push({ label: `Detail ${formattedCode}` });
    }
    // LogBookProduct List
    else if (pathname === '/logbookproduct') {
      steps.push({ label: 'Log Book Product' });
    }
    // LogBookProduct Add
    else if (pathname === '/logbookproduct/create') {
      steps.push({ label: 'Log Book Product', path: '/logbookproduct' });
      steps.push({ label: 'Tambah' });
    }
    // LogBookProduct Edit Route
    else if (pathname.startsWith('/logbookproduct/') && pathname.endsWith('/edit')) {
      const id = pathname.split('/')[2];
      steps.push({ label: 'Log Book Product', path: '/logbookproduct' });
      steps.push({ label: `Edit ${id}` });
    }
    // LogBookCustomers List
    else if (pathname === '/logbookcustomers') {
      steps.push({ label: 'Log Book Customers' });
    }
    // LogBookCustomers Add
    else if (pathname === '/logbookcustomers/create') {
      steps.push({ label: 'Log Book Customers', path: '/logbookcustomers' });
      steps.push({ label: 'Tambah' });
    }
    // LogBookCustomers Edit Route
    else if (pathname.startsWith('/logbookcustomers/') && pathname.endsWith('/edit')) {
      const id = pathname.split('/')[2];
      steps.push({ label: 'Log Book Customers', path: '/logbookcustomers' });
      steps.push({ label: `Edit ${id}` });
    }
    // Cek Serial Number
    else if (pathname === '/cekserialnumber') {
      steps.push({ label: 'Cek Serial Number' });
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
