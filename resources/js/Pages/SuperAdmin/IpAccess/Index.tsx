import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Globe, Search, Filter, Trash2, Edit, Plus, X, ShieldCheck, ShieldAlert } from 'lucide-react';

interface IpAccess {
    id: string;
    ip_address: string;
    label: string | null;
    type: 'whitelist' | 'blacklist';
    notes: string | null;
    is_active: boolean;
    created_at: string;
}

interface Props {
    ipAccesses: {
        data: IpAccess[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
        type?: string;
    };
}

export default function IpAccessIndex({ ipAccesses, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [typeFilter, setTypeFilter] = useState(filters.type || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const { data, setData, post, put, delete: destroy, reset, errors, clearErrors } = useForm({
        ip_address: '',
        label: '',
        type: 'blacklist',
        notes: '',
        is_active: true,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/super-admin/ip-accesses', { search, type: typeFilter }, { preserveState: true });
    };

    const openCreateModal = () => {
        clearErrors();
        reset();
        setEditingId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (ip: IpAccess) => {
        clearErrors();
        setData({
            ip_address: ip.ip_address,
            label: ip.label || '',
            type: ip.type,
            notes: ip.notes || '',
            is_active: ip.is_active,
        });
        setEditingId(ip.id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(`/super-admin/ip-accesses/${editingId}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post('/super-admin/ip-accesses', {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleToggleStatus = (id: string) => {
        router.put(`/super-admin/ip-accesses/${id}/toggle-status`, {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus aturan IP ini secara permanen?')) {
            destroy(`/super-admin/ip-accesses/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout header="Security Center">
            <Head title="IP Access - Super Admin" />

            <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] overflow-hidden relative">
                {/* Header Section */}
                <div className="p-6 border-b border-[#E2DDD0] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-serif font-semibold text-[#1C2333]">Kontrol Akses IP</h2>
                            <p className="text-xs text-[#8B93A8]">Kelola Whitelist & Blacklist alamat IP untuk keamanan sistem</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
                            <div className="relative">
                                <Search className="h-4 w-4 text-gray-400 absolute inset-y-0 my-auto left-3" />
                                <input
                                    type="text"
                                    placeholder="Cari alamat IP / Label..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 py-2 text-sm border-[#E2DDD0] focus:border-[#B8935F] focus:ring-[#B8935F] rounded-md shadow-sm w-full sm:w-56"
                                />
                            </div>
                            <div className="relative">
                                <Filter className="h-4 w-4 text-gray-400 absolute inset-y-0 my-auto left-3" />
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="pl-10 py-2 text-sm border-[#E2DDD0] focus:border-[#B8935F] focus:ring-[#B8935F] rounded-md shadow-sm"
                                >
                                    <option value="">Semua Tipe</option>
                                    <option value="whitelist">Whitelist</option>
                                    <option value="blacklist">Blacklist</option>
                                </select>
                            </div>
                            <button type="submit" className="bg-[#FAF8F3] border border-[#E2DDD0] text-[#1C2333] hover:bg-[#E2DDD0] px-3 py-2 rounded-md text-sm transition-colors">
                                Filter
                            </button>
                        </form>
                        <button onClick={openCreateModal} className="bg-[#1C2333] hover:bg-[#2A344A] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
                            <Plus className="w-4 h-4" /> Tambah IP
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-[#5B5648] uppercase bg-[#FAF8F3] border-b border-[#E2DDD0]">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Alamat IP / Label</th>
                                <th className="px-6 py-4 font-semibold">Tipe Aturan</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Catatan</th>
                                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ipAccesses.data.length > 0 ? (
                                ipAccesses.data.map((ip) => (
                                    <tr key={ip.id} className="border-b border-[#E2DDD0] hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-[#1C2333] font-semibold">{ip.ip_address}</div>
                                            {ip.label && <div className="text-[11px] text-[#8B93A8] mt-0.5">{ip.label}</div>}
                                        </td>
                                        <td className="px-6 py-4">
                                            {ip.type === 'whitelist' ? (
                                                <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-md border border-green-200 flex items-center gap-1 w-max">
                                                    <ShieldCheck className="w-3.5 h-3.5" /> Whitelist
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-md border border-red-200 flex items-center gap-1 w-max">
                                                    <ShieldAlert className="w-3.5 h-3.5" /> Blacklist
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleStatus(ip.id)}
                                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-[#B8935F] focus:ring-offset-2 transition-colors duration-200 ease-in-out ${
                                                    ip.is_active ? 'bg-[#1C2333]' : 'bg-gray-200'
                                                }`}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                        ip.is_active ? 'translate-x-2' : '-translate-x-2'
                                                    }`}
                                                />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-[#5B5648] max-w-[200px] truncate">
                                            {ip.notes || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(ip)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(ip.id)}
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
                                        <Globe className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                        <p>Belum ada aturan akses IP saat ini.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {ipAccesses.last_page > 1 && (
                    <div className="p-4 border-t border-[#E2DDD0] flex justify-center">
                        <div className="flex gap-1">
                            {ipAccesses.links.map((link, index) => (
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

            {/* Modal Create/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-lg flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-[#E2DDD0]">
                            <h3 className="text-lg font-serif font-semibold text-[#1C2333]">
                                {editingId ? 'Edit Aturan IP' : 'Tambah Aturan IP Baru'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5">
                            <form id="ipAccessForm" onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1C2333] mb-1">Alamat IP (IPv4 / IPv6)</label>
                                    <input
                                        type="text"
                                        value={data.ip_address}
                                        onChange={(e) => setData('ip_address', e.target.value)}
                                        className="w-full rounded-md border-[#E2DDD0] shadow-sm focus:border-[#B8935F] focus:ring-[#B8935F] text-sm font-mono placeholder:font-sans"
                                        placeholder="Contoh: 192.168.1.100"
                                        required
                                    />
                                    {errors.ip_address && <span className="text-xs text-red-500 mt-1">{errors.ip_address}</span>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#1C2333] mb-1">Tipe Aturan</label>
                                        <select
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value as 'whitelist' | 'blacklist')}
                                            className="w-full rounded-md border-[#E2DDD0] shadow-sm focus:border-[#B8935F] focus:ring-[#B8935F] text-sm"
                                        >
                                            <option value="blacklist">Blacklist (Blokir)</option>
                                            <option value="whitelist">Whitelist (Izinkan)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#1C2333] mb-1">Status</label>
                                        <select
                                            value={data.is_active ? '1' : '0'}
                                            onChange={(e) => setData('is_active', e.target.value === '1')}
                                            className="w-full rounded-md border-[#E2DDD0] shadow-sm focus:border-[#B8935F] focus:ring-[#B8935F] text-sm"
                                        >
                                            <option value="1">Aktif</option>
                                            <option value="0">Nonaktif</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1C2333] mb-1">Label / Nama Pemilik IP (Opsional)</label>
                                    <input
                                        type="text"
                                        value={data.label}
                                        onChange={(e) => setData('label', e.target.value)}
                                        className="w-full rounded-md border-[#E2DDD0] shadow-sm focus:border-[#B8935F] focus:ring-[#B8935F] text-sm"
                                        placeholder="Contoh: Koneksi Kantor Cabang"
                                    />
                                    {errors.label && <span className="text-xs text-red-500 mt-1">{errors.label}</span>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1C2333] mb-1">Catatan Tambahan (Opsional)</label>
                                    <textarea
                                        rows={3}
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        className="w-full rounded-md border-[#E2DDD0] shadow-sm focus:border-[#B8935F] focus:ring-[#B8935F] text-sm"
                                        placeholder="Tambahkan informasi mengapa IP ini diblokir/diizinkan..."
                                    ></textarea>
                                </div>
                            </form>
                        </div>
                        <div className="p-5 border-t border-[#E2DDD0] flex justify-end gap-3 bg-gray-50 rounded-b-xl">
                            <button onClick={closeModal} type="button" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                                Batal
                            </button>
                            <button form="ipAccessForm" type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#1C2333] rounded-md hover:bg-[#2A344A] transition-colors">
                                Simpan Aturan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}