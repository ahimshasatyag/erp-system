import React from 'react';

interface CsrFiltersProps {
    filters: {
        search: string;
        start_date: string;
        end_date: string;
        status: string;
        all: boolean;
    };
    onChange: (name: string, value: string | boolean) => void;
}

export default function CsrFilters({ filters, onChange }: CsrFiltersProps) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-700 font-semibold">
            <div className="flex items-center gap-2">
                <label htmlFor="start_date">Dari tanggal:</label>
                <input
                    type="date"
                    id="start_date"
                    className="border border-gray-300 rounded px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500 outline-none font-normal"
                    value={filters.start_date}
                    onChange={(e) => onChange('start_date', e.target.value)}
                    disabled={filters.all}
                />
            </div>

            <div className="flex items-center gap-2">
                <label htmlFor="end_date">Sampai tanggal:</label>
                <input
                    type="date"
                    id="end_date"
                    className="border border-gray-300 rounded px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500 outline-none font-normal"
                    value={filters.end_date}
                    onChange={(e) => onChange('end_date', e.target.value)}
                    disabled={filters.all}
                />
            </div>

            <div className="flex items-center gap-2">
                <label htmlFor="status">Status:</label>
                <select
                    id="status"
                    className="border border-gray-300 rounded px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500 outline-none font-normal"
                    value={filters.status}
                    onChange={(e) => onChange('status', e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="DRAFT">Draft CSR</option>
                    <option value="OUTSTANDING">Outstanding</option>
                    <option value="CANCEL">CANCELED</option>
                    <option value="DONE">DONE</option>
                </select>
            </div>

            <div className="flex items-center gap-2">
                <label htmlFor="all">All:</label>
                <input
                    type="checkbox"
                    id="all"
                    className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                    checked={filters.all}
                    onChange={(e) => onChange('all', e.target.checked)}
                />
            </div>
            
            <button 
                type="button" 
                className="bg-[#569ff7] hover:bg-[#458ee6] text-white px-5 py-1.5 rounded text-sm font-semibold transition-colors ml-1"
                onClick={() => onChange('triggerFilter', true)}
            >
                Filter
            </button>
        </div>
    );
}
