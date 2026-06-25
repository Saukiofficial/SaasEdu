import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Search, Plus, Edit2, Trash2, X, AlertTriangle, BookOpen } from 'lucide-react';

interface Subject {
    id: string;
    code: string | null;
    name: string;
    type: string;
    is_active: boolean;
}

interface Props {
    subjects: {
        data: Subject[];
        current_page: number;
        last_page: number;
        links: any[];
    };
    filters: {
        search?: string;
    };
}

export default function Index({ subjects, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<Subject | null>(null);
    const [recordToDelete, setRecordToDelete] = useState<Subject | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        code: '',
        name: '',
        type: 'Wajib',
        is_active: true,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/master-data/subjects', { search }, { preserveState: true });
    };

    const openCreateModal = () => {
        clearErrors();
        reset();
        setEditingRecord(null);
        setIsModalOpen(true);
    };

    const openEditModal = (record: Subject) => {
        clearErrors();
        setEditingRecord(record);
        setData({
            code: record.code || '',
            name: record.name,
            type: record.type,
            is_active: record.is_active,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRecord) {
            put(`/master-data/subjects/${editingRecord.id}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post('/master-data/subjects', {
                onSuccess: () => closeModal(),
            });
        }
    };

    const confirmDelete = (record: Subject) => {
        setRecordToDelete(record);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = () => {
        if (recordToDelete) {
            destroy(`/master-data/subjects/${recordToDelete.id}`, {
                onSuccess: () => setIsDeleteModalOpen(false),
            });
        }
    };

    return (
        <AuthenticatedLayout header="Mata Pelajaran">
            <Head title="Mata Pelajaran" />

            <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] overflow-hidden">
                {/* Header Action */}
                <div className="p-5 border-b border-[#E2DDD0] flex flex-col sm:flex-row justify-between items-center gap-4">
                    <form onSubmit={handleSearch} className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A296]" />
                        <input
                            type="text"
                            placeholder="Cari kode atau nama mata pelajaran..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-all"
                        />
                    </form>

                    <button
                        onClick={openCreateModal}
                        className="w-full sm:w-auto bg-[#16213E] hover:bg-[#1C2A4F] text-[#D4AF7A] px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Mata Pelajaran
                    </button>
                </div>

                {/* Table Data */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#5B5648]">
                        <thead className="bg-[#FAF8F3] text-[#16213E] font-semibold border-b border-[#E2DDD0]">
                            <tr>
                                <th className="px-6 py-4">Kode</th>
                                <th className="px-6 py-4">Nama Pelajaran</th>
                                <th className="px-6 py-4">Tipe / Kelompok</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2DDD0]">
                            {subjects.data.length > 0 ? (
                                subjects.data.map((record) => (
                                    <tr key={record.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-[#16213E]">{record.code || '-'}</td>
                                        <td className="px-6 py-4 font-semibold text-[#16213E]">{record.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#FAF8F3] border border-[#E2DDD0] text-xs font-medium">
                                                {record.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase ${record.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {record.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEditModal(record)} className="p-1.5 text-[#8B93A8] hover:text-[#B8935F] hover:bg-[#FAF8F3] rounded-md transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => confirmDelete(record)} className="p-1.5 text-[#8B93A8] hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[#8B93A8]">
                                        <BookOpen className="w-12 h-12 mx-auto text-[#E2DDD0] mb-3" />
                                        Belum ada data mata pelajaran.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {subjects.links && subjects.links.length > 3 && (
                    <div className="p-4 border-t border-[#E2DDD0] flex justify-end">
                        <div className="flex gap-1">
                            {subjects.links.map((link, k) => (
                                <button
                                    key={k}
                                    disabled={link.url === null}
                                    onClick={() => router.get(link.url)}
                                    className={`px-3 py-1 text-sm rounded ${link.active ? 'bg-[#16213E] text-[#D4AF7A]' : 'text-[#5B5648] hover:bg-[#FAF8F3]'} disabled:opacity-50`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1020]/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#E2DDD0] flex justify-between items-center bg-[#FAF8F3]">
                            <h3 className="font-serif font-semibold text-[#16213E]">
                                {editingRecord ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
                            </h3>
                            <button onClick={closeModal} className="text-[#8B93A8] hover:text-[#16213E]">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Kode (Opsional)</label>
                                    <input
                                        type="text"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                        className={`w-full px-4 py-2 bg-[#FAF8F3] border rounded-lg text-sm focus:ring-1 outline-none transition-all ${errors.code ? 'border-red-400 focus:border-red-400' : 'border-[#E2DDD0] focus:border-[#B8935F]'}`}
                                        placeholder="MAT-01"
                                    />
                                    {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Nama Mata Pelajaran</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={`w-full px-4 py-2 bg-[#FAF8F3] border rounded-lg text-sm focus:ring-1 outline-none transition-all ${errors.name ? 'border-red-400 focus:border-red-400' : 'border-[#E2DDD0] focus:border-[#B8935F]'}`}
                                        placeholder="Contoh: Matematika"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-[#5B5648] mb-1">Kelompok / Tipe</label>
                                <select
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-all"
                                >
                                    <option value="Wajib">Wajib (Muatan Nasional)</option>
                                    <option value="Peminatan">Peminatan (Kejuruan/Jurusan)</option>
                                    <option value="Muatan Lokal">Muatan Lokal</option>
                                </select>
                                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="rounded border-[#E2DDD0] text-[#B8935F] focus:ring-[#B8935F] w-4 h-4"
                                />
                                <label htmlFor="is_active" className="text-sm text-[#5B5648] select-none">
                                    Mata Pelajaran Aktif
                                </label>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-[#E2DDD0] mt-6">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-[#5B5648] hover:bg-[#FAF8F3] rounded-lg transition-colors">
                                    Batal
                                </button>
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-[#B8935F] hover:bg-[#A37F4B] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-70">
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1020]/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="font-serif font-semibold text-lg text-[#16213E] mb-2">Hapus Data?</h3>
                        <p className="text-sm text-[#8B93A8] mb-6">
                            Apakah Anda yakin ingin menghapus Mata Pelajaran <span className="font-semibold text-[#16213E]">{recordToDelete?.name}</span>?
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-[#5B5648] bg-[#FAF8F3] hover:bg-[#E2DDD0] rounded-lg transition-colors">
                                Batal
                            </button>
                            <button onClick={executeDelete} disabled={processing} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-70">
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
