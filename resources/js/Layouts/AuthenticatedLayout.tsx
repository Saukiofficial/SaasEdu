import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    LayoutDashboard, Building, UsersRound, Package, CreditCard, Megaphone,
    PieChart, Settings, HeadphonesIcon, GraduationCap, BriefcaseBusiness,
    School, BookOpen, CalendarDays, CalendarClock, ClipboardList, MonitorPlay,
    FileQuestion, Award, Printer, Banknote, LogOut, Menu, X, Bell, Search,
    MessageSquare, ChevronDown, Calendar, ShieldCheck
} from 'lucide-react';

export default function AuthenticatedLayout({ children, header }: { children: React.ReactNode, header?: string }) {
    const { props, url } = usePage<any>();
    const auth = props?.auth || {};
    const user = auth?.user;

    if (!user) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#FAF8F3] text-[#5B5648] font-medium tracking-wide">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-[#16213E] border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-serif text-sm tracking-wider">Membuka Ruang Akademik…</span>
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
            title: 'Manajemen',
            items: [
                { name: 'Dashboard Global', href: '/dashboard', icon: LayoutDashboard },
                { name: 'Manajemen Tenant', href: '/super-admin/tenants', icon: Building },
                { name: 'Manajemen User', href: '/super-admin/users', icon: UsersRound },
                { name: 'Manajemen Paket', href: '/super-admin/packages', icon: Package },
            ]
        },
        {
            title: 'Sistem',
            items: [
                { name: 'Pembayaran & Keuangan', href: '/super-admin/finance', icon: CreditCard },
                { name: 'Konten & Pengaturan', href: '/super-admin/announcements', icon: Megaphone },
                { name: 'Laporan & Analitik', href: '/super-admin/reports', icon: PieChart },
                { name: 'Pengaturan Sistem', href: '/super-admin/settings', icon: Settings },
                { name: 'Support & Bantuan', href: '/super-admin/tickets', icon: HeadphonesIcon },
            ]
        }
    ];

    // --- MENU KLIEN / SEKOLAH (FITUR ASLI) ---
    const schoolGroups = [
        {
            title: 'Manajemen',
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
            title: 'Akademik',
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
            title: 'Keuangan',
            items: [
                { name: 'Keuangan / SPP', href: '/invoices', icon: Banknote },
            ]
        }
    ];

    const menuGroups = isSuperAdmin ? superAdminGroups : schoolGroups;

    return (
        <div className="flex h-screen bg-[#F4F1E8] font-sans text-[#1C2333] overflow-hidden">

            {/* --- SIDEBAR DESKTOP --- */}
            <aside className="hidden md:flex w-72 flex-col bg-[#0F1729] text-[#A9B2C7] z-20 shrink-0 relative border-r border-[#B8935F]/20">
                {/* BRANDING */}
                <div className="h-20 flex items-center px-6 border-b border-[#B8935F]/15 shrink-0">
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/logo.png"
                            alt="Lambang Institusi"
                            className="w-11 h-11 object-contain bg-transparent shrink-0 drop-shadow-[0_2px_6px_rgba(184,147,95,0.25)]"
                        />
                        <div className="leading-tight">
                            <span className="font-serif font-semibold text-lg text-white tracking-tight block">
                                Akademia<span className="text-[#D4AF7A]">OS</span>
                            </span>
                            <span className="text-[9px] text-[#8B93A8] uppercase tracking-[0.2em] block mt-0.5">
                                Sistem Informasi Akademik
                            </span>
                        </div>
                    </div>
                </div>

                {/* MENU */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-7 custom-scrollbar">
                    {menuGroups.map((group, idx) => (
                        <div key={idx} className="space-y-1">
                            <div className="px-3 pb-2 text-[10px] font-semibold text-[#D4AF7A]/70 uppercase tracking-[0.18em]">
                                {group.title}
                            </div>
                            {group.items.map((item) => {
                                const isActive = currentUrl !== '' && currentUrl.startsWith(item.href) && item.href !== '#';
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center px-3 py-2.5 rounded-md text-[13.5px] font-medium transition-all duration-150 group ${
                                            isActive
                                            ? 'bg-[#1B2742] text-white shadow-[inset_2px_0_0_0_#D4AF7A]'
                                            : 'text-[#A9B2C7] hover:bg-white/5 hover:text-white'
                                        }`}
                                    >
                                        <item.icon className={`w-4 h-4 mr-3 shrink-0 transition-colors ${isActive ? 'text-[#D4AF7A]' : 'text-[#6B7593] group-hover:text-[#D4AF7A]'}`} />
                                        <span className="truncate">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* ACCREDITATION / STATUS WIDGET (Ditampilkan khusus klien) */}
                {!isSuperAdmin && (
                    <div className="px-4 pb-4 shrink-0">
                        <div className="border border-[#B8935F]/30 rounded-lg p-4 text-center relative bg-[#141C30]">
                            <div className="w-9 h-9 border border-[#B8935F]/50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <ShieldCheck className="w-4 h-4 text-[#D4AF7A]" />
                            </div>
                            <h4 className="text-white font-serif font-semibold text-[13px] mb-1">Paket Institusi Aktif</h4>
                            <p className="text-[#8B93A8] text-[11px] mb-3 leading-relaxed">Tingkatkan kapasitas dan fitur untuk mendukung operasional sekolah Anda.</p>
                            <button className="w-full border border-[#D4AF7A]/60 text-[#D4AF7A] font-semibold text-[11px] py-2 rounded-md hover:bg-[#D4AF7A] hover:text-[#0F1729] transition-colors uppercase tracking-wider">
                                Tingkatkan Paket
                            </button>
                        </div>
                    </div>
                )}

                {/* USER PROFILE BTM */}
                <div className="p-4 bg-[#0B1020] border-t border-[#B8935F]/15 shrink-0 flex items-center justify-between cursor-pointer hover:bg-[#11192E] transition-colors" onClick={() => router.post('/logout')}>
                    <div className="flex items-center min-w-0">
                        <div className="w-9 h-9 rounded-full bg-[#1B2742] border border-[#B8935F]/30 flex items-center justify-center text-[#D4AF7A] font-serif font-semibold mr-3 shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                            <p className="text-[10px] text-[#8B93A8] truncate">{isSuperAdmin ? 'Super Administrator' : (user.school ? user.school.name : 'Tenant Admin')}</p>
                        </div>
                    </div>
                    <LogOut className="w-4 h-4 text-[#6B7593] shrink-0 ml-2 hover:text-red-400" />
                </div>
            </aside>

            {/* --- MOBILE MENU OVERLAY --- */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-[#0B1020]/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <aside className="relative w-72 bg-[#0F1729] text-[#A9B2C7] flex flex-col h-full shadow-2xl">
                        <div className="h-20 flex items-center justify-between px-6 border-b border-[#B8935F]/15 shrink-0">
                            <div className="flex items-center gap-2.5">
                                <img src="/images/logo.png" alt="Lambang Institusi" className="w-8 h-8 object-contain bg-transparent shrink-0" />
                                <span className="font-serif font-semibold text-base text-white">Akademia<span className="text-[#D4AF7A]">OS</span></span>
                            </div>
                            <button onClick={() => setIsMobileMenuOpen(false)}><X className="w-5 h-5 text-white" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
                            {menuGroups.map((group, idx) => (
                                <div key={idx} className="space-y-1">
                                    <div className="px-3 pb-2 text-[10px] font-semibold text-[#D4AF7A]/70 uppercase tracking-[0.18em]">
                                        {group.title}
                                    </div>
                                    {group.items.map((item) => {
                                        const isActive = currentUrl !== '' && currentUrl.startsWith(item.href) && item.href !== '#';
                                        return (
                                            <Link key={item.name} href={item.href} className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium ${isActive ? 'bg-[#1B2742] text-white shadow-[inset_2px_0_0_0_#D4AF7A]' : 'text-[#A9B2C7] hover:bg-white/5 hover:text-white'}`}>
                                                <item.icon className={`w-4 h-4 mr-3 shrink-0 ${isActive ? 'text-[#D4AF7A]' : 'text-[#6B7593]'}`} />
                                                <span className="truncate">{item.name}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-[#B8935F]/15 shrink-0">
                            <button onClick={() => router.post('/logout')} className="w-full text-left text-sm font-semibold text-red-300 flex items-center hover:text-red-200">
                                <LogOut className="w-4 h-4 mr-2" /> Keluar
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

                {/* --- TOPBAR --- */}
                <header className="h-20 bg-white border-b border-[#E2DDD0] flex items-center justify-between px-6 z-10 shrink-0">
                    <div className="flex items-center gap-4 flex-1">
                        <button className="md:hidden text-[#8B93A8] hover:text-[#1C2333]" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu className="h-6 w-6" />
                        </button>

                        {header && (
                            <h1 className="hidden md:block font-serif text-lg font-semibold text-[#1C2333] tracking-tight mr-2">
                                {header}
                            </h1>
                        )}

                        {/* Global Search */}
                        <div className="hidden sm:flex items-center relative w-full max-w-md">
                            <Search className="w-4 h-4 absolute left-3 text-[#A8A296]" />
                            <input
                                type="text"
                                placeholder="Cari data, modul, atau dokumen…"
                                className="w-full pl-10 pr-16 py-2.5 bg-[#FAF8F3] border border-[#E2DDD0] rounded-md text-sm text-[#1C2333] placeholder:text-[#A8A296] focus:bg-white focus:border-[#B8935F] focus:ring-4 focus:ring-[#B8935F]/10 outline-none transition-all"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <span className="bg-white border border-[#E2DDD0] text-[#A8A296] text-[10px] px-1.5 py-0.5 rounded font-medium">Ctrl</span>
                                <span className="bg-white border border-[#E2DDD0] text-[#A8A296] text-[10px] px-1.5 py-0.5 rounded font-medium">K</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        {/* Tahun Ajaran Selector */}
                        <div className="hidden lg:flex items-center gap-3 border-r border-[#E2DDD0] pr-6">
                            <div className="w-8 h-8 rounded-full bg-[#FAF8F3] border border-[#E2DDD0] flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-[#16213E]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] text-[#A8A296] font-semibold uppercase tracking-wider">Tahun Ajaran</span>
                                <span className="text-sm font-semibold text-[#1C2333] flex items-center gap-1 cursor-pointer hover:text-[#16213E]">
                                    2024/2025 Genap <ChevronDown className="w-3 h-3 text-[#A8A296]" />
                                </span>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="flex items-center gap-3 border-r border-[#E2DDD0] pr-6">
                            <button className="relative p-2 text-[#8B93A8] hover:bg-[#FAF8F3] rounded-full transition-colors">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-4 h-4 bg-[#9C3B3B] text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">3</span>
                            </button>
                            <button className="p-2 text-[#8B93A8] hover:bg-[#FAF8F3] rounded-full transition-colors">
                                <MessageSquare className="w-5 h-5" />
                            </button>
                        </div>

                        {/* User Profile Mini */}
                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-9 h-9 rounded-full bg-[#16213E] border border-[#E2DDD0] shadow-sm flex items-center justify-center text-[#D4AF7A] font-serif font-semibold group-hover:ring-2 ring-[#B8935F]/20 transition-all">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="hidden sm:flex flex-col">
                                <span className="text-sm font-semibold text-[#1C2333]">{user.name}</span>
                                <span className="text-[10px] text-[#8B93A8]">{isSuperAdmin ? 'Super Administrator' : 'Tenant Admin'}</span>
                            </div>
                            <ChevronDown className="w-4 h-4 text-[#A8A296] hidden sm:block" />
                        </div>
                    </div>
                </header>

                {/* --- MAIN PAGE CONTENT --- */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative bg-[#F4F1E8]">
                    <div className="max-w-[1600px] mx-auto w-full pb-10">
                        {children}

                        {/* Footer / Copyright */}
                        <div className="mt-12 pt-6 border-t border-[#E2DDD0] flex flex-col sm:flex-row justify-between items-center text-xs text-[#A8A296] gap-2">
                            <p>© 2026 AkademiaOS. Hak cipta dilindungi.</p>
                            <p className="flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#B8935F]" />
                                Versi 2.5.0 — Platform Manajemen Akademik Terpadu
                            </p>
                        </div>
                    </div>
                </main>
            </div>

        </div>
    );
}