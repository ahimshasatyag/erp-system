import React from 'react';

interface CekSerialNumberSearchProps {
    onSearch: (barcode: string) => void;
    isLoading?: boolean;
}

export default function CekSerialNumberSearch({ onSearch, isLoading }: CekSerialNumberSearchProps) {
    const [inputValue, setInputValue] = React.useState('');

    const handleSearch = () => {
        if (inputValue.trim()) {
            onSearch(inputValue.trim());
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="bg-white dark:bg-[#1e202b] rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center max-w-2xl">
                <div className="relative flex-1 w-full">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Input Serial Number..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#161821] text-slate-800 dark:text-gray-100 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                        autoComplete="off"
                    />
                    <div className="absolute left-3 top-2.5 text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
                <button
                    onClick={handleSearch}
                    disabled={isLoading || !inputValue.trim()}
                    className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg shadow-sm transition-colors text-sm flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Searching...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Search
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
