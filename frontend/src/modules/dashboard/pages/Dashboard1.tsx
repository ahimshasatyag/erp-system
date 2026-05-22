import { useState } from 'react'

// Define data interfaces
interface Technician {
    no: number
    date: string
    name: string
}

interface LktSchedule {
    no: number
    lktCode: string
    cstCode: string
    customer: string
    location: string
    product: string
    damage: string
    request: string
}

interface ProductRank {
    no: number
    name: string
    count: number
}

export default function Dashboard1() {
    // State for search filters
    const [selectedMonth, setSelectedMonth] = useState('05|May')
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
    const [periode, setPeriode] = useState('05-2026')

    // Modal control states
    const [activeModal, setActiveModal] = useState<string | null>(null)

    // Pagination states
    const [pricePage, setPricePage] = useState(1)
    const [quotationPage, setQuotationPage] = useState(1)
    const itemsPerPage = 5

    // --- MOCK DATA MATCHING 1.PHP SCHEMAS ---
    const techniciansPP: Technician[] = [
        { no: 1, date: '22-May-2026', name: 'Agus Setiawan' },
        { no: 2, date: '22-May-2026', name: 'Dedi Kurniawan' },
        { no: 3, date: '22-May-2026', name: 'Fajar Nugroho' },
    ]

    const techniciansPL: Technician[] = [
        { no: 1, date: '22-May-2026', name: 'Bambang Tri' },
        { no: 2, date: '22-May-2026', name: 'Hendra Wijaya' },
    ]

    const workloadPP = [
        { name: 'Agus Setiawan', percentage: 85 },
        { name: 'Dedi Kurniawan', percentage: 60 },
        { name: 'Fajar Nugroho', percentage: 40 },
        { name: 'Hendra Saputra', percentage: 95 },
    ]

    const workloadPL = [
        { name: 'Bambang Tri', percentage: 70 },
        { name: 'Hendra Wijaya', percentage: 50 },
        { name: 'Rian Hidayat', percentage: 30 },
    ]

    const todayLktSchedules: LktSchedule[] = [
        {
            no: 1,
            lktCode: 'LKT-4091',
            cstCode: 'CST-2940',
            customer: 'PT. Indofood CBP Sukses Makmur',
            location: 'Cikarang, Bekasi',
            product: 'Flexo Folder Gluer (FFG 8.20)',
            damage: 'Sensors on folding guide misaligned, causing folder jams.',
            request: 'Urgent troubleshooting needed for production line.'
        },
        {
            no: 2,
            lktCode: 'LKT-4092',
            cstCode: 'CST-2941',
            customer: 'PT. Mayora Indah Tbk',
            location: 'Tangerang',
            product: 'High Speed Shrink Wrapper',
            damage: 'Heater strip failed to reach sealing temperature.',
            request: 'Check heater elements and replace temperature controller.'
        },
        {
            no: 3,
            lktCode: 'LKT-4093',
            cstCode: 'CST-2942',
            customer: 'PT. Kalbe Farma Tbk',
            location: 'Cikarang',
            product: 'Blister Packaging Machine',
            damage: 'Forming film feeder motor slippage reported.',
            request: 'Calibrate tension controls and inspect servo motor gears.'
        }
    ]

    const kpiTechnicians = [
        { name: 'Agus Setiawan', score: 92 },
        { name: 'Dedi Kurniawan', score: 87 },
        { name: 'Fajar Nugroho', score: 79 },
        { name: 'Bambang Tri', score: 94 },
        { name: 'Hendra Wijaya', score: 85 }
    ]

    const topPriceCheckProducts: ProductRank[] = [
        { no: 1, name: 'EM-FLEX-01 (Flexo Gluer Single Shaft)', count: 48 },
        { no: 2, name: 'EM-SHRINK-H (High Temp Wrapper)', count: 35 },
        { no: 3, name: 'EM-BLIST-P (Pneumatic Blister Packer)', count: 29 },
        { no: 4, name: 'EM-CART-120 (Cartoning Automated Line)', count: 24 },
        { no: 5, name: 'EM-FILL-FLOW (Rotary Bottle Filler)', count: 22 },
        { no: 6, name: 'EM-STRAP-M (Manual Hand Strapper)', count: 18 },
        { no: 7, name: 'EM-CONV-HD (Heavy Duty Belt Conveyor)', count: 15 },
        { no: 8, name: 'EM-LABEL-S (Double Sided Labeler)', count: 12 }
    ]

    const topQuotationProducts: ProductRank[] = [
        { no: 1, name: 'EM-FLEX-01 (Flexo Gluer Single Shaft)', count: 15 },
        { no: 2, name: 'EM-CART-120 (Cartoning Automated Line)', count: 12 },
        { no: 3, name: 'EM-SHRINK-H (High Temp Wrapper)', count: 10 },
        { no: 4, name: 'EM-BLIST-P (Pneumatic Blister Packer)', count: 9 },
        { no: 5, name: 'EM-LABEL-S (Double Sided Labeler)', count: 7 },
        { no: 6, name: 'EM-CONV-HD (Heavy Duty Belt Conveyor)', count: 6 },
        { no: 7, name: 'EM-FILL-FLOW (Rotary Bottle Filler)', count: 5 }
    ]

    // Statistics ratios
    const stats = {
        total_quotations: 36,
        quotations: 18,
        total_so: 12,
        total_cancelled: 6,
        success_rate: 33.3
    }

    // Pagination filters
    const paginatedPrice = topPriceCheckProducts.slice(
        (pricePage - 1) * itemsPerPage,
        pricePage * itemsPerPage
    )
    const paginatedQuotation = topQuotationProducts.slice(
        (quotationPage - 1) * itemsPerPage,
        quotationPage * itemsPerPage
    )

    const totalPricePages = Math.ceil(topPriceCheckProducts.length / itemsPerPage)
    const totalQuotationPages = Math.ceil(topQuotationProducts.length / itemsPerPage)

    return (
        <div className="space-y-6">

            {/* 1. Page Title */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-200 m-0">
                        Dashboard
                    </h1>
                </div>

                {/* Breadcrumb representation */}
                <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 bg-white dark:bg-[#1f2028] px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#2e303a]">
                    <span className="text-[var(--primary)] dark:text-rose-400">Dashboard</span>
                </div>
            </div>

            {/* 2. Top Stats cards (Request, Pending, In Progress) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* Request Tile */}
                <div className="bg-white dark:bg-[#1f2028] rounded-xl p-5 border border-gray-200 dark:border-[#2e303a] shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider dark:text-gray-500">Request</p>
                            <h3 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 mt-2">
                                Total <span className="text-[var(--primary)] dark:text-rose-500">12</span>
                            </h3>
                        </div>
                        <div className="p-3 bg-red-50 dark:bg-rose-950/20 text-[var(--primary)] dark:text-rose-400 rounded-lg group-hover:scale-110 transition-transform">
                            {/* Layers SVG Icon */}
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#2e303a] flex items-center justify-between text-xs">
                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded font-semibold">New CSR Status</span>
                        <button
                            onClick={() => setActiveModal('request')}
                            className="text-[var(--primary)] dark:text-rose-400 font-bold hover:underline cursor-pointer bg-transparent border-none outline-none"
                        >
                            View Details &rarr;
                        </button>
                    </div>
                </div>

                {/* Pending Tile */}
                <div className="bg-white dark:bg-[#1f2028] rounded-xl p-5 border border-gray-200 dark:border-[#2e303a] shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider dark:text-gray-500">Pending</p>
                            <h3 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 mt-2">
                                Total <span className="text-red-600 dark:text-rose-400">5</span>
                            </h3>
                        </div>
                        <div className="p-3 bg-orange-50 dark:bg-amber-950/20 text-orange-600 dark:text-amber-400 rounded-lg group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#2e303a] flex items-center justify-between text-xs">
                        <span className="bg-red-50 dark:bg-rose-950/30 text-red-600 dark:text-rose-400 px-2 py-0.5 rounded font-semibold">CST Unapproved</span>
                        <button
                            onClick={() => setActiveModal('pending')}
                            className="text-[var(--primary)] dark:text-rose-400 font-bold hover:underline cursor-pointer bg-transparent border-none outline-none"
                        >
                            View Details &rarr;
                        </button>
                    </div>
                </div>

                {/* In Progress Tile */}
                <div className="bg-white dark:bg-[#1f2028] rounded-xl p-5 border border-gray-200 dark:border-[#2e303a] shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider dark:text-gray-500">In Progress</p>
                            <h3 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 mt-2">
                                Total <span className="text-amber-500 dark:text-yellow-400">8</span>
                            </h3>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-lg group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#2e303a] flex items-center justify-between text-xs">
                        <span className="bg-amber-50 dark:bg-yellow-950/30 text-amber-600 dark:text-yellow-400 px-2 py-0.5 rounded font-semibold">LKT Processing</span>
                        <button
                            onClick={() => setActiveModal('progress')}
                            className="text-[var(--primary)] dark:text-rose-400 font-bold hover:underline cursor-pointer bg-transparent border-none outline-none"
                        >
                            View Details &rarr;
                        </button>
                    </div>
                </div>

            </div>

            {/* 3. Availability Tables (Print Pack & Plastic) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Unassigned Print Pack Technicians */}
                <div className="bg-white dark:bg-[#1f2028] rounded-xl border border-gray-200 dark:border-[#2e303a] shadow-sm overflow-hidden">
                    <div className="bg-gray-50 dark:bg-[#252630] px-5 py-4 border-b border-gray-200 dark:border-[#2e303a]">
                        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 m-0">
                            Teknisi Print Pack Tanpa Jadwal Kerja (No LKT)
                        </h4>
                    </div>
                    <div className="p-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-[#1f2028] text-gray-500 font-bold border-b border-gray-200 dark:border-[#2e303a]">
                                        <th className="py-2.5 px-3 w-12 text-center">No</th>
                                        <th className="py-2.5 px-3">Date</th>
                                        <th className="py-2.5 px-3">Nama Teknisi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-[#2e303a] text-gray-700 dark:text-gray-300">
                                    {techniciansPP.map((tech) => (
                                        <tr key={tech.no} className="hover:bg-gray-50/50 dark:hover:bg-[#2e303a]/25">
                                            <td className="py-2.5 px-3 text-center font-bold text-gray-400">{tech.no}</td>
                                            <td className="py-2.5 px-3">{tech.date}</td>
                                            <td className="py-2.5 px-3 font-semibold text-gray-800 dark:text-gray-200">{tech.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Unassigned Plastic Technicians */}
                <div className="bg-white dark:bg-[#1f2028] rounded-xl border border-gray-200 dark:border-[#2e303a] shadow-sm overflow-hidden">
                    <div className="bg-gray-50 dark:bg-[#252630] px-5 py-4 border-b border-gray-200 dark:border-[#2e303a]">
                        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 m-0">
                            Teknisi Plastic Tanpa Jadwal Kerja (No LKT)
                        </h4>
                    </div>
                    <div className="p-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-[#1f2028] text-gray-500 font-bold border-b border-gray-200 dark:border-[#2e303a]">
                                        <th className="py-2.5 px-3 w-12 text-center">No</th>
                                        <th className="py-2.5 px-3">Date</th>
                                        <th className="py-2.5 px-3">Nama Teknisi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-[#2e303a] text-gray-700 dark:text-gray-300">
                                    {techniciansPL.map((tech) => (
                                        <tr key={tech.no} className="hover:bg-gray-50/50 dark:hover:bg-[#2e303a]/25">
                                            <td className="py-2.5 px-3 text-center font-bold text-gray-400">{tech.no}</td>
                                            <td className="py-2.5 px-3">{tech.date}</td>
                                            <td className="py-2.5 px-3 font-semibold text-gray-800 dark:text-gray-200">{tech.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>

            {/* 4. Workloads Charts (Print Pack & Plastic) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Workload Print Pack */}
                <div className="bg-white dark:bg-[#1f2028] rounded-xl border border-gray-200 dark:border-[#2e303a] shadow-sm p-5">
                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-100 dark:border-[#2e303a] pb-2">
                        Workload Teknisi Print Pack
                    </h4>
                    <div className="space-y-4">
                        {workloadPP.map((tech, index) => (
                            <div key={index} className="space-y-1.5">
                                <div className="flex justify-between text-xs font-semibold">
                                    <span className="text-gray-700 dark:text-gray-300">{tech.name}</span>
                                    <span className="text-gray-500">{tech.percentage}%</span>
                                </div>
                                {/* Horizontal Progress bar */}
                                <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[var(--primary)] dark:bg-rose-500 rounded-full transition-all duration-500"
                                        style={{ width: `${tech.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Workload Plastic */}
                <div className="bg-white dark:bg-[#1f2028] rounded-xl border border-gray-200 dark:border-[#2e303a] shadow-sm p-5">
                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-100 dark:border-[#2e303a] pb-2">
                        Workload Teknisi Plastic
                    </h4>
                    <div className="space-y-4">
                        {workloadPL.map((tech, index) => (
                            <div key={index} className="space-y-1.5">
                                <div className="flex justify-between text-xs font-semibold">
                                    <span className="text-gray-700 dark:text-gray-300">{tech.name}</span>
                                    <span className="text-gray-500">{tech.percentage}%</span>
                                </div>
                                <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-teal-500 dark:bg-teal-400 rounded-full transition-all duration-500"
                                        style={{ width: `${tech.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* 5. Jadwal LKT Hari Ini (Full Width Table) */}
            <div className="bg-white dark:bg-[#1f2028] rounded-xl border border-gray-200 dark:border-[#2e303a] shadow-sm overflow-hidden">
                <div className="bg-gray-50 dark:bg-[#252630] px-5 py-4 border-b border-gray-200 dark:border-[#2e303a] flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 m-0">
                        Jadwal LKT Hari Ini : <span className="text-[var(--primary)] dark:text-rose-400">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </h4>
                </div>
                <div className="p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-[#1f2028] text-gray-500 font-bold border-b border-gray-200 dark:border-[#2e303a]">
                                    <th className="py-3 px-3 w-12 text-center">No</th>
                                    <th className="py-3 px-3 w-28 text-center">LKT Code</th>
                                    <th className="py-3 px-3 w-28 text-center">CST Code</th>
                                    <th className="py-3 px-3">Customers</th>
                                    <th className="py-3 px-3">Lokasi</th>
                                    <th className="py-3 px-3">Product</th>
                                    <th className="py-3 px-3">Kerusakan</th>
                                    <th className="py-3 px-3">Request</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-[#2e303a] text-gray-700 dark:text-gray-300">
                                {todayLktSchedules.map((sched) => (
                                    <tr key={sched.no} className="hover:bg-gray-50/50 dark:hover:bg-[#2e303a]/25 align-top">
                                        <td className="py-3 px-3 text-center font-bold text-gray-400">{sched.no}</td>
                                        <td className="py-3 px-3 text-center">
                                            <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded font-mono font-bold text-[10.5px]">
                                                {sched.lktCode}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            <span className="bg-amber-50 dark:bg-yellow-950 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded font-mono font-bold text-[10.5px]">
                                                {sched.cstCode}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200">{sched.customer}</td>
                                        <td className="py-3 px-3">{sched.location}</td>
                                        <td className="py-3 px-3 font-medium text-gray-700 dark:text-gray-300">{sched.product}</td>
                                        <td className="py-3 px-3 max-w-[200px] truncate" title={sched.damage}>{sched.damage}</td>
                                        <td className="py-3 px-3 max-w-[200px] truncate text-gray-500" title={sched.request}>{sched.request}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 6. KPI Teknisi */}
            <div className="bg-white dark:bg-[#1f2028] rounded-xl border border-gray-200 dark:border-[#2e303a] shadow-sm p-5">
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-100 dark:border-[#2e303a] pb-2">
                    KPI Teknisi Performance
                </h4>

                {/* KPI Select parameters */}
                <div className="flex flex-wrap items-center gap-4 bg-gray-50 dark:bg-[#252630] p-4 rounded-xl mb-6">
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-gray-500">Month:</label>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="bg-white dark:bg-[#1f2028] border border-gray-200 dark:border-[#2e303a] text-xs font-semibold rounded-lg px-2.5 py-1 text-gray-700 dark:text-gray-200 outline-none"
                        >
                            <option value="01|January">January</option>
                            <option value="02|February">February</option>
                            <option value="03|March">March</option>
                            <option value="04|April">April</option>
                            <option value="05|May">May</option>
                            <option value="06|June">June</option>
                            <option value="07|July">July</option>
                            <option value="08|August">August</option>
                            <option value="09|September">September</option>
                            <option value="10|October">October</option>
                            <option value="11|November">November</option>
                            <option value="12|December">December</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-gray-500">Year:</label>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="bg-white dark:bg-[#1f2028] border border-gray-200 dark:border-[#2e303a] text-xs font-semibold rounded-lg px-2.5 py-1 text-gray-700 dark:text-gray-200 outline-none"
                        >
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                        </select>
                    </div>

                    <button
                        onClick={() => alert(`Searching KPI statistics for ${selectedMonth.split('|')[1]} ${selectedYear}...`)}
                        className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-bold text-xs py-1 px-4 rounded-lg cursor-pointer transition-colors shadow-sm ml-auto border-none"
                    >
                        Search KPI
                    </button>
                </div>

                {/* KPI Charts */}
                <div className="space-y-4">
                    <div className="text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg inline-block">
                        KPI Teknisi Periode : <span className="text-[var(--primary)] dark:text-rose-400 font-extrabold">{selectedMonth.split('|')[1]}, {selectedYear}</span>
                    </div>

                    <div className="space-y-3.5 mt-3">
                        {kpiTechnicians.map((tech, index) => (
                            <div key={index} className="flex items-center gap-4 text-xs">
                                <span className="w-28 font-semibold text-gray-700 dark:text-gray-300 truncate">{tech.name}</span>
                                <div className="flex-1 h-5 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
                                    <div
                                        className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-lg transition-all duration-500"
                                        style={{ width: `${tech.score}%` }}
                                    />
                                    <span className="absolute inset-y-0 right-3 flex items-center font-bold text-[10px] text-gray-600 dark:text-gray-200">
                                        {tech.score}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* 7. Product rankings & SO Statistics */}
            <div className="bg-white dark:bg-[#1f2028] rounded-xl border border-gray-200 dark:border-[#2e303a] shadow-sm p-5">

                {/* Statistics Filter Form */}
                <div className="flex flex-wrap items-center gap-4 bg-gray-50 dark:bg-[#252630] p-4 rounded-xl mb-6">
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-gray-500">Filter Periode:</label>
                        <input
                            type="text"
                            value={periode}
                            onChange={(e) => setPeriode(e.target.value)}
                            className="bg-white dark:bg-[#1f2028] border border-gray-200 dark:border-[#2e303a] text-xs font-semibold rounded-lg px-2.5 py-1 text-gray-700 dark:text-gray-200 outline-none w-28 text-center"
                            placeholder="MM-YYYY"
                        />
                    </div>
                    <button
                        onClick={() => alert(`Filtering sales rankings and quotation charts for ${periode}...`)}
                        className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-bold text-xs py-1 px-4 rounded-lg cursor-pointer transition-colors border-none"
                    >
                        Search
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Top 20 Price Check Products */}
                    <div className="space-y-4">
                        <h5 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider dark:text-gray-500 border-b border-gray-100 dark:border-[#2e303a] pb-2">
                            Top Price Check Products
                        </h5>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-[11.5px]">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-[#1f2028] text-gray-500 font-bold border-b border-gray-200 dark:border-[#2e303a]">
                                        <th className="py-2 px-2 text-center w-8">No</th>
                                        <th className="py-2 px-2">Product Name</th>
                                        <th className="py-2 px-2 text-center w-16">Checks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-[#2e303a] text-gray-700 dark:text-gray-300">
                                    {paginatedPrice.map((prod, index) => (
                                        <tr key={index} className="hover:bg-gray-50/50 dark:hover:bg-[#2e303a]/25">
                                            <td className="py-2 px-2 text-center font-bold text-gray-400">
                                                {(pricePage - 1) * itemsPerPage + index + 1}
                                            </td>
                                            <td className="py-2 px-2 font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[150px]" title={prod.name}>
                                                {prod.name}
                                            </td>
                                            <td className="py-2 px-2 text-center font-bold text-[var(--primary)] dark:text-rose-400">{prod.count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-between items-center text-[10px] mt-2 pt-2 border-t border-gray-100 dark:border-[#2e303a]">
                            <button
                                disabled={pricePage === 1}
                                onClick={() => setPricePage(pricePage - 1)}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded disabled:opacity-45 cursor-pointer border-none font-semibold text-gray-700 dark:text-gray-300"
                            >
                                &larr; Prev
                            </button>
                            <span className="text-gray-500">
                                Page <strong>{pricePage}</strong> of {totalPricePages}
                            </span>
                            <button
                                disabled={pricePage >= totalPricePages}
                                onClick={() => setPricePage(pricePage + 1)}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded disabled:opacity-45 cursor-pointer border-none font-semibold text-gray-700 dark:text-gray-300"
                            >
                                Next &rarr;
                            </button>
                        </div>
                    </div>

                    {/* Top 20 Products by Quotations */}
                    <div className="space-y-4">
                        <h5 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider dark:text-gray-500 border-b border-gray-100 dark:border-[#2e303a] pb-2">
                            Top Products by Quotations
                        </h5>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-[11.5px]">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-[#1f2028] text-gray-500 font-bold border-b border-gray-200 dark:border-[#2e303a]">
                                        <th className="py-2 px-2 text-center w-8">No</th>
                                        <th className="py-2 px-2">Product Name</th>
                                        <th className="py-2 px-2 text-center w-16">Quotes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-[#2e303a] text-gray-700 dark:text-gray-300">
                                    {paginatedQuotation.map((prod, index) => (
                                        <tr key={index} className="hover:bg-gray-50/50 dark:hover:bg-[#2e303a]/25">
                                            <td className="py-2 px-2 text-center font-bold text-gray-400">
                                                {(quotationPage - 1) * itemsPerPage + index + 1}
                                            </td>
                                            <td className="py-2 px-2 font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[150px]" title={prod.name}>
                                                {prod.name}
                                            </td>
                                            <td className="py-2 px-2 text-center font-bold text-teal-600 dark:text-teal-400">{prod.count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-between items-center text-[10px] mt-2 pt-2 border-t border-gray-100 dark:border-[#2e303a]">
                            <button
                                disabled={quotationPage === 1}
                                onClick={() => setQuotationPage(quotationPage - 1)}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded disabled:opacity-45 cursor-pointer border-none font-semibold text-gray-700 dark:text-gray-300"
                            >
                                &larr; Prev
                            </button>
                            <span className="text-gray-500">
                                Page <strong>{quotationPage}</strong> of {totalQuotationPages}
                            </span>
                            <button
                                disabled={quotationPage >= totalQuotationPages}
                                onClick={() => setQuotationPage(quotationPage + 1)}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded disabled:opacity-45 cursor-pointer border-none font-semibold text-gray-700 dark:text-gray-300"
                            >
                                Next &rarr;
                            </button>
                        </div>
                    </div>

                    {/* Quotation and SO Statistics Chart */}
                    <div className="space-y-4 flex flex-col justify-between">
                        <div>
                            <h5 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider dark:text-gray-500 border-b border-gray-100 dark:border-[#2e303a] pb-2 text-center">
                                Quotation and SO Statistics
                            </h5>

                            {/* Premium Custom SVG Donut Chart */}
                            <div className="flex items-center justify-center py-4">
                                <svg className="w-36 h-36" viewBox="0 0 36 36">
                                    {/* Outer circle base */}
                                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3" />

                                    {/* Segment 1: Quotations (50%) -> Blue */}
                                    <circle
                                        cx="18" cy="18" r="15.915"
                                        fill="none"
                                        stroke="#3DB9DC"
                                        strokeWidth="3.5"
                                        strokeDasharray="50 50"
                                        strokeDashoffset="25"
                                    />

                                    {/* Segment 2: Sales Orders (33.3%) -> Teal */}
                                    <circle
                                        cx="18" cy="18" r="15.915"
                                        fill="none"
                                        stroke="#1BB99A"
                                        strokeWidth="3.5"
                                        strokeDasharray="33.3 66.7"
                                        strokeDashoffset="-25"
                                    />

                                    {/* Segment 3: Cancelled (16.7%) -> Red */}
                                    <circle
                                        cx="18" cy="18" r="15.915"
                                        fill="none"
                                        stroke="#FF5D48"
                                        strokeWidth="3.5"
                                        strokeDasharray="16.7 83.3"
                                        strokeDashoffset="-58.3"
                                    />

                                    {/* Center percentage label */}
                                    <g className="translate-y-[2px]">
                                        <text x="18" y="17" className="text-[4px] font-extrabold text-gray-800" textAnchor="middle">
                                            {stats.success_rate}%
                                        </text>
                                        <text x="18" y="21" className="text-[2.2px] text-gray-400 uppercase font-bold" textAnchor="middle">
                                            Success Rate
                                        </text>
                                    </g>
                                </svg>
                            </div>

                            {/* Legends */}
                            <div className="flex justify-center gap-4 text-[10px] font-semibold mt-1">
                                <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                    <span className="w-2.5 h-2.5 bg-[#3DB9DC] rounded-full shrink-0" />
                                    Quotes ({stats.quotations})
                                </span>
                                <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                    <span className="w-2.5 h-2.5 bg-[#1BB99A] rounded-full shrink-0" />
                                    SO ({stats.total_so})
                                </span>
                                <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                    <span className="w-2.5 h-2.5 bg-[#FF5D48] rounded-full shrink-0" />
                                    Cancel ({stats.total_cancelled})
                                </span>
                            </div>
                        </div>

                        {/* Total cards */}
                        <div className="mt-4 space-y-2">
                            <div className="bg-blue-500 text-white rounded-xl p-3 flex justify-between items-center text-xs font-bold shadow-sm">
                                <span>Total Quotations</span>
                                <span className="bg-white/20 px-2.5 py-0.5 rounded-full">{stats.total_quotations}</span>
                            </div>
                            <div className="bg-emerald-500 text-white rounded-xl p-3 flex justify-between items-center text-xs font-bold shadow-sm">
                                <span>Success SO Rate</span>
                                <span>{stats.success_rate}%</span>
                            </div>
                        </div>

                    </div>

                </div>

            </div>

            {/* --- MODALS OVERLAY FROM TILEBOX CLICK ACTIONS --- */}
            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    {/* Backdrop overlay */}
                    <div
                        onClick={() => setActiveModal(null)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Modal Container */}
                    <div className="bg-white dark:bg-[#1f2028] rounded-xl border border-gray-200 dark:border-[#2e303a] shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col z-51 animate-in zoom-in-95 duration-200">

                        {/* Header */}
                        <div className="px-5 py-4 bg-gray-50 dark:bg-[#252630] border-b border-gray-200 dark:border-[#2e303a] flex items-center justify-between">
                            <h5 className="font-bold text-gray-800 dark:text-gray-200 text-sm m-0">
                                {activeModal === 'request' && 'Status CSR Masih Baru (Request)'}
                                {activeModal === 'pending' && 'CST Belum Di Proses (Pending)'}
                                {activeModal === 'progress' && 'LKT Sedang Di Proses (In Progress)'}
                            </h5>
                            <button
                                onClick={() => setActiveModal(null)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-transparent border-none text-lg leading-none cursor-pointer outline-none font-bold"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Body content */}
                        <div className="p-5 flex-grow overflow-y-auto text-xs space-y-4">

                            <div className="bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 p-3 rounded-lg leading-relaxed">
                                Menampilkan data lapangan aktual dari modul penugasan teknisi lapangan PT. Eka Maju Mesinindo. Data ini dievaluasi secara realtime oleh Customer Service Representative (CSR).
                            </div>

                            {/* Data list in modal */}
                            {activeModal === 'request' && (
                                <div className="space-y-3">
                                    <div className="border border-gray-100 dark:border-[#2e303a] rounded-lg p-3">
                                        <p className="font-bold text-gray-800 dark:text-gray-200">CSR-2038 - Trouble on Wrapping Seal</p>
                                        <p className="text-gray-500 mt-1">Customer: PT. Ultra Jaya Milk Industry | Lokasi: Bandung</p>
                                        <span className="inline-block bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded text-[10px] font-bold mt-2">New CSR Request</span>
                                    </div>
                                    <div className="border border-gray-100 dark:border-[#2e303a] rounded-lg p-3">
                                        <p className="font-bold text-gray-800 dark:text-gray-200">CSR-2039 - Sensor Alignment Error</p>
                                        <p className="text-gray-500 mt-1">Customer: PT. Indofood CBP | Lokasi: Cikarang</p>
                                        <span className="inline-block bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded text-[10px] font-bold mt-2">New CSR Request</span>
                                    </div>
                                </div>
                            )}

                            {activeModal === 'pending' && (
                                <div className="space-y-3">
                                    <div className="border border-gray-100 dark:border-[#2e303a] rounded-lg p-3">
                                        <p className="font-bold text-gray-800 dark:text-gray-200">CST-2940 - Flexo Gluer Feeder Repair</p>
                                        <p className="text-gray-500 mt-1">Customer: PT. Mayora Indah Tbk | Lokasi: Tangerang</p>
                                        <span className="inline-block bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold mt-2">Awaiting Manager Approval</span>
                                    </div>
                                </div>
                            )}

                            {activeModal === 'progress' && (
                                <div className="space-y-3">
                                    <div className="border border-gray-100 dark:border-[#2e303a] rounded-lg p-3">
                                        <p className="font-bold text-gray-800 dark:text-gray-200">LKT-4091 - Calibration on Blister Packer</p>
                                        <p className="text-gray-500 mt-1">Customer: PT. Kalbe Farma Tbk | Lokasi: Cikarang</p>
                                        <span className="inline-block bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold mt-2">Technician on Site</span>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Footer */}
                        <div className="px-5 py-3.5 bg-gray-50 dark:bg-[#252630] border-t border-gray-200 dark:border-[#2e303a] flex justify-end">
                            <button
                                onClick={() => setActiveModal(null)}
                                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs py-1.5 px-4 rounded-lg cursor-pointer border-none transition-colors"
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    )
}
