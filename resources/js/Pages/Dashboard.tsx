import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Calendar as CalendarIcon, TrendingUp, Building2, Users, GraduationCap, BookOpen, Plus, Megaphone, BarChart, Banknote, FileText, Layers, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
    const { auth } = usePage<any>().props;
    const isSuperAdmin = auth?.user?.school_id === null;

    // --- KOMPONEN GRAFIK DUMMY (SVG MURNI) ---
    const LineChartDummy = ({ color }: { color: string }) => (
        <svg className="w-16 h-8" viewBox="0 0 100 30" fill="none" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">
            <path d="M0 25 L20 20 L40 28 L60 15 L80 18 L100 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="100" cy="5" r="3" fill={color} />
        </svg>
    );

    // Jika yang login bukan Super Admin (yaitu Sekolah/Tenant)
    if (!isSuperAdmin) {
        return (
            <AuthenticatedLayout header="Dashboard Sekolah">
                <Head title="Dashboard Tenant" />
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800">Selamat datang, {auth?.user?.name}!</h2>
                    <p className="text-slate-500 mt-2">Ini adalah dashboard khusus tenant (sekolah). Anda memiliki akses penuh ke Manajemen Siswa, Akademik, dan Keuangan di sidebar sebelah kiri.</p>
                </div>
            </AuthenticatedLayout>
        );
    }

    // Tampilan Khusus Super Admin (SaaS Owner)
    return (
        <AuthenticatedLayout header="Pusat Kendali">
            <Head title="SaaSEdu - Dashboard" />
            
            <div className="space-y-6">
                {/* Header Title & Date Picker */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            Selamat pagi, Super Admin! <span className="text-2xl">👋</span>
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">Berikut ringkasan aktivitas dan performa platform SaaS pendidikan Anda hari ini.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                        <CalendarIcon className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700">18 Mei 2026 - 24 Mei 2026</span>
                    </div>
                </div>

                {/* --- TOP STATS ROW --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[
                        { title: 'Total Institusi', value: '128', trend: '+12%', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50', line: '#2563eb' },
                        { title: 'Total Siswa', value: '24.562', trend: '+18%', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', line: '#16a34a' },
                        { title: 'Total Guru & Staf', value: '2.045', trend: '+8%', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50', line: '#9333ea' },
                        { title: 'Total Kelas', value: '1.236', trend: '+15%', icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50', line: '#d97706' },
                        { title: 'Pendapatan Bulan Ini', value: 'Rp 245.000.000', trend: '+24%', icon: Banknote, color: 'text-rose-600', bg: 'bg-rose-50', line: '#e11d48' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.title}</h3>
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">{stat.value}</h2>
                                    <div className="flex items-center gap-1 mt-1">
                                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                                        <span className="text-xs font-bold text-emerald-600">{stat.trend}</span>
                                        <span className="text-[10px] text-slate-400">dari minggu lalu</span>
                                    </div>
                                </div>
                                <LineChartDummy color={stat.line} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- CHARTS & QUICK ACTIONS ROW --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* CHART 1: Penggunaan Sistem */}
                    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 lg:col-span-5 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="font-bold text-slate-800">Trafik Penggunaan (Traffic)</h3>
                                <div className="flex items-end gap-3 mt-2">
                                    <span className="text-3xl font-bold text-slate-900">92,4%</span>
                                    <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 mb-1">
                                        <TrendingUp className="w-3 h-3 mr-1" /> 4,2%
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">Rata-rata uptime server</p>
                            </div>
                            <select className="text-xs border-slate-200 rounded-lg text-slate-600 focus:ring-blue-500">
                                <option>Mingguan</option>
                                <option>Bulanan</option>
                            </select>
                        </div>
                        <div className="h-48 w-full mt-8 relative">
                            <div className="absolute inset-0 flex flex-col justify-between">
                                {[100, 75, 50, 25, 0].map(val => (
                                    <div key={val} className="w-full flex items-center text-[10px] text-slate-400">
                                        <span className="w-6">{val}%</span>
                                        <div className="flex-1 h-px bg-slate-100 ml-2"></div>
                                    </div>
                                ))}
                            </div>
                            <svg className="absolute inset-0 w-full h-full pt-2 pl-8" viewBox="0 0 400 150" preserveAspectRatio="none">
                                <path d="M0 100 Q 50 110, 100 80 T 200 90 T 300 100 T 400 60" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                                <circle cx="200" cy="90" r="5" fill="#3b82f6" className="ring-4 ring-blue-100" />
                            </svg>
                            <div className="absolute left-[45%] top-[10%] bg-white border border-slate-200 shadow-lg rounded p-2 text-center pointer-events-none">
                                <p className="text-[10px] text-slate-500">Kamis, 22 Mei</p>
                                <p className="text-xs font-bold text-blue-600">93,7%</p>
                            </div>
                            <div className="absolute bottom-[-20px] left-8 right-0 flex justify-between text-[10px] text-slate-400">
                                <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span>
                            </div>
                        </div>
                    </div>

                    {/* CHART 2: Pertumbuhan Institusi */}
                    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 lg:col-span-5 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="font-bold text-slate-800">Pertumbuhan Klien Baru</h3>
                                <div className="flex items-end gap-3 mt-2">
                                    <span className="text-3xl font-bold text-slate-900">871</span>
                                    <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 mb-1">
                                        <TrendingUp className="w-3 h-3 mr-1" /> 6,7%
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">Tenant terdaftar (YTD)</p>
                            </div>
                            <select className="text-xs border-slate-200 rounded-lg text-slate-600 focus:ring-blue-500">
                                <option>Tahunan</option>
                                <option>Bulanan</option>
                            </select>
                        </div>
                        <div className="h-48 w-full mt-8 relative">
                            <div className="absolute inset-0 flex flex-col justify-between">
                                {[1000, 750, 500, 250, 0].map(val => (
                                    <div key={val} className="w-full flex items-center text-[10px] text-slate-400">
                                        <span className="w-6">{val}</span>
                                        <div className="flex-1 h-px bg-slate-100 ml-2"></div>
                                    </div>
                                ))}
                            </div>
                            <svg className="absolute inset-0 w-full h-full pt-2 pl-8" viewBox="0 0 400 150" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.2"/>
                                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0"/>
                                    </linearGradient>
                                </defs>
                                <path d="M0 120 L 60 100 L 130 80 L 200 60 L 270 40 L 340 50 L 400 20 L 400 150 L 0 150 Z" fill="url(#gradPurple)" />
                                <path d="M0 120 L 60 100 L 130 80 L 200 60 L 270 40 L 340 50 L 400 20" fill="none" stroke="#a855f7" strokeWidth="3" />
                                <circle cx="270" cy="40" r="5" fill="#a855f7" className="ring-4 ring-purple-100" />
                            </svg>
                            <div className="absolute left-[62%] top-[-5%] bg-white border border-slate-200 shadow-lg rounded p-2 text-center pointer-events-none">
                                <p className="text-[10px] text-slate-500">Mei 2026</p>
                                <p className="text-xs font-bold text-purple-600">871</p>
                            </div>
                            <div className="absolute bottom-[-20px] left-8 right-0 flex justify-between text-[10px] text-slate-400">
                                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>Mei</span><span>Jun</span><span>Jul</span>
                            </div>
                        </div>
                    </div>

                    {/* QUICK ACTIONS */}
                    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 lg:col-span-2">
                        <h3 className="font-bold text-slate-800 mb-4">Aksi Cepat</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors">
                                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center shrink-0"><Plus className="w-4 h-4 text-blue-700" /></div>
                                <span className="text-sm font-semibold">Tambah Klien</span>
                            </button>
                            <button className="w-full flex items-center gap-3 p-3 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors">
                                <div className="w-6 h-6 bg-emerald-200 rounded-full flex items-center justify-center shrink-0"><Plus className="w-4 h-4 text-emerald-700" /></div>
                                <span className="text-sm font-semibold">Buat Paket</span>
                            </button>
                            <button className="w-full flex items-center gap-3 p-3 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors">
                                <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center shrink-0"><Megaphone className="w-4 h-4 text-purple-700" /></div>
                                <span className="text-sm font-semibold">Buat Broadcast</span>
                            </button>
                            <button className="w-full flex items-center gap-3 p-3 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-colors">
                                <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center shrink-0"><BarChart className="w-4 h-4 text-amber-700" /></div>
                                <span className="text-sm font-semibold">Generate Laporan</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- BOTTOM GRIDS ROW --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* Aktivitas Terbaru */}
                    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="font-bold text-slate-800">Aktivitas Klien</h3>
                            <a href="#" className="text-xs font-semibold text-blue-600 hover:underline">Lihat Semua</a>
                        </div>
                        <div className="space-y-5">
                            {[
                                { title: 'Institusi baru mendaftar', desc: 'SMA Negeri 1 Jakarta', time: '2 menit lalu', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100' },
                                { title: 'Paket diupgrade', desc: 'SMP Harapan Bangsa', time: '15 menit lalu', icon: Layers, color: 'text-emerald-600', bg: 'bg-emerald-100' },
                                { title: 'Pembayaran langganan', desc: 'SD Cendekia - Rp 250k', time: '1 jam lalu', icon: Banknote, color: 'text-amber-600', bg: 'bg-amber-100' },
                                { title: 'Tiket bantuan dibuka', desc: 'SMA Global Mandiri', time: '2 jam lalu', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100' },
                            ].map((act, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${act.bg}`}>
                                        <act.icon className={`w-4 h-4 ${act.color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">{act.title}</p>
                                        <p className="text-xs text-slate-500 truncate">{act.desc}</p>
                                    </div>
                                    <span className="text-[10px] text-slate-400 shrink-0">{act.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Institusi */}
                    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="font-bold text-slate-800">Top Institusi</h3>
                            <a href="#" className="text-xs font-semibold text-blue-600 hover:underline">Lihat Semua</a>
                        </div>
                        <div className="space-y-5">
                            {[
                                { rank: 1, name: 'SMA Negeri 1 Jakarta', users: '124 Akun Aktif', rev: 'Enterprise', trend: '+24%' },
                                { rank: 2, name: 'SMP Harapan Bangsa', users: '86 Akun Aktif', rev: 'Pro Plan', trend: '+18%' },
                                { rank: 3, name: 'SD Cendekia Muda', users: '62 Akun Aktif', rev: 'Pro Plan', trend: '+12%' },
                                { rank: 4, name: 'SMA Global Mandiri', users: '45 Akun Aktif', rev: 'Basic Plan', trend: '+10%' },
                            ].map((inst, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="text-xs font-bold text-slate-400 w-3">{inst.rank}</div>
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                                        <Building2 className="w-4 h-4 text-blue-800" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">{inst.name}</p>
                                        <p className="text-xs text-slate-500">{inst.users}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{inst.rev}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pengumuman Terbaru */}
                    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="font-bold text-slate-800">Broadcast Terbaru</h3>
                            <a href="#" className="text-xs font-semibold text-blue-600 hover:underline">Lihat Semua</a>
                        </div>
                        <div className="space-y-4">
                            {[
                                { title: 'Maintenance Server Mingguan', date: '22 Mei 2026', badge: 'Penting', bColor: 'bg-red-100 text-red-700', icon: Megaphone },
                                { title: 'Rilis Fitur CBT Terbaru', date: '20 Mei 2026', badge: 'Update', bColor: 'bg-blue-100 text-blue-700', icon: BookOpen },
                                { title: 'Diskon Layanan Tahunan', date: '15 Mei 2026', badge: 'Promo', bColor: 'bg-emerald-100 text-emerald-700', icon: Banknote },
                                { title: 'Webinar Penggunaan EduERP', date: '10 Mei 2026', badge: 'Event', bColor: 'bg-amber-100 text-amber-700', icon: Users },
                            ].map((ann, i) => (
                                <div key={i} className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                        <ann.icon className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 line-clamp-1">{ann.title}</p>
                                        <p className="text-xs text-slate-400 mt-1">{ann.date}</p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md h-fit shrink-0 ${ann.bColor}`}>{ann.badge}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Status Sistem */}
                    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 flex flex-col">
                        <h3 className="font-bold text-slate-800 mb-5">Status Server SaaS</h3>
                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 flex items-center gap-2"><div className="w-4 h-4 bg-slate-100 rounded flex items-center justify-center"><Layers className="w-3 h-3" /></div> Main Server</span>
                                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 flex items-center gap-2"><div className="w-4 h-4 bg-slate-100 rounded flex items-center justify-center"><Layers className="w-3 h-3" /></div> Master DB</span>
                                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Sehat</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600 flex items-center gap-2"><div className="w-4 h-4 bg-slate-100 rounded flex items-center justify-center"><Layers className="w-3 h-3" /></div> Cloud Storage</span>
                                    <span className="text-xs font-bold text-slate-700">62%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5">
                                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '62%' }}></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 flex items-center gap-2"><div className="w-4 h-4 bg-slate-100 rounded flex items-center justify-center"><Layers className="w-3 h-3" /></div> Node Backup</span>
                                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> 2 jam lalu</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 flex items-center gap-2"><div className="w-4 h-4 bg-slate-100 rounded flex items-center justify-center"><Layers className="w-3 h-3" /></div> SMTP Email</span>
                                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Operational</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <div className="bg-emerald-50 text-emerald-700 text-xs font-bold p-3 rounded-lg flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Seluruh tenant berjalan normal
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
