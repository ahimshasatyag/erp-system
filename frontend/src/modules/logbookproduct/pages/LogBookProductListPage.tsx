import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogBookProducts } from '../hooks/useLogBookProducts';
import { LogBookProductTable } from '../components/LogBookProductTable';

export default function LogBookProductListPage() {
    const { logBooks, loading, error, deleteLogBook } = useLogBookProducts();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [entries, setEntries] = useState(10);

    const handleAddNew = () => {
        navigate('/logbookproduct/create');
    };

    return (
        <div className="w-full p-4 md:p-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="flex flex-col gap-4 mb-4">
                    <div className="flex justify-start">
                        <button
                            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                            onClick={handleAddNew}
                        >
                            <i className="fa fa-plus"></i> Add New
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                            <span>Tampilkan</span>
                            <select 
                                className="border border-slate-300 rounded px-2 py-1 outline-none focus:border-blue-500 bg-white"
                                value={entries}
                                onChange={(e) => setEntries(Number(e.target.value))}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span>Data</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Cari:</span>
                            <input 
                                type="text" 
                                className="border border-slate-300 rounded px-2 py-1 outline-none focus:border-blue-500 w-full sm:w-48"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {error && <div className="mb-4 p-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">{error}</div>}

                {loading ? (
                    <div className="text-center py-8 text-slate-500">Loading...</div>
                ) : (
                    <>
                        <LogBookProductTable
                            logBooks={logBooks}
                        />
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-slate-600 mt-4 gap-4">
                            <div>Menampilkan 1 Sampai {logBooks.length} Dari {logBooks.length} data</div>
                            <div className="flex rounded border border-slate-300 overflow-hidden">
                                <button className="px-3 py-1.5 border-r border-slate-300 hover:bg-slate-50 text-slate-600">Sebelumnya</button>
                                <button className="px-3 py-1.5 bg-blue-500 text-white font-medium">1</button>
                                <button className="px-3 py-1.5 border-l border-slate-300 hover:bg-slate-50 text-slate-600">Selanjutnya</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
