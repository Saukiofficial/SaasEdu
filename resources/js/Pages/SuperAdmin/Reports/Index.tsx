import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { PieChart, TrendingUp, Users, Building, Download, BarChart2 } from 'lucide-react';

export default function ReportIndex({ stats, packageDistribution, monthlyGrowth }: any) {
    
    // Helper untuk memformat Rupiah
    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
    };

    // Mencari nilai max klien dari data untuk mengatur persentase tinggi bar chart
    const maxClients = Math.max(...monthlyGrowth.map((data: any) => data.clients));

    return (
        <AuthenticatedLayout header="Laporan & Analitik (Global)">
            <Head title="SaaS - Laporan & Analitik" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Analitik SaaS Anda</h2>
                    <p className="text-sm text-slate-500 mt-1">Pantau performa, adopsi pengguna, dan pertumbuhan pendapatan platform.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-xl">
                    <Download className="w-4 h-4 mr-2" /> Export Laporan (PDF)
                </Button>
            </div>

            {/* Top Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm flex flex-col dark:bg-slate-950 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                            <Building className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-slate-500">Total Klien (Tenant)</h3>
                    </div>
                    <div className="flex items-end justify-between">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total_schools}</h2>
                        <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                            <TrendingUp className="w-3 h-3 mr-1" /> +12%
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">{stats.active_schools} tenant aktif berlangganan</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm flex flex-col dark:bg-slate-950 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                            <Users className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-slate-500">Total Pengguna</h3>
                    </div>
                    <div className="flex items-end justify-between">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total_users.toLocaleString('id-ID')}</h2>
                        <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                            <TrendingUp className="w-3 h-3 mr-1" /> +24%
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Tersebar di seluruh tenant</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm flex flex-col dark:bg-slate-950 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                            <PieChart className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-slate-500">Estimasi ARR (Tahunan)</h3>
                    </div>
                    <div className="flex items-end justify-between">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Rp 2.4M</h2>
                        <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                            <TrendingUp className="w-3 h-3 mr-1" /> +15%
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Berdasarkan langganan aktif saat ini</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Bar Chart Pertumbuhan Klien */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 lg:col-span-2 dark:bg-slate-950 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                                <BarChart2 className="w-5 h-5 text-blue-600" /> Grafik Pertumbuhan Klien (YTD)
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">Akumulasi pendaftaran tenant baru setiap bulannya.</p>
                        </div>
                    </div>
                    
                    {/* Visualisasi Bar Chart Menggunakan Tailwind */}
                    <div className="h-64 flex items-end gap-2 md:gap-4 relative pt-10">
                        {/* Garis Horizontal Latar Belakang */}
                        <div className="absolute inset-0 flex flex-col justify-between pt-10 pb-6 pointer-events-none">
                            {[4, 3, 2, 1, 0].map(line => (
                                <div key={line} className="border-b border-slate-100 w-full h-0 flex items-center dark:border-slate-800">
                                    <span className="text-[10px] text-slate-400 bg-white dark:bg-slate-950 pr-2 absolute -left-1">
                                        {Math.round((maxClients / 4) * line)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Bar Data */}
                        {monthlyGrowth.map((data: any, i: number) => {
                            const barHeight = `${(data.clients / maxClients) * 100}%`;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 z-10 group relative">
                                    {/* Tooltip pada saat hover */}
                                    <div className="absolute -top-10 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                        {data.clients} Klien ({formatRupiah(data.revenue)})
                                    </div>

                                    {/* Bar Utama */}
                                    <div className="w-full max-w-[60px] bg-blue-100 dark:bg-blue-900/30 rounded-t-md relative flex items-end justify-center h-full">
                                        <div 
                                            className="w-full bg-blue-600 hover:bg-blue-500 transition-colors rounded-t-md relative overflow-hidden" 
                                            style={{ height: barHeight }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                        </div>
                                    </div>
                                    <span className="text-xs font-semibold text-slate-500 mt-2">{data.month}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Pie Chart Distribusi Paket (Simulasi List) */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 dark:bg-slate-950 dark:border-slate-800">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-emerald-600" /> Distribusi Paket Aktif
                    </h3>
                    
                    <div className="space-y-5">
                        {packageDistribution.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-8">Belum ada data paket yang aktif.</p>
                        ) : (
                            packageDistribution.map((pkg: any, idx: number) => {
                                // Tentukan warna berdasarkan urutan/nama paket
                                const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500'];
                                const colorClass = colors[idx % colors.length];
                                
                                // Hitung persentase statis (Simulasi: total aktif asumsi)
                                const percentage = Math.round((pkg.total / stats.active_schools) * 100) || 0;

                                return (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between items-end text-sm">
                                            <span className="font-semibold text-slate-700 dark:text-slate-200">{pkg.plan_name}</span>
                                            <div className="text-right">
                                                <span className="font-bold text-slate-900 dark:text-white">{pkg.total}</span>
                                                <span className="text-xs text-slate-400 ml-1">({percentage}%)</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2 dark:bg-slate-800">
                                            <div className={`${colorClass} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-xs text-slate-500 text-center">Data real-time disinkronisasi dengan modul Pembayaran & Keuangan.</p>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
