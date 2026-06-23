import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Languages, Search, Trash2, Edit, Plus, X, CheckCircle, Globe } from 'lucide-react';

interface Language {
    id: string;
    code: string;
    name: string;
    is_default: boolean;
    is_active: boolean;
    created_at: string;
}

interface Props {
    languages: {
        data: Language[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
    };
}

export default function LocalizationIndex({ languages, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const { data, setData, post, put, delete: destroy, reset, errors, clearErrors } = useForm({
        code: '',
        name: '',
        is_active: true,
        is_default: false,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/super-admin/localization', { search }, { preserveState: true });
    };

    const openCreateModal = () => {
        clearErrors();
        reset();
        setEditingId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (language: Language) => {
        clearErrors();
        setData({
            code: language.code,
            name: language.name,
            is_active: language.is_active,
            is_default: language.is_default,
        });
        setEditingId(language.id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(`/super-admin/localization/${editingId}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post('/super-admin/localization', {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleSetDefault = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menjadikan bahasa ini sebagai bahasa utama sistem?')) {
            router.put(`/super-admin/localization/${id}/default`, {}, { preserveScroll: true });
        }
    };

    const handleDelete = (id: string, isDefault: boolean) => {
        if (isDefault) {
            alert('Tidak dapat menghapus bahasa utama. Silakan jadikan bahasa lain sebagai utama terlebih dahulu.');
            return;
        }
        if (confirm('Apakah Anda yakin ingin menghapus bahasa ini secara permanen?')) {
            destroy(`/super-admin/localization/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout header="System Settings">
            <Head title="Localization - Super Admin" />

            <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] overflow-hidden relative">
                {/* Header Section */}
                <div className="p-6 border-b border-[#E2DDD0] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#FAF8F3] border border-[#E2DDD0] flex items-center justify-center">
                            <Languages className="w-5 h-5 text-[#B8935F]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-serif font-semibold text-[#1C2333]">Localization (Bahasa)</h2>
                            <p className="text-xs text-[#8B93A8]">Kelola bahasa sistem yang tersedia untuk tenant</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                        <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
                            <Search className="h-4 w-4 text-gray-400 absolute inset-y-0 my-auto left-3" />
                            <input
                                type="text"
                                placeholder="Cari bahasa atau kode..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 py-2 text-sm border-[#E2DDD0] focus:border-[#B8935F] focus:ring-[#B8935F] rounded-md shadow-sm w-full sm:w-56"
                            />
                        </form>
                        <button onClick={openCreateModal} className="bg-[#1C2333] hover:bg-[#2A344A] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
                            <Plus className="w-4 h-4" /> Tambah Bahasa
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-[#5B5648] uppercase bg-[#FAF8F3] border-b border-[#E2DDD0]">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Nama Bahasa</th>
                                <th className="px-6 py-4 font-semibold">Kode (ISO)</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {languages.data.length > 0 ? (
                                languages.data.map((lang) => (
                                    <tr key={lang.id} className="border-b border-[#E2DDD0] hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-[#1C2333]">{lang.name}</span>
                                                {lang.is_default && (
                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded uppercase tracking-wider flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" /> Default
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono bg-gray-100 px-2 py-1 rounded border border-gray-200 text-[#5B5648] text-xs uppercase">
                                                {lang.code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border flex items-center gap-1 w-max ${
                                                lang.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                                            }`}>
                                                {lang.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {!lang.is_default && lang.is_active && (
                                                    <button
                                                        onClick={() => handleSetDefault(lang.id)}
                                                        className="text-xs text-blue-600 hover:bg-blue-50 px-2 py-1.5 rounded-md transition-colors border border-transparent hover:border-blue-200 font-medium"
                                                    >
                                                        Set Utama
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => openEditModal(lang)}
                                                    className="p-1.5 text-[#5B5648] hover:bg-gray-100 rounded-md transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(lang.id, lang.is_default)}
                                                    disabled={lang.is_default}
                                                    className={`p-1.5 rounded-md transition-colors ${
                                                        lang.is_default ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'
                                                    }`}
                                                    title={lang.is_default ? "Bahasa utama tidak dapat dihapus" : "Hapus"}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-[#8B93A8]">
                                        <Globe className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                        <p>Belum ada data bahasa.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {languages.last_page > 1 && (
                    <div className="p-4 border-t border-[#E2DDD0] flex justify-center">
                        <div className="flex gap-1">
                            {languages.links.map((link, index) => (
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
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-[#E2DDD0]">
                            <h3 className="text-lg font-serif font-semibold text-[#1C2333]">
                                {editingId ? 'Edit Bahasa' : 'Tambah Bahasa Baru'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5">
                            <form id="languageForm" onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1C2333] mb-1">Nama Bahasa</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full rounded-md border-[#E2DDD0] shadow-sm focus:border-[#B8935F] focus:ring-[#B8935F] text-sm"
                                        placeholder="Contoh: Bahasa Indonesia"
                                        required
                                    />
                                    {errors.name && <span className="text-xs text-red-500 mt-1">{errors.name}</span>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1C2333] mb-1">Kode ISO Bahasa</label>
                                    <input
                                        type="text"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value.toLowerCase())}
                                        className="w-full rounded-md border-[#E2DDD0] shadow-sm focus:border-[#B8935F] focus:ring-[#B8935F] text-sm font-mono"
                                        placeholder="Contoh: id, en, ar"
                                        required
                                    />
                                    {errors.code && <span className="text-xs text-red-500 mt-1">{errors.code}</span>}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="is_active"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="rounded border-gray-300 text-[#B8935F] focus:ring-[#B8935F]"
                                        />
                                        <label htmlFor="is_active" className="text-sm text-[#1C2333]">Status Aktif</label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="is_default"
                                            checked={data.is_default}
                                            onChange={(e) => setData('is_default', e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="is_default" className="text-sm text-[#1C2333]">Jadikan Utama</label>
                                    </div>
                                </div>
                                {data.is_default && (
                                    <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-100 mt-2">
                                        Mencentang ini akan membatalkan bahasa utama yang sudah ada sebelumnya.
                                    </p>
                                )}
                            </form>
                        </div>
                        <div className="p-5 border-t border-[#E2DDD0] flex justify-end gap-3 bg-gray-50 rounded-b-xl">
                            <button onClick={closeModal} type="button" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                                Batal
                            </button>
                            <button form="languageForm" type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#1C2333] rounded-md hover:bg-[#2A344A] transition-colors">
                                Simpan Bahasa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}