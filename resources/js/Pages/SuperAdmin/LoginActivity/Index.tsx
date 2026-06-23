import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Key, Search, Filter, Trash2, CheckCircle2, XCircle, Clock, MonitorSmartphone, Globe, ShieldAlert } from 'lucide-react';

interface School {
    id: string;
    name: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    school: School | null;
}

interface LoginActivity {
    id: string;
    user: User | null;
    email: string;
    ip_address: string;
    user_agent: string;
    status: 'success' | 'failed';
    login_at: string;
}

interface Props {
    activities: {
        data: LoginActivity[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function LoginActivityIndex({ activities, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/super-admin/login-activities', { search, status: statusFilter }, { preserveState: true });
    };

    const handleClearLogs = () => {
        if (confirm('Apakah Anda yakin ingin menghapus semua riwayat login yang lebih lama dari 30 hari? Tindakan ini tidak dapat dibatalkan.')) {
            router.delete('/super-admin/login-activities/clear', {
                preserveScroll: true,
            });
        }
    };

    // Fungsi untuk menyederhanakan User Agent (Browser/OS detection sederhana)
    const parseUserAgent = (ua: string) => {
        if (!ua) return 'Unknown Device';
        let browser = 'Unknown Browser';
        let os = 'Unknown OS';

        if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('Edg')) browser = 'Edge';
        else if (ua.includes('Chrome')) browser = 'Chrome';
        else if (ua.includes('Safari')) browser = 'Safari';
        
        if (ua.includes('Windows')) os = 'Windows';
        else if (ua.includes('Mac OS')) os = 'Mac OS';
        else if (ua.includes('Linux')) os = 'Linux';
        else if (ua.includes('Android')) os = 'Android';
        else if (ua.includes('iOS')) os = 'iOS';

        return `${browser} on ${os}`;
    };

    return (
        <AuthenticatedLayout header="Security Center">
            <Head title="Login Activity - Super Admin" />

            <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] overflow-hidden">
                {/* Header Section */}
                <div className="p-6 border-b border-[#E2DDD0] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center">
                            <Key className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-serif font-semibold text-[#1C2333]">Riwayat Login (Audit Trail)</h2>
                            <p className="text-xs text-[#8B93A8]">Pantau aktivitas akses dan percobaan masuk ke dalam sistem</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
                            <div className="relative">
                                <Search className="h-4 w-4 text-gray-400 absolute inset-y-0 my-auto left-3" />
                                <input
                                    type="text"
                                    placeholder="Cari user, email, atau IP..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 py-2 text-sm border-[#E2DDD0] focus:border-[#B8935F] focus:ring-[#B8935F] rounded-md shadow-sm w-full sm:w-56"
                                />
                            </div>
                            <div className="relative">
                                <Filter className="h-4 w-4 text-gray-400 absolute inset-y-0 my-auto left-3" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="pl-10 py-2 text-sm border-[#E2DDD0] focus:border-[#B8935F] focus:ring-[#B8935F] rounded-md shadow-sm"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="success">Berhasil</option>
                                    <option value="failed">Gagal</option>
                                </select>
                            </div>
                            <button type="submit" className="bg-[#FAF8F3] border border-[#E2DDD0] text-[#1C2333] hover:bg-[#E2DDD0] px-3 py-2 rounded-md text-sm transition-colors">
                                Filter
                            </button>
                        </form>
                        <button 
                            onClick={handleClearLogs} 
                            className="bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                            title="Bersihkan log yang lebih dari 30 hari"
                        >
                            <Trash2 className="w-4 h-4" /> Clear Old Logs
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-[#5B5648] uppercase bg-[#FAF8F3] border-b border-[#E2DDD0]">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Pengguna / Tenant</th>
                                <th className="px-6 py-4 font-semibold">Status Login</th>
                                <th className="px-6 py-4 font-semibold">Waktu Akses</th>
                                <th className="px-6 py-4 font-semibold">Alamat IP & Perangkat</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activities.data.length > 0 ? (
                                activities.data.map((activity) => (
                                    <tr key={activity.id} className="border-b border-[#E2DDD0] hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            {activity.user ? (
                                                <div>
                                                    <p className="font-semibold text-[#1C2333]">{activity.user.name}</p>
                                                    <p className="text-[11px] text-[#8B93A8]">{activity.user.school ? activity.user.school.name : 'Super Administrator'}</p>
                                                    <p className="text-[10px] text-gray-400">{activity.email}</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className="font-semibold text-red-500 italic">User Tidak Diketahui</p>
                                                    <p className="text-[11px] text-[#8B93A8]">Percobaan pada email:</p>
                                                    <p className="text-[11px] font-medium">{activity.email}</p>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {activity.status === 'success' ? (
                                                <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-md border border-green-200 flex items-center gap-1 w-max">
                                                    <CheckCircle2 className="w-3.5 h-3.5"/> Berhasil
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-md border border-red-200 flex items-center gap-1 w-max">
                                                    <XCircle className="w-3.5 h-3.5"/> Gagal
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-[#1C2333]">
                                                <Clock className="w-3.5 h-3.5 text-[#8B93A8]" />
                                                {new Date(activity.login_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5 text-xs text-[#5B5648]">
                                                <div className="flex items-center gap-1.5">
                                                    <Globe className="w-3.5 h-3.5 text-[#8B93A8]" />
                                                    <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">{activity.ip_address || 'Unknown IP'}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5" title={activity.user_agent}>
                                                    <MonitorSmartphone className="w-3.5 h-3.5 text-[#8B93A8]" />
                                                    {parseUserAgent(activity.user_agent)}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-[#8B93A8]">
                                        <ShieldAlert className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                        <p>Belum ada rekaman log aktivitas saat ini.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {activities.last_page > 1 && (
                    <div className="p-4 border-t border-[#E2DDD0] flex justify-center">
                        <div className="flex gap-1">
                            {activities.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    className={`px-3 py-1 text-sm border rounded-md ${
                                        link.active ? 'bg-[#1C2333] text-white border-[#1C2333]' : 'bg-white text-[#5B5648] border-[#E2DDD0] hover:bg-gray-50'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
