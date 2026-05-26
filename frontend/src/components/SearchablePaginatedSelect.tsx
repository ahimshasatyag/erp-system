import React, { useState, useEffect, useRef } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
  subLabel?: string;
}

interface SearchablePaginatedSelectProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export default function SearchablePaginatedSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select option...',
  disabled = false,
  error
}: SearchablePaginatedSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset count when search query or open status changes
  useEffect(() => {
    setVisibleCount(10);
  }, [searchQuery, isOpen]);

  // Find currently selected option to display its label
  const selectedOption = options.find(opt => String(opt.value) === String(value));

  // Filter options based on search query
  const filteredOptions = options.filter(opt => {
    const searchLower = searchQuery.toLowerCase();
    const matchesLabel = opt.label.toLowerCase().includes(searchLower);
    const matchesSubLabel = opt.subLabel ? opt.subLabel.toLowerCase().includes(searchLower) : false;
    return matchesLabel || matchesSubLabel;
  });

  const totalItems = filteredOptions.length;
  const displayedOptions = filteredOptions.slice(0, visibleCount);

  const handleSelect = (val: string | number) => {
    onChange(val);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    // Check if user has scrolled near bottom (within 15px)
    const isNearBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 15;
    
    if (isNearBottom && !isLoadingMore && visibleCount < totalItems) {
      setIsLoadingMore(true);
      // Simulate premium micro-animation loading transition
      setTimeout(() => {
        setVisibleCount(prev => Math.min(prev + 10, totalItems));
        setIsLoadingMore(false);
      }, 300);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-white dark:bg-[#161821] text-gray-800 dark:text-white border ${
          error ? 'border-rose-500' : 'border-gray-350 dark:border-gray-800'
        } rounded-lg px-3 py-1.5 text-sm font-sans focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-left`}
      >
        <span className={selectedOption ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Error Message */}
      {error && <p className="mt-1 text-xs text-rose-500 font-sans">{error}</p>}

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-white dark:bg-[#1e202b] border border-gray-200 dark:border-gray-800 shadow-2xl rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-100">
          {/* Search Box */}
          <div className="p-2.5 border-b border-gray-100 dark:border-gray-800">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#161821] text-gray-800 dark:text-white border border-gray-200 dark:border-gray-800 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                autoFocus
              />
              <span className="absolute left-3 top-2 text-gray-400 dark:text-gray-500">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>

          {/* Options List */}
          <div 
            onScroll={handleScroll}
            className="max-h-[220px] overflow-y-auto divide-y divide-gray-50 dark:divide-gray-850"
          >
            {displayedOptions.length > 0 ? (
              <>
                {displayedOptions.map(opt => {
                  const isSelected = String(opt.value) === String(value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={`w-full text-left px-4 py-2.5 text-xs flex flex-col gap-0.5 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold'
                          : 'hover:bg-gray-50 dark:hover:bg-[#232733]/30 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {opt.subLabel && (
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 line-clamp-1">{opt.subLabel}</span>
                      )}
                    </button>
                  );
                })}
                
                {/* Premium Loading Spinner for Scroll-Load */}
                {isLoadingMore && (
                  <div className="py-3 px-4 text-center text-[10px] text-gray-400 dark:text-gray-500 font-sans flex items-center justify-center gap-2 bg-gray-50/40 dark:bg-[#16171d]/20 transition-all duration-200">
                    <svg className="w-3.5 h-3.5 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memuat data lainnya...
                  </div>
                )}

                {/* All items loaded hint */}
                {!isLoadingMore && visibleCount >= totalItems && totalItems > 10 && (
                  <div className="py-2.5 px-4 text-center text-[9px] text-gray-400 dark:text-gray-500 font-sans tracking-wide uppercase bg-gray-50/10 dark:bg-transparent">
                    Semua data telah ditampilkan
                  </div>
                )}
              </>
            ) : (
              <div className="py-8 px-4 text-center text-xs text-gray-400 dark:text-gray-500">
                Tidak ada data ditemukan
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
