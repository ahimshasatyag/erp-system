import { useState, useRef, useEffect } from 'react'

export default function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2e303a] relative transition-all duration-200 outline-none cursor-pointer"
        title="Notifications"
      >
        {/* Bell SVG Icon */}
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
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {/* Badge Counter */}
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1f2028] rounded-xl shadow-lg border border-gray-200 dark:border-[#2e303a] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="bg-[var(--primary)] px-4 py-3 text-white flex justify-between items-center">
            <span className="font-semibold text-sm">Notifications</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white text-xs font-semibold hover:underline bg-transparent border-none cursor-pointer"
            >
              Clear All
            </button>
          </div>

          {/* Scrollable list */}
          <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-[#2e303a]">
            
            {/* Item 1 */}
            <a
              href="#settings"
              className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-[#2e303a] transition-colors duration-150"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">New settings</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">There are new settings available</p>
              </div>
            </a>

            {/* Item 2 */}
            <a
              href="#updates"
              className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-[#2e303a] transition-colors duration-150"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">Updates</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">There are 2 new updates available</p>
              </div>
            </a>

            {/* Item 3 */}
            <a
              href="#messages"
              className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-[#2e303a] transition-colors duration-150"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">New user</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">You have 10 unread messages</p>
              </div>
            </a>

            {/* Item 4 */}
            <a
              href="#comments"
              className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-[#2e303a] transition-colors duration-150"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">Caleb Flakelar commented</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Commented on Admin &bull; 4d ago</p>
              </div>
            </a>
          </div>

          {/* Footer View All */}
          <a
            href="#all-notifications"
            className="block text-center py-2 text-xs font-semibold text-[var(--primary)] hover:underline border-t border-gray-100 dark:border-[#2e303a] dark:text-rose-400 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            View all
          </a>
        </div>
      )}
    </div>
  )
}
