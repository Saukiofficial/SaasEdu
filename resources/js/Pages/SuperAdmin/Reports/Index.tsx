import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    PieChart, Building2, Users, Target, HeadphonesIcon, 
    DownloadCloud, Calendar as CalendarIcon, TrendingUp,
    BarChart3, Activity, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

export default function ReportsIndex({ stats }: { stats: any }) {
    const [period, setPeriod] = useState('Bulan Ini');

    // Komponen visualisasi bar chart sederhana berbasis SVG
    const SimpleBarChart = () => {
        const data = [40, 70, 45, 90, 65, 85, 120, 95, 110, 80, 130, 150];
        const max = Math.max(...data);
        
        return (
            <div className="h-64 w-full flex items-end justify-between gap-2 md:gap-4 mt-6 border-b border-[#E2DDD0] pb-2">
                {data.map((val, i) => (
                    <div key={i} className="w-full flex flex-col justify-end items-center group relative">
                        <div 
                            className="w-full bg-[#0F1729] rounded-t-md hover:bg-[#B8935F] transition-colors cursor-pointer"
                            style={{ height: `${(val / max) * 100}%` }}
                        ></div>
                        <div className="absolute -top-8 bg-[#1B2742] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {val} Tenant
                        </div>
                        <span className="text-[10px] text-[#8B93A8] mt-2 block">
                            {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][i]}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <AuthenticatedLayout header="Analytics & Reports">
            <Head title="Laporan & Analitik - AkademiaOS" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-serif font-semibold text-[#0F1729] flex items-center gap-2">
                            <PieChart className="w-6 h-6 text-[#B8935F]" />
                            Laporan & Pertumbuhan SaaS
                        </h1>
                        <p className="text-sm text-[#8B93A8] mt-1">
                            Analisis matriks utama, pendaftaran tenant baru, dan konversi prospek.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select 
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="px-4 py-2.5 bg-white border border-[#E2DDD0] rounded-md text-sm font-medium text-[#0F1729] focus:outline-none focus:border-[#B8935F] shadow-sm cursor-pointer"
                        >
                            <option value="Bulan Ini">Bulan Ini</option>
                            <option value="Kuartal Ini">Kuartal Ini (Q3)</option>
                            <option value="Tahun Ini">Tahun Ini (2026)</option>
                            <option value="Semua Waktu">Semua Waktu</option>
                        </select>
                        <button className="flex items-center gap-2 bg-[#0F1729] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#1B2742] transition-colors shadow-sm">
                            <DownloadCloud className="w-4 h-4 text-[#D4AF7A]" />
                            Unduh PDF
                        </button>
                    </div>
                </div>

                {/* KPI Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Card 1: Total Tenant */}
                    <div className="bg-white p-5 rounded-2xl border border-[#E2DDD0] shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                                <ArrowUpRight className="w-3 h-3" /> +12%
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-[#0F1729]">{stats?.total_schools || 0}</h3>
                        <p className="text-xs font-semibold text-[#8B93A8] uppercase tracking-wider mt-1">Total Sekolah (Tenant)</p>
                        <p className="text-[11px] text-[#A8A296] mt-3">
                            <strong className="text-emerald-600">{stats?.active_schools || 0} Aktif</strong> · {stats?.suspended_schools || 0} Ditangguhkan
                        </p>
                    </div>

                    {/* Card 2: Total Users */}
                    <div className="bg-white p-5 rounded-2xl border border-[#E2DDD0] shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                                <Users className="w-5 h-5 text-purple-600" />
                            </div>
                            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                                <ArrowUpRight className="w-3 h-3" /> +8.4%
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-[#0F1729]">{stats?.total_users || 0}</h3>
                        <p className="text-xs font-semibold text-[#8B93A8] uppercase tracking-wider mt-1">Total Pengguna Platform</p>
                        <p className="text-[11px] text-[#A8A296] mt-3">
                            <strong className="text-[#0F1729]">{stats?.tenant_users || 0} Akun Sekolah</strong> · {stats?.saas_staff || 0} Staff SaaS
                        </p>
                    </div>

                    {/* Card 3: Leads & Prospek */}
                    <div className="bg-white p-5 rounded-2xl border border-[#E2DDD0] shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                                <Target className="w-5 h-5 text-amber-600" />
                            </div>
                            <span className="flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md">
                                <ArrowDownRight className="w-3 h-3" /> -2.1%
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-[#0F1729]">{stats?.total_leads || 0}</h3>
                        <p className="text-xs font-semibold text-[#8B93A8] uppercase tracking-wider mt-1">Total Prospek (Leads)</p>
                        <p className="text-[11px] text-[#A8A296] mt-3">
                            <strong className="text-emerald-600">{stats?.converted_leads || 0} Berhasil Konversi</strong>
                        </p>
                    </div>

                    {/* Card 4: Support Tickets */}
                    <div className="bg-white p-5 rounded-2xl border border-[#E2DDD0] shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                                <HeadphonesIcon className="w-5 h-5 text-rose-600" />
                            </div>
                            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                                Stabil
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-[#0F1729]">{stats?.open_tickets || 0}</h3>
                        <p className="text-xs font-semibold text-[#8B93A8] uppercase tracking-wider mt-1">Tiket Perlu Tindakan</p>
                        <p className="text-[11px] text-[#A8A296] mt-3">
                            <strong className="text-[#0F1729]">{stats?.resolved_tickets || 0} Tiket Selesai</strong>
                        </p>
                    </div>
                </div>

                {/* Grafik Utama & List Informasi */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Chart */}
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2DDD0] shadow-sm lg:col-span-2">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <h3 className="text-lg font-bold text-[#0F1729] flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-[#B8935F]" /> Pertumbuhan Akuisisi Sekolah (YTD)
                                </h3>
                                <p className="text-sm text-[#8B93A8]">Grafik pendaftaran tenant baru sepanjang tahun 2026.</p>
                            </div>
                        </div>
                        <SimpleBarChart />
                    </div>

                    {/* Quick Stats / Info List */}
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2DDD0] shadow-sm lg:col-span-1 flex flex-col">
                        <h3 className="text-lg font-bold text-[#0F1729] mb-1 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-[#B8935F]" /> Aktivitas Platform
                        </h3>
                        <p className="text-sm text-[#8B93A8] mb-6">Ringkasan penggunaan resource.</p>

                        <div className="flex-1 space-y-6">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-semibold text-[#0F1729]">Kapasitas Server Utama</span>
                                    <span className="font-bold text-emerald-600">62%</span>
                                </div>
                                <div className="w-full bg-[#FAF8F3] rounded-full h-2.5 border border-[#E2DDD0]">
                                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '62%' }}></div>
                                </div>
                            </div>
                            
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-semibold text-[#0F1729]">Storage Cloud Terpakai</span>
                                    <span className="font-bold text-amber-600">84%</span>
                                </div>
                                <div className="w-full bg-[#FAF8F3] rounded-full h-2.5 border border-[#E2DDD0]">
                                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '84%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-semibold text-[#0F1729]">Beban Database (Query)</span>
                                    <span className="font-bold text-blue-600">45%</span>
                                </div>
                                <div className="w-full bg-[#FAF8F3] rounded-full h-2.5 border border-[#E2DDD0]">
                                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '45%' }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-5 border-t border-[#E2DDD0]">
                            <button className="w-full py-2.5 border border-[#E2DDD0] rounded-lg text-sm font-bold text-[#0F1729] hover:border-[#B8935F] hover:text-[#B8935F] transition-colors">
                                Lihat Laporan Teknis Detail
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
