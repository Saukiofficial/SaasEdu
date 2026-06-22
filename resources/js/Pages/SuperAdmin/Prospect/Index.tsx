import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { UserPlus, Search, Filter, Trash2, CheckCircle, Clock, XCircle, PhoneCall, Activity } from 'lucide-react';

interface Prospect {
    id: string;
    name: string;
    school_name: string;
    email: string;
    phone: string;
    status: 'new' | 'contacted' | 'in_progress' | 'qualified' | 'lost';
    created_at: string;
}

interface Props {
    prospects: {
        data: Prospect[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function ProspectIndex({ prospects, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/super-admin/prospects', { search, status: statusFilter }, { preserveState: true });
    };

    const handleStatusChange = (id: string, newStatus: string) => {
        if (confirm(`Apakah Anda yakin ingin mengubah status prospek ini menjadi ${newStatus}?`)) {
            router.put(`/super-admin/prospects/${id}/status`, { status: newStatus }, {
                preserveScroll: true,
            });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus data prospek ini secara permanen?')) {
            router.delete(`/super-admin/prospects/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'new': return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-md border border-yellow-200 flex items-center gap-1 w-max"><Clock className="w-3 h-3"/> Baru</span>;
            case 'contacted': return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-md border border-blue-200 flex items-center gap-1 w-max"><PhoneCall className="w-3 h-3"/> Dihubungi</span>;
            case 'in_progress': return <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-md border border-indigo-200 flex items-center gap-1 w-max"><Activity className="w-3 h-3"/> Diproses</span>;
            case 'qualified': return <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-md border border-green-200 flex items-center gap-1 w-max"><CheckCircle className="w-3 h-3"/> Qualified</span>;
            case 'lost': return <span className="px-2.5 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-md border border-red-200 flex items-center gap-1 w-max"><XCircle className="w-3 h-3"/> Lost</span>;
            default: return <span className="px-2.5 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-md border border-gray-200">Tidak Diketahui</span>;
        }
    };

    return (
        <AuthenticatedLayout header="Manajemen Prospek">
            <Head title="Prospects - Super Admin" />

            <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] overflow-hidden">
                {/* Header Section */}
                <div className="p-6 border-b border-[#E2DDD0] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#FAF8F3] border border-[#E2DDD0] flex items-center justify-center">
                            <UserPlus className="w-5 h-5 text-[#B8935F]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-serif font-semibold text-[#1C2333]">Daftar Prospek (Leads/Sales)</h2>
                            <p className="text-xs text-[#8B93A8]">Kelola dan pantau prospek klien potensial AkademiaOS</p>
                        </div>
                    </div>

                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari nama, sekolah, email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 text-sm border-[#E2DDD0] focus:border-[#B8935F] focus:ring-[#B8935F] rounded-md shadow-sm w-full sm:w-64"
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter className="h-4 w-4 text-gray-400" />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="pl-10 text-sm border-[#E2DDD0] focus:border-[#B8935F] focus:ring-[#B8935F] rounded-md shadow-sm w-full sm:w-40"
                            >
                                <option value="">Semua Status</option>
                                <option value="new">Baru</option>
                                <option value="contacted">Dihubungi</option>
                                <option value="in_progress">Diproses</option>
                                <option value="qualified">Qualified</option>
                                <option value="lost">Lost</option>
                            </select>
                        </div>
                        <button type="submit" className="bg-[#1C2333] hover:bg-[#2A344A] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                            Filter
                        </button>
                    </form>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-[#5B5648] uppercase bg-[#FAF8F3] border-b border-[#E2DDD0]">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Nama Prospek</th>
                                <th className="px-6 py-4 font-semibold">Institusi / Sekolah</th>
                                <th className="px-6 py-4 font-semibold">Kontak</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prospects.data.length > 0 ? (
                                prospects.data.map((prospect) => (
                                    <tr key={prospect.id} className="border-b border-[#E2DDD0] hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-[#1C2333]">{prospect.name}</td>
                                        <td className="px-6 py-4 text-[#5B5648]">{prospect.school_name}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 text-xs">
                                                <span className="text-[#1C2333] font-medium">{prospect.email}</span>
                                                <span className="text-[#8B93A8]">{prospect.phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(prospect.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <select
                                                    value={prospect.status}
                                                    onChange={(e) => handleStatusChange(prospect.id, e.target.value)}
                                                    className="text-xs border-[#E2DDD0] focus:border-[#B8935F] focus:ring-[#B8935F] rounded py-1 pl-2 pr-8 shadow-sm"
                                                >
                                                    <option value="new">Set: Baru</option>
                                                    <option value="contacted">Set: Dihubungi</option>
                                                    <option value="in_progress">Set: Diproses</option>
                                                    <option value="qualified">Set: Qualified</option>
                                                    <option value="lost">Set: Lost</option>
                                                </select>
                                                <button
                                                    onClick={() => handleDelete(prospect.id)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[#8B93A8]">
                                        <UserPlus className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                        <p>Belum ada data prospek saat ini.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {prospects.last_page > 1 && (
                    <div className="p-4 border-t border-[#E2DDD0] flex justify-center">
                        <div className="flex gap-1">
                            {prospects.links.map((link, index) => (
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