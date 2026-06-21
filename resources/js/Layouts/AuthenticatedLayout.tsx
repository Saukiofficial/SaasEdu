import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { 
    LayoutDashboard, Building, UsersRound, Package, CreditCard, Megaphone, 
    PieChart, Settings, HeadphonesIcon, GraduationCap, BriefcaseBusiness, 
    School, BookOpen, CalendarDays, CalendarClock, ClipboardList, MonitorPlay, 
    FileQuestion, Award, Printer, Banknote, LogOut, Menu, X, Bell, Search, 
    MessageSquare, ChevronDown, Calendar, Star
} from 'lucide-react';

export default function AuthenticatedLayout({ children, header }: { children: React.ReactNode, header?: string }) {
    const { props, url } = usePage<any>();
    const auth = props?.auth || {};
    const user = auth?.user;

    if (!user) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#f4f7f9] text-slate-500 font-medium tracking-wide">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    Memuat Workspace...
                </div>
            </div>
        );
    }

    const currentUrl = url || '';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isSuperAdmin = user.school_id === null;

    // --- MENU SUPER ADMIN (FITUR ASLI) ---
    const superAdminGroups = [
        {
            title: 'MANAGEMENT',
            items: [
                { name: 'Dashboard Global', href: '/dashboard', icon: LayoutDashboard },
                { name: 'Manajemen Tenant', href: '/super-admin/tenants', icon: Building },
                { name: 'Manajemen User', href: '/super-admin/users', icon: UsersRound },
                { name: 'Manajemen Paket', href: '/super-admin/packages', icon: Package },
            ]
        },
        {
            title: 'SISTEM',
            items: [
                { name: 'Pembayaran & Keuangan', href: '/super-admin/finance', icon: CreditCard },
                { name: 'Konten & Pengaturan', href: '/super-admin/announcements', icon: Megaphone },
                { name: 'Laporan & Analitik', href: '/super-admin/reports', icon: PieChart }, // <-- LINK BARU
                { name: 'Pengaturan Sistem', href: '/super-admin/settings', icon: Settings },
                { name: 'Support & Bantuan', href: '/super-admin/tickets', icon: HeadphonesIcon },
            ]
        }
    ];

    // --- MENU KLIEN / SEKOLAH (FITUR ASLI) ---
    const schoolGroups = [
        {
            title: 'MANAGEMENT',
            items: [
                { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
                { name: 'PPDB Masuk', href: '/admin/ppdb', icon: UsersRound },
                { name: 'Data Siswa', href: '/students', icon: GraduationCap },
                { name: 'Data Guru', href: '/teachers', icon: BriefcaseBusiness },
                { name: 'Kelas & Ruangan', href: '/master-data/classrooms', icon: School },
                { name: 'Mata Pelajaran', href: '/master-data/subjects', icon: BookOpen },
                { name: 'Tahun Ajaran', href: '/master-data/academic-years', icon: CalendarDays },
            ]
        },
        {
            title: 'AKADEMIK',
            items: [
                { name: 'Jadwal Pelajaran', href: '/schedules', icon: CalendarClock },
                { name: 'Absensi Siswa', href: '/attendances', icon: ClipboardList },
                { name: 'LMS & Tugas', href: '/study-materials', icon: MonitorPlay },
                { name: 'Ujian Online', href: '/exams', icon: FileQuestion },
                { name: 'Input Nilai', href: '/grades', icon: Award },
                { name: 'Cetak Rapor', href: '/report-cards', icon: Printer },
            ]
        },
        {
            title: 'KEUANGAN',
            items: [
                { name: 'Keuangan / SPP', href: '/invoices', icon: Banknote },
            ]
        }
    ];

    const menuGroups = isSuperAdmin ? superAdminGroups : schoolGroups;

    return (
        <div className="flex h-screen bg-[#f4f7f9] font-sans text-slate-900 overflow-hidden">
            
            {/* --- SIDEBAR DESKTOP --- */}
            <aside className="hidden md:flex w-64 flex-col bg-[#1e3a8a] text-slate-300 z-20 shrink-0 shadow-xl relative">
                {/* BRANDING */}
                <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0 mt-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <GraduationCap className="w-5 h-5 text-blue-800" />
                        </div>
                        <div>
                            <span className="font-bold text-xl text-white tracking-tight leading-none block">SaaSEdu</span>
                            <span className="text-[10px] text-blue-200 uppercase tracking-widest block mt-0.5">School OS</span>
                        </div>
                    </div>
                </div>
                
                {/* MENU */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6 custom-scrollbar">
                    {menuGroups.map((group, idx) => (
                        <div key={idx} className="space-y-1">
                            <div className="px-3 pb-2 text-[10px] font-bold text-blue-300 uppercase tracking-widest">
                                {group.title}
                            </div>
                            {group.items.map((item) => {
                                const isActive = currentUrl !== '' && currentUrl.startsWith(item.href) && item.href !== '#';
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                                            isActive 
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                                            : 'text-blue-100 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        <item.icon className={`w-4 h-4 mr-3 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-blue-300 group-hover:text-white'}`} />
                                        <span className="truncate">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* UPGRADE PACKAGE WIDGET (Ditampilkan khusus klien) */}
                {!isSuperAdmin && (
                    <div className="px-4 pb-4 shrink-0">
                        <div className="bg-blue-900/50 border border-blue-700/50 rounded-xl p-4 text-center relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-500/20 rounded-full blur-xl"></div>
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                                <Star className="w-5 h-5 text-white fill-white" />
                            </div>
                            <h4 className="text-white font-bold text-sm mb-1">Tingkatkan Paket Anda</h4>
                            <p className="text-blue-200 text-xs mb-3">Dapatkan fitur premium dan kelola sekolah lebih optimal.</p>
                            <button className="w-full bg-white text-blue-900 font-bold text-xs py-2 rounded-lg hover:bg-blue-50 transition-colors">
                                Upgrade Sekarang →
                            </button>
                        </div>
                    </div>
                )}

                {/* USER PROFILE BTM */}
                <div className="p-4 bg-blue-950/40 border-t border-white/5 shrink-0 flex items-center justify-between cursor-pointer hover:bg-blue-900/40 transition-colors" onClick={() => router.post('/logout')}>
                    <div className="flex items-center min-w-0">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-3 shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user.name}</p>
                            <p className="text-[10px] text-blue-300 truncate">{isSuperAdmin ? 'Super Administrator' : (user.school ? user.school.name : 'Tenant Admin')}</p>
                        </div>
                    </div>
                    <LogOut className="w-4 h-4 text-blue-300 shrink-0 ml-2 hover:text-red-400" />
                </div>
            </aside>

            {/* --- MOBILE MENU OVERLAY --- */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <aside className="relative w-64 bg-[#1e3a8a] text-slate-300 flex flex-col h-full shadow-2xl">
                        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
                            <span className="font-bold text-lg text-white">SaaSEdu</span>
                            <button onClick={() => setIsMobileMenuOpen(false)}><X className="w-5 h-5 text-white" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
                            {menuGroups.map((group, idx) => (
                                <div key={idx} className="space-y-1">
                                    <div className="px-3 pb-2 text-[10px] font-bold text-blue-300 uppercase tracking-widest">
                                        {group.title}
                                    </div>
                                    {group.items.map((item) => {
                                        const isActive = currentUrl !== '' && currentUrl.startsWith(item.href) && item.href !== '#';
                                        return (
                                            <Link key={item.name} href={item.href} className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-blue-600 text-white' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`}>
                                                <item.icon className={`w-4 h-4 mr-3 shrink-0 ${isActive ? 'text-white' : 'text-blue-300'}`} />
                                                <span className="truncate">{item.name}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-white/10 shrink-0">
                            <button onClick={() => router.post('/logout')} className="w-full text-left text-sm font-bold text-red-300 flex items-center hover:text-red-200">
                                <LogOut className="w-4 h-4 mr-2" /> Logout
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                
                {/* --- TOPBAR --- */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shrink-0 shadow-sm shadow-slate-100/50">
                    <div className="flex items-center gap-4 flex-1">
                        <button className="md:hidden text-slate-400 hover:text-slate-600" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu className="h-6 w-6" />
                        </button>
                        
                        {/* Global Search */}
                        <div className="hidden sm:flex items-center relative w-full max-w-md">
                            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Cari apapun di SaaSEdu..." 
                                className="w-full pl-10 pr-16 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 outline-none transition-all"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <span className="bg-white border border-slate-200 text-slate-400 text-[10px] px-1.5 py-0.5 rounded font-medium shadow-sm">Ctrl</span>
                                <span className="bg-white border border-slate-200 text-slate-400 text-[10px] px-1.5 py-0.5 rounded font-medium shadow-sm">K</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 sm:gap-6">
                        {/* Tahun Ajaran Selector */}
                        <div className="hidden lg:flex items-center gap-3 border-r border-slate-200 pr-6">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-slate-600" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tahun Ajaran</span>
                                <span className="text-sm font-bold text-slate-700 flex items-center gap-1 cursor-pointer hover:text-blue-600">
                                    2024/2025 Genap <ChevronDown className="w-3 h-3 text-slate-400" />
                                </span>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="flex items-center gap-3 border-r border-slate-200 pr-6">
                            <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">3</span>
                            </button>
                            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
                                <MessageSquare className="w-5 h-5" />
                            </button>
                        </div>

                        {/* User Profile Mini */}
                        <div className="flex items-center gap-3 cursor-pointer group">
                            <img src={`https://ui-avatars.com/api/?name=${user.name}&background=1e3a8a&color=fff`} alt="Profile" className="w-9 h-9 rounded-full border border-slate-200 shadow-sm group-hover:ring-2 ring-blue-100 transition-all" />
                            <div className="hidden sm:flex flex-col">
                                <span className="text-sm font-bold text-slate-800">{user.name}</span>
                                <span className="text-[10px] text-slate-500">{isSuperAdmin ? 'Super Administrator' : 'Tenant Admin'}</span>
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                        </div>
                    </div>
                </header>

                {/* --- MAIN PAGE CONTENT --- */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
                    <div className="max-w-[1600px] mx-auto w-full pb-10">
                        {children}
                        
                        {/* Footer / Copyright */}
                        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400">
                            <p>© 2026 SaaSEdu. All rights reserved.</p>
                            <p>v2.5.0 • Made with ❤️ for education</p>
                        </div>
                    </div>
                </main>
            </div>

        </div>
    );
}