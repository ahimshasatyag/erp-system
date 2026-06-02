import React from 'react';

interface SparePartTableProps {
    parts: any[];
    canEdit: boolean;
    addPartName: string;
    setAddPartName: (val: string) => void;
    addQtyPart: number;
    setAddQtyPart: (val: number) => void;
    addHargaEs: number;
    setAddHargaEs: (val: number) => void;
    handleAddPartVisit: () => void;
    isPending: boolean;
}

export default function SparePartTable({
    parts,
    canEdit,
    addPartName,
    setAddPartName,
    addQtyPart,
    setAddQtyPart,
    addHargaEs,
    setAddHargaEs,
    handleAddPartVisit,
    isPending
}: SparePartTableProps) {
    return (
        <div className="pt-6 text-left">
            <h4 className="text-base font-bold text-gray-800 mb-3">Actual Spare Part Detail</h4>
            <div className="border border-[#e7eaec] rounded-[4px] overflow-hidden bg-white shadow-sm">
                <table className="w-full text-xs text-gray-800 border-collapse">
                    <thead className="bg-[#f3f3f4] border-b border-[#e7eaec] text-gray-700 font-bold">
                        <tr>
                            <th className="py-2.5 px-4 text-center border-r border-[#e7eaec] w-12">No</th>
                            <th className="py-2.5 px-4 text-left border-r border-[#e7eaec]">Nama Spare Part</th>
                            <th className="py-2.5 px-4 text-center border-r border-[#e7eaec] w-24">Qty</th>
                            <th className="py-2.5 px-4 text-right border-r border-[#e7eaec] w-48">Harga</th>
                            <th className="py-2.5 px-4 text-right w-48">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e7eaec]">
                        {parts.length > 0 ? (
                            parts.map((p: any, idx: number) => (
                                <tr key={p.id || idx} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-2.5 px-4 text-center border-r border-[#e7eaec] text-gray-500 font-medium">{idx + 1}</td>
                                    <td className="py-2.5 px-4 border-r border-[#e7eaec] font-medium text-gray-900">{p.name}</td>
                                    <td className="py-2.5 px-4 text-center border-r border-[#e7eaec] text-gray-800 font-medium">{p.qty}</td>
                                    <td className="py-2.5 px-4 text-right border-r border-[#e7eaec] font-mono text-gray-700">Rp {Number(p.harga || 0).toLocaleString('id-ID')}</td>
                                    <td className="py-2.5 px-4 text-right font-mono font-semibold text-gray-900">Rp {Number(p.total || 0).toLocaleString('id-ID')}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-400 font-medium">No spare parts added yet</td>
                            </tr>
                        )}

                        {/* Inline Add Part Form */}
                        {canEdit && (
                            <tr className="bg-emerald-50/30">
                                <td className="py-2 px-4 text-center border-r border-[#e7eaec] font-bold text-emerald-600">+</td>
                                <td className="py-2 px-4 border-r border-[#e7eaec]">
                                    <input
                                        type="text"
                                        placeholder="Masukkan nama spare part..."
                                        value={addPartName}
                                        onChange={(e) => setAddPartName(e.target.value)}
                                        className="w-full bg-white text-gray-800 border border-gray-300 rounded-[3px] px-2.5 py-1 focus:outline-none focus:border-[#1ab394] font-normal"
                                    />
                                </td>
                                <td className="py-2 px-4 border-r border-[#e7eaec]">
                                    <input
                                        type="number"
                                        placeholder="Qty"
                                        value={addQtyPart || ''}
                                        onChange={(e) => setAddQtyPart(Number(e.target.value))}
                                        className="w-full bg-white text-gray-800 border border-gray-300 rounded-[3px] px-2 py-1 text-center focus:outline-none focus:border-[#1ab394] font-normal"
                                    />
                                </td>
                                <td className="py-2 px-4 border-r border-[#e7eaec] text-right">
                                    <div className="flex items-center gap-1.5 justify-end">
                                        <span className="text-gray-500 font-medium">Rp</span>
                                        <input
                                            type="number"
                                            placeholder="Harga"
                                            value={addHargaEs || ''}
                                            onChange={(e) => setAddHargaEs(Number(e.target.value))}
                                            className="w-32 bg-white text-gray-800 border border-gray-300 rounded-[3px] px-2 py-1 text-right focus:outline-none focus:border-[#1ab394] font-normal font-mono"
                                        />
                                    </div>
                                </td>
                                <td className="py-2 px-4 text-right">
                                    <button
                                        type="button"
                                        onClick={handleAddPartVisit}
                                        disabled={isPending}
                                        className="bg-[#1ab394] hover:bg-[#18a689] text-white px-4 py-1.5 rounded-[3px] text-xs font-bold transition-colors cursor-pointer border border-[#18a689]"
                                    >
                                        {isPending ? 'Adding...' : 'Add'}
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
