import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    CalendarDays, 
    BookOpen, 
    School, 
    UsersRound, 
    GraduationCap, 
    BriefcaseBusiness, 
    CalendarClock, 
    ClipboardList,
    Award, 
    Printer, 
    Banknote, // <-- Tambahkan icon ini
    LogOut, 
    Menu, 
    X, 
    Building2,
    User
} from 'lucide-react';
import { Button } from '@/Components/ui/button';

export default function AuthenticatedLayout({ children, header }: { children: React.ReactNode, header?: string }) {
    const { props, url } = usePage<any>();
    const { auth } = props;
    const user = auth.user;
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Daftar Menu Navigasi Diperbarui
    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'PPDB Masuk', href: '/admin/ppdb', icon: UsersRound },
        { name: 'Data Siswa', href: '/students', icon: GraduationCap },
        { name: 'Data Guru', href: '/teachers', icon: BriefcaseBusiness }, 
        { name: 'Keuangan / SPP', href: '/invoices', icon: Banknote }, // <-- Menu Baru Keuangan
        { name: 'Jadwal Pelajaran', href: '/schedules', icon: CalendarClock }, 
        { name: 'Absensi Siswa', href: '/attendances', icon: ClipboardList },
        { name: 'Input Nilai', href: '/grades', icon: Award },
        { name: 'Cetak Rapor', href: '/report-cards', icon: Printer },
        { name: 'Tahun Ajaran', href: '/master-data/academic-years', icon: CalendarDays },
        { name: 'Mata Pelajaran', href: '/master-data/subjects', icon: BookOpen },
        { name: 'Kelas & Ruangan', href: '/master-data/classrooms', icon: School },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
            
            {/* --- SIDEBAR DESKTOP --- */}
            <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800">
                <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
                    <Building2 className="w-6 h-6 text-blue-600 mr-2" />
                    <span className="font-bold text-lg text-slate-900 dark:text-white">EduERP</span>
                </div>
                
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {navigation.map((item) => {
                        const isActive = url.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    isActive 
                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400' 
                                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                                }`}
                            >
                                <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-slate-400'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-3">
                            {user.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user.school ? user.school.name : 'Super Admin'}</p>
                        </div>
                    </div>
                    <Link href="/logout" method="post" as="button" className="w-full">
                        <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* --- MOBILE OVERLAY & MENU --- */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-slate-900/80" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <aside className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-slate-950 border-r">
                        <div className="absolute top-0 right-0 -mr-12 pt-4">
                            <button className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" onClick={() => setIsMobileMenuOpen(false)}>
                                <X className="h-6 w-6 text-white" />
                            </button>
                        </div>
                        <div className="h-16 flex items-center px-6 border-b">
                            <Building2 className="w-6 h-6 text-blue-600 mr-2" />
                            <span className="font-bold text-lg">EduERP</span>
                        </div>
                        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                            {navigation.map((item) => {
                                const isActive = url.startsWith(item.href);
                                return (
                                    <Link key={item.name} href={item.href} className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}>
                                        <item.icon className="w-5 h-5 mr-3" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </aside>
                </div>
            )}

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center">
                        <button className="md:hidden text-slate-500 hover:text-slate-700 mr-4" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu className="h-6 w-6" />
                        </button>
                        <h1 className="text-xl font-semibold text-slate-800 dark:text-white">{header || 'EduERP'}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:block text-sm text-slate-500">
                            Status: <span className="text-emerald-600 font-medium">Sistem Aktif</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>

        </div>
    );
}
