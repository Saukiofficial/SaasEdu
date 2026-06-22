import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    ShieldAlert, Search, User, Globe, Clock, 
    PlusCircle, Edit, Trash2, LogIn, Monitor, Shield
} from 'lucide-react';

interface UserData {
    id: string;
    name: string;
    email: string;
    school_id: string | null;
}

interface AuditLog {
    id: string;
    user_id: string | null;
    module: string;
    action: 'created' | 'updated' | 'deleted' | 'login' | 'logout' | 'failed_login' | 'system_event';
    description: string;
    old_values: any | null;
    new_values: any | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
    user?: UserData;
}

export default function AuditLogsIndex({ logs, filters }: { logs: any, filters: any }) {
    const logList: AuditLog[] = logs?.data || [];
    
    // Filter State
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [actionFilter, setActionFilter] = useState(filters.action || '');
    
    // View Details Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

    const actionConfig = {
        created: { label: 'Dibuat', icon: PlusCircle, color: 'text-emerald-600 bg-emerald-50' },
        updated: { label: 'Diubah', icon: Edit, color: 'text-amber-600 bg-amber-50' },
        deleted: { label: 'Dihapus', icon: Trash2, color: 'text-rose-600 bg-rose-50' },
        login: { label: 'Login Sukses', icon: LogIn, color: 'text-blue-600 bg-blue-50' },
        logout: { label: 'Logout', icon: LogIn, color: 'text-slate-600 bg-slate-100' },
        failed_login: { label: 'Login Gagal', icon: ShieldAlert, color: 'text-red-700 bg-red-100' },
        system_event: { label: 'Sistem', icon: Monitor, color: 'text-purple-600 bg-purple-50' },
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/super-admin/audit-logs', { 
            search: searchQuery, 
            action: actionFilter 
        }, { preserveState: true });
    };

    const handleFilterChange = (val: string) => {
        setActionFilter(val);
        router.get('/super-admin/audit-logs', { 
            search: searchQuery, 
            action: val 
        }, { preserveState: true });
    };

    const openDetails = (log: AuditLog) => {
        setSelectedLog(log);
        setIsModalOpen(true);
    };

    return (
        <AuthenticatedLayout header="Security Center">
            <Head title="Audit Log Aktivitas - AkademiaOS" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-serif font-semibold text-[#0F1729] flex items-center gap-2">
                            <ShieldAlert className="w-6 h-6 text-[#B8935F]" />
                            Audit Log & Aktivitas Sistem
                        </h1>
                        <p className="text-sm text-[#8B93A8] mt-1">
                            Lacak seluruh histori perubahan data, login, dan aksi krusial pengguna secara *real-time*.
                        </p>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <form onSubmit={handleSearch} className="bg-white p-4 rounded-xl border border-[#E2DDD0] shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A296]" />
                        <input
                            type="text"
                            placeholder="Cari user, deskripsi, atau IP..."
                            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-md text-sm text-[#0F1729] focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <select 
                            value={actionFilter}
                            onChange={(e) => handleFilterChange(e.target.value)}
                            className="bg-[#FAF8F3] border border-[#E2DDD0] text-[#0F1729] text-sm rounded-md px-3 py-2 outline-none focus:border-[#B8935F] w-full sm:w-auto"
                        >
                            <option value="">Semua Aksi</option>
                            <option value="login">Login & Logout</option>
                            <option value="created">Data Dibuat</option>
                            <option value="updated">Data Diubah</option>
                            <option value="deleted">Data Dihapus</option>
                            <option value="failed_login">Percobaan Meretas</option>
                        </select>
                        <button type="submit" className="hidden">Cari</button>
                    </div>
                </form>

                {/* Data Table */}
                <div className="bg-white rounded-xl border border-[#E2DDD0] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#FAF8F3] border-b border-[#E2DDD0] text-[11px] uppercase tracking-wider text-[#8B93A8] font-semibold">
                                    <th className="px-6 py-4">Aksi / Deskripsi</th>
                                    <th className="px-6 py-4">Pelaku (Pengguna)</th>
                                    <th className="px-6 py-4">Modul Target</th>
                                    <th className="px-6 py-4">IP & Waktu</th>
                                    <th className="px-6 py-4 text-center">Detail</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2DDD0]/60">
                                {logList.length > 0 ? (
                                    logList.map((log: AuditLog) => {
                                        const ActCfg = actionConfig[log.action] || actionConfig['system_event'];
                                        const ActIcon = ActCfg.icon;

                                        return (
                                            <tr key={log.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className={`mt-0.5 w-6 h-6 rounded flex items-center justify-center shrink-0 ${ActCfg.color}`}>
                                                            <ActIcon className="w-3.5 h-3.5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-[#0F1729] mb-0.5 leading-snug">{log.description}</p>
                                                            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8B93A8]">{ActCfg.label}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {log.user ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-7 h-7 rounded-full bg-[#1B2742] text-[#D4AF7A] flex items-center justify-center text-[10px] font-bold shrink-0">
                                                                {log.user.name.charAt(0)}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-semibold text-[#0F1729]">{log.user.name}</span>
                                                                <span className="text-[10px] text-[#8B93A8]">{log.user.school_id ? 'Admin Sekolah' : 'Staff SaaS'}</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                                                            <Monitor className="w-3 h-3" /> Sistem / Anonim
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2 py-0.5 bg-[#FAF8F3] border border-[#E2DDD0] text-[#0F1729] text-[11px] font-mono rounded">
                                                        {log.module}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="flex items-center gap-1.5 text-[11px] text-[#0F1729] font-medium">
                                                            <Globe className="w-3 h-3 text-[#A8A296]" /> {log.ip_address || 'Unknown'}
                                                        </span>
                                                        <span className="flex items-center gap-1.5 text-[10px] text-[#8B93A8]">
                                                            <Clock className="w-3 h-3" /> {new Date(log.created_at).toLocaleString('id-ID')}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {(log.old_values || log.new_values) ? (
                                                        <button 
                                                            onClick={() => openDetails(log)}
                                                            className="text-[11px] font-bold text-[#B8935F] hover:underline"
                                                        >
                                                            Lihat Data
                                                        </button>
                                                    ) : (
                                                        <span className="text-[10px] text-slate-400 italic">No Payload</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <Shield className="w-8 h-8 text-[#E2DDD0] mx-auto mb-3" />
                                            <p className="text-[#8B93A8] text-sm">Tidak ada rekam jejak aktivitas yang ditemukan.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Simple Pagination Footer Info */}
                    {logs?.total > 0 && (
                        <div className="p-4 border-t border-[#E2DDD0] bg-[#FAF8F3] text-xs text-[#8B93A8] flex justify-between">
                            <span>Menampilkan {logs.from} s/d {logs.to} dari {logs.total} log aktivitas.</span>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODAL DETAIL LOG (JSON PAYLOAD) --- */}
            {isModalOpen && selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-[#0F1729]/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl relative z-10 flex flex-col max-h-[90vh]">
                        
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2DDD0] bg-[#FAF8F3] rounded-t-2xl shrink-0">
                            <div>
                                <h2 className="text-lg font-serif font-semibold text-[#0F1729]">Detail Payload Aktivitas</h2>
                                <p className="text-xs text-[#8B93A8] mt-0.5">ID: {selectedLog.id}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#8B93A8] hover:text-[#0F1729] transition-colors">
                                ✕
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Old Values */}
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                                        Data Lama (Sebelum)
                                    </h4>
                                    <pre className="bg-[#0F1729] text-rose-300 p-4 rounded-xl text-[11px] font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                                        {selectedLog.old_values ? JSON.stringify(selectedLog.old_values, null, 2) : 'Null / Tidak Ada Data Lama'}
                                    </pre>
                                </div>

                                {/* New Values */}
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                                        Data Baru (Sesudah)
                                    </h4>
                                    <pre className="bg-[#0F1729] text-emerald-300 p-4 rounded-xl text-[11px] font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                                        {selectedLog.new_values ? JSON.stringify(selectedLog.new_values, null, 2) : 'Null / Tidak Ada Data Baru'}
                                    </pre>
                                </div>
                            </div>
                            
                            <div className="mt-6 pt-4 border-t border-slate-200">
                                <p className="text-[10px] text-slate-500 font-mono">User Agent: {selectedLog.user_agent}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
