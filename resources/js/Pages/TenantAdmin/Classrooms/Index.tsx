import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Search, Plus, Edit2, Trash2, X, AlertTriangle, School as SchoolIcon, Users } from 'lucide-react';

interface Classroom {
    id: string;
    name: string;
    level: string | null;
    capacity: number;
}

interface Props {
    classrooms: {
        data: Classroom[];
        current_page: number;
        last_page: number;
        links: any[];
    };
    filters: {
        search?: string;
    };
}

export default function Index({ classrooms, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<Classroom | null>(null);
    const [recordToDelete, setRecordToDelete] = useState<Classroom | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        level: '',
        capacity: 30, // Default nilai capacity seperti di migrasi
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/master-data/classrooms', { search }, { preserveState: true });
    };

    const openCreateModal = () => {
        clearErrors();
        reset();
        setEditingRecord(null);
        setIsModalOpen(true);
    };

    const openEditModal = (record: Classroom) => {
        clearErrors();
        setEditingRecord(record);
        setData({
            name: record.name,
            level: record.level || '',
            capacity: record.capacity,
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
            put(`/master-data/classrooms/${editingRecord.id}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post('/master-data/classrooms', {
                onSuccess: () => closeModal(),
            });
        }
    };

    const confirmDelete = (record: Classroom) => {
        setRecordToDelete(record);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = () => {
        if (recordToDelete) {
            destroy(`/master-data/classrooms/${recordToDelete.id}`, {
                onSuccess: () => setIsDeleteModalOpen(false),
            });
        }
    };

    return (
        <AuthenticatedLayout header="Kelas & Ruangan">
            <Head title="Kelas & Ruangan" />

            <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] overflow-hidden">
                {/* Header Action */}
                <div className="p-5 border-b border-[#E2DDD0] flex flex-col sm:flex-row justify-between items-center gap-4">
                    <form onSubmit={handleSearch} className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A296]" />
                        <input
                            type="text"
                            placeholder="Cari nama atau tingkat kelas..."
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
                        Tambah Kelas
                    </button>
                </div>

                {/* Table Data */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#5B5648]">
                        <thead className="bg-[#FAF8F3] text-[#16213E] font-semibold border-b border-[#E2DDD0]">
                            <tr>
                                <th className="px-6 py-4">Nama Kelas / Ruangan</th>
                                <th className="px-6 py-4">Tingkat (Level)</th>
                                <th className="px-6 py-4">Kapasitas Maksimal</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2DDD0]">
                            {classrooms.data.length > 0 ? (
                                classrooms.data.map((record) => (
                                    <tr key={record.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-[#16213E]">{record.name}</td>
                                        <td className="px-6 py-4">
                                            {record.level ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#FAF8F3] border border-[#E2DDD0] text-xs font-medium text-[#5B5648]">
                                                    Tingkat {record.level}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-[#5B5648]">
                                                <Users className="w-4 h-4 mr-2 text-[#A8A296]" />
                                                <span>{record.capacity} Siswa</span>
                                            </div>
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
                                    <td colSpan={4} className="px-6 py-12 text-center text-[#8B93A8]">
                                        <SchoolIcon className="w-12 h-12 mx-auto text-[#E2DDD0] mb-3" />
                                        Belum ada data kelas atau ruangan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {classrooms.links && classrooms.links.length > 3 && (
                    <div className="p-4 border-t border-[#E2DDD0] flex justify-end">
                        <div className="flex gap-1">
                            {classrooms.links.map((link, k) => (
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
                                {editingRecord ? 'Edit Kelas / Ruangan' : 'Tambah Kelas / Ruangan'}
                            </h3>
                            <button onClick={closeModal} className="text-[#8B93A8] hover:text-[#16213E]">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#5B5648] mb-1">Nama Kelas / Ruangan</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={`w-full px-4 py-2 bg-[#FAF8F3] border rounded-lg text-sm focus:ring-1 outline-none transition-all ${errors.name ? 'border-red-400 focus:border-red-400' : 'border-[#E2DDD0] focus:border-[#B8935F]'}`}
                                    placeholder="Contoh: X MIPA 1, Ruang Teori A, dll"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Tingkat (Level)</label>
                                    <input
                                        type="text"
                                        value={data.level}
                                        onChange={(e) => setData('level', e.target.value)}
                                        className={`w-full px-4 py-2 bg-[#FAF8F3] border rounded-lg text-sm focus:ring-1 outline-none transition-all ${errors.level ? 'border-red-400 focus:border-red-400' : 'border-[#E2DDD0] focus:border-[#B8935F]'}`}
                                        placeholder="Contoh: 10, 11, XII"
                                    />
                                    {errors.level && <p className="text-red-500 text-xs mt-1">{errors.level}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Kapasitas Maksimal</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={data.capacity}
                                            onChange={(e) => setData('capacity', parseInt(e.target.value) || 0)}
                                            min="1"
                                            className={`w-full pl-4 pr-12 py-2 bg-[#FAF8F3] border rounded-lg text-sm focus:ring-1 outline-none transition-all ${errors.capacity ? 'border-red-400 focus:border-red-400' : 'border-[#E2DDD0] focus:border-[#B8935F]'}`}
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#A8A296] pointer-events-none">
                                            Siswa
                                        </span>
                                    </div>
                                    {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
                                </div>
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
                            Apakah Anda yakin ingin menghapus Kelas <span className="font-semibold text-[#16213E]">{recordToDelete?.name}</span>?
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
