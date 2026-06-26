import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShoppingCart, Search, Filter, Trash2, CheckCircle2, Clock, XCircle, FileText, Download } from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
}

interface SourceCode {
    id: string;
    title: string;
}

interface Order {
    id: string;
    order_number: string;
    user: User;
    sourceCode: SourceCode;
    amount: string;
    payment_method: string | null;
    payment_proof: string | null;
    status: 'pending' | 'paid' | 'failed' | 'cancelled';
    created_at: string;
}

interface Props {
    orders: { data: Order[]; links: any[]; current_page: number; last_page: number; };
    filters: { search?: string; status?: string; };
}

export default function SourceCodeOrderIndex({ orders, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/super-admin/source-code-orders', { search, status: statusFilter }, { preserveState: true });
    };

    const handleStatusChange = (id: string, newStatus: string) => {
        if (confirm(`Apakah Anda yakin ingin mengubah status pesanan ini menjadi ${newStatus.toUpperCase()}?`)) {
            router.put(`/super-admin/source-code-orders/${id}/status`, { status: newStatus }, { preserveScroll: true });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus data transaksi ini secara permanen?')) {
            router.delete(`/super-admin/source-code-orders/${id}`, { preserveScroll: true });
        }
    };

    const formatCurrency = (val: string) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(val));

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-md border border-yellow-200 flex items-center gap-1 w-max"><Clock className="w-3.5 h-3.5"/> Menunggu</span>;
            case 'paid': return <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-md border border-green-200 flex items-center gap-1 w-max"><CheckCircle2 className="w-3.5 h-3.5"/> Lunas (Paid)</span>;
            case 'failed': return <span className="px-2.5 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-md border border-red-200 flex items-center gap-1 w-max"><XCircle className="w-3.5 h-3.5"/> Gagal</span>;
            case 'cancelled': return <span className="px-2.5 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-md border border-gray-300 flex items-center gap-1 w-max"><XCircle className="w-3.5 h-3.5"/> Dibatalkan</span>;
            default: return <span className="px-2.5 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-md border border-gray-200">Unknown</span>;
        }
    };

    return (
        <AuthenticatedLayout header="Transaksi Source Code">
            <Head title="Penjualan Produk - Super Admin" />

            <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] overflow-hidden">
                {/* Header Section */}
                <div className="p-6 border-b border-[#E2DDD0] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#FAF8F3] border border-[#E2DDD0] flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-[#B8935F]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-serif font-semibold text-[#1C2333]">Transaksi (Orders)</h2>
                            <p className="text-xs text-[#8B93A8]">Pantau penjualan dan status pembayaran produk digital (Source Code)</p>
                        </div>
                    </div>

                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-center">
                        <div className="relative w-full sm:w-auto">
                            <Search className="h-4 w-4 text-gray-400 absolute inset-y-0 my-auto left-3" />
                            <input type="text" placeholder="Cari Order ID / Pembeli..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 py-2 text-sm border-[#E2DDD0] focus:border-[#B8935F] rounded-md shadow-sm w-full sm:w-56" />
                        </div>
                        <div className="relative w-full sm:w-auto">
                            <Filter className="h-4 w-4 text-gray-400 absolute inset-y-0 my-auto left-3" />
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="pl-10 py-2 text-sm border-[#E2DDD0] focus:border-[#B8935F] rounded-md shadow-sm w-full sm:w-40">
                                <option value="">Semua Status</option>
                                <option value="pending">Menunggu Bayar</option>
                                <option value="paid">Lunas (Paid)</option>
                                <option value="failed">Gagal</option>
                                <option value="cancelled">Dibatalkan</option>
                            </select>
                        </div>
                        <button type="submit" className="bg-[#1C2333] hover:bg-[#2A344A] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors w-full sm:w-auto">
                            Filter
                        </button>
                    </form>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-[#5B5648] uppercase bg-[#FAF8F3] border-b border-[#E2DDD0]">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Order Detail</th>
                                <th className="px-6 py-4 font-semibold">Produk Dibeli</th>
                                <th className="px-6 py-4 font-semibold">Pembeli</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.data.length > 0 ? orders.data.map((order) => (
                                <tr key={order.id} className="border-b border-[#E2DDD0] hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-mono font-semibold text-[#1C2333] flex items-center gap-1.5 mb-1"><FileText className="w-3.5 h-3.5 text-[#8B93A8]"/> {order.order_number}</div>
                                        <div className="text-[11px] text-[#8B93A8]">{new Date(order.created_at).toLocaleString('id-ID')}</div>
                                        <div className="font-semibold text-green-700 mt-1">{formatCurrency(order.amount)}</div>
                                        {order.payment_method && <div className="text-[10px] text-gray-500 uppercase mt-0.5 border border-gray-200 bg-white px-1.5 py-0.5 rounded w-max">{order.payment_method.replace('_', ' ')}</div>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-[#1C2333]">{order.sourceCode?.title || 'Produk Dihapus'}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-[#1C2333]">{order.user?.name || 'User Dihapus'}</p>
                                        <p className="text-xs text-[#8B93A8]">{order.user?.email || '-'}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(order.status)}
                                        {order.payment_proof && (
                                            <a href={order.payment_proof} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] text-blue-600 hover:underline mt-2 font-medium">
                                                <Download className="w-3 h-3" /> Bukti Bayar
                                            </a>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className="text-xs border-[#E2DDD0] focus:border-[#B8935F] focus:ring-[#B8935F] rounded py-1 pl-2 pr-8 shadow-sm"
                                                disabled={order.status === 'paid' || order.status === 'cancelled'}
                                            >
                                                <option value="pending">Set: Menunggu</option>
                                                <option value="paid">Set: Lunas (Paid)</option>
                                                <option value="failed">Set: Gagal</option>
                                                <option value="cancelled">Set: Dibatalkan</option>
                                            </select>
                                            <button onClick={() => handleDelete(order.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Hapus">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[#8B93A8]">
                                        <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                        <p>Belum ada data transaksi penjualan saat ini.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {orders.last_page > 1 && (
                    <div className="p-4 border-t border-[#E2DDD0] flex justify-center">
                        <div className="flex gap-1">
                            {orders.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    className={`px-3 py-1 text-sm border rounded-md ${link.active ? 'bg-[#1C2333] text-white border-[#1C2333]' : 'bg-white text-[#5B5648] border-[#E2DDD0] hover:bg-gray-50'} disabled:opacity-50 disabled:cursor-not-allowed`}
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