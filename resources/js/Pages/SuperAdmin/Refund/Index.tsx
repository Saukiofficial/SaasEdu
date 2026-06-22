import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { RotateCcw, Search, Filter, Trash2, CheckCircle, Clock, XCircle, DollarSign, FileText } from 'lucide-react';

interface School {
    id: string;
    name: string;
}

interface SubscriptionInvoice {
    id: string;
    invoice_number: string;
}

interface Refund {
    id: string;
    school: School;
    subscriptionInvoice: SubscriptionInvoice;
    amount: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected' | 'processed';
    processed_at: string | null;
    notes: string | null;
    created_at: string;
}

interface Props {
    refunds: {
        data: Refund[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function RefundIndex({ refunds, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/super-admin/refunds', { search, status: statusFilter }, { preserveState: true });
    };

    const handleStatusChange = (id: string, newStatus: string) => {
        const notes = prompt(`Tambahkan catatan (opsional) untuk status ${newStatus}:`);
        if (notes !== null) {
            router.put(`/super-admin/refunds/${id}/status`, { status: newStatus, notes }, {
                preserveScroll: true,
            });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus data pengajuan refund ini?')) {
            router.delete(`/super-admin/refunds/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(amount));
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-md border border-yellow-200 flex items-center gap-1 w-max"><Clock className="w-3 h-3"/> Menunggu Review</span>;
            case 'approved': return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-md border border-blue-200 flex items-center gap-1 w-max"><CheckCircle className="w-3 h-3"/> Disetujui</span>;
            case 'processed': return <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-md border border-green-200 flex items-center gap-1 w-max"><DollarSign className="w-3 h-3"/> Telah Ditransfer</span>;
            case 'rejected': return <span className="px-2.5 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-md border border-red-200 flex items-center gap-1 w-max"><XCircle className="w-3 h-3"/> Ditolak</span>;
            default: return <span className="px-2.5 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-md border border-gray-200">Tidak Diketahui</span>;
        }
    };

    return (
        <AuthenticatedLayout header="Manajemen Refund">
            <Head title="Refunds - Super Admin" />

            <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] overflow-hidden">
                {/* Header Section */}
                <div className="p-6 border-b border-[#E2DDD0] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#FAF8F3] border border-[#E2DDD0] flex items-center justify-center">
                            <RotateCcw className="w-5 h-5 text-[#B8935F]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-serif font-semibold text-[#1C2333]">Pengajuan Pengembalian Dana</h2>
                            <p className="text-xs text-[#8B93A8]">Kelola permintaan refund dari klien/tenant AkademiaOS</p>
                        </div>
                    </div>

                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari sekolah atau No. Invoice..."
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
                                <option value="pending">Menunggu</option>
                                <option value="approved">Disetujui</option>
                                <option value="processed">Telah Ditransfer</option>
                                <option value="rejected">Ditolak</option>
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
                                <th className="px-6 py-4 font-semibold">Institusi / Sekolah</th>
                                <th className="px-6 py-4 font-semibold">Referensi Invoice</th>
                                <th className="px-6 py-4 font-semibold">Nominal Pengembalian</th>
                                <th className="px-6 py-4 font-semibold">Alasan & Catatan</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {refunds.data.length > 0 ? (
                                refunds.data.map((refund) => (
                                    <tr key={refund.id} className="border-b border-[#E2DDD0] hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-[#1C2333]">
                                            {refund.school?.name || 'Sekolah Tidak Ditemukan'}
                                            <div className="text-[10px] text-[#8B93A8] font-normal mt-0.5">
                                                Diajukan: {new Date(refund.created_at).toLocaleDateString('id-ID')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 text-xs text-[#1C2333] bg-gray-100 px-2 py-1 rounded border border-gray-200">
                                                <FileText className="w-3 h-3 text-gray-500" />
                                                {refund.subscriptionInvoice?.invoice_number || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-[#B8935F]">
                                            {formatCurrency(refund.amount)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-[200px]">
                                                <p className="text-xs text-[#1C2333] truncate" title={refund.reason}>
                                                    {refund.reason}
                                                </p>
                                                {refund.notes && (
                                                    <p className="text-[10px] text-[#8B93A8] mt-1 italic border-l-2 border-[#D4AF7A] pl-2">
                                                        Admin: {refund.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(refund.status)}
                                            {refund.processed_at && (
                                                <div className="text-[10px] text-[#8B93A8] mt-1">
                                                    {new Date(refund.processed_at).toLocaleDateString('id-ID')}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <select
                                                    value={refund.status}
                                                    onChange={(e) => handleStatusChange(refund.id, e.target.value)}
                                                    className="text-xs border-[#E2DDD0] focus:border-[#B8935F] focus:ring-[#B8935F] rounded py-1 pl-2 pr-8 shadow-sm"
                                                    disabled={refund.status === 'processed'}
                                                >
                                                    <option value="pending">Set: Menunggu</option>
                                                    <option value="approved">Set: Disetujui</option>
                                                    <option value="processed">Set: Selesai/Transfer</option>
                                                    <option value="rejected">Set: Ditolak</option>
                                                </select>
                                                <button
                                                    onClick={() => handleDelete(refund.id)}
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
                                    <td colSpan={6} className="px-6 py-12 text-center text-[#8B93A8]">
                                        <RotateCcw className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                        <p>Belum ada data pengajuan refund saat ini.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {refunds.last_page > 1 && (
                    <div className="p-4 border-t border-[#E2DDD0] flex justify-center">
                        <div className="flex gap-1">
                            {refunds.links.map((link, index) => (
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