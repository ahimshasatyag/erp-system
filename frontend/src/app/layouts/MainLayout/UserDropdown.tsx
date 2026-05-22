import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../stores/auth.store'
import api from '../../../services/api'

export default function UserDropdown() {
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await api.post('/logout')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setUser(null)
      navigate('/login')
    }
  }

  const getInitials = (name: string) => {
    if (!name) return 'U'
    const parts = name.split(' ')
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name[0].toUpperCase()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#2e303a] transition-all duration-200 outline-none cursor-pointer"
      >
        {/* Avatar Photo */}
        {user?.link_foto ? (
          <img
            src={`/assets/images/users/${user.link_foto}`}
            alt={user.name || 'User'}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100 dark:ring-[#2e303a]"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
              const parent = (e.target as HTMLElement).parentElement;
              if (parent) {
                const fallback = parent.querySelector('.avatar-fallback');
                if (fallback) fallback.classList.remove('hidden');
              }
            }}
          />
        ) : null}

        {/* Fallback Text Avatar */}
        <div className={`avatar-fallback w-8 h-8 rounded-full bg-[var(--primary)] text-white text-xs font-bold flex items-center justify-center shrink-0 ring-2 ring-rose-200 dark:ring-rose-950 ${user?.link_foto ? 'hidden' : ''}`}>
          {getInitials(user?.name || 'User')}
        </div>

        {/* Display Name */}
        <span className="hidden md:inline-block text-sm font-semibold text-gray-700 dark:text-gray-300 pr-1">
          {user?.name || 'User Name'}
        </span>

        {/* Chevron-down */}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1f2028] rounded-xl shadow-lg border border-gray-200 dark:border-[#2e303a] py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* User Summary */}
          <div className="px-4 py-2 border-b border-gray-100 dark:border-[#2e303a]">
            <p className="text-xs text-gray-400">Logged in as</p>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">
              {user?.name || 'User Name'}
            </p>
          </div>

          {/* Profile Link */}
          <button
            onClick={() => {
              setIsOpen(false)
              alert('Opening Profile...')
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2e303a] flex items-center gap-2 cursor-pointer transition-colors"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Profile</span>
          </button>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-[#2e303a]" />

          {/* Logout Link */}
          <button
            onClick={() => {
              setIsOpen(false)
              handleLogout()
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-950/20 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <svg className="w-4 h-4 text-red-500 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>

        </div>
      )}
    </div>
  )
}
