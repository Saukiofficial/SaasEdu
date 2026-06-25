import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Search, Plus, Edit2, Trash2, X, AlertTriangle, BriefcaseBusiness, Filter } from 'lucide-react';

interface Teacher {
    id: string;
    nip: string | null;
    name: string;
    gender: 'L' | 'P';
    birth_place: string | null;
    birth_date: string | null;
    address: string | null;
    phone: string | null;
    status: 'active' | 'inactive' | 'retired';
}

interface Props {
    teachers: {
        data: Teacher[];
        current_page: number;
        last_page: number;
        links: any[];
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function Index({ teachers, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<Teacher | null>(null);
    const [recordToDelete, setRecordToDelete] = useState<Teacher | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        nip: '',
        name: '',
        gender: 'L' as 'L' | 'P',
        birth_place: '',
        birth_date: '',
        address: '',
        phone: '',
        status: 'active' as 'active' | 'inactive' | 'retired',
    });

    const applyFilters = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get('/teachers', { search, status: statusFilter }, { preserveState: true });
    };

    const openCreateModal = () => {
        clearErrors();
        reset();
        setEditingRecord(null);
        setIsModalOpen(true);
    };

    const openEditModal = (record: Teacher) => {
        clearErrors();
        setEditingRecord(record);
        setData({
            nip: record.nip || '',
            name: record.name,
            gender: record.gender,
            birth_place: record.birth_place || '',
            birth_date: record.birth_date || '',
            address: record.address || '',
            phone: record.phone || '',
            status: record.status,
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
            put(`/teachers/${editingRecord.id}`, { onSuccess: () => closeModal() });
        } else {
            post('/teachers', { onSuccess: () => closeModal() });
        }
    };

    const confirmDelete = (record: Teacher) => {
        setRecordToDelete(record);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = () => {
        if (recordToDelete) {
            destroy(`/teachers/${recordToDelete.id}`, { onSuccess: () => setIsDeleteModalOpen(false) });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return <span className="px-2 py-1 bg-green-100 text-green-700 text-[11px] rounded-full font-semibold uppercase tracking-wide">Aktif Mengajar</span>;
            case 'inactive': return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-[11px] rounded-full font-semibold uppercase tracking-wide">Cuti / Nonaktif</span>;
            case 'retired': return <span className="px-2 py-1 bg-purple-100 text-purple-700 text-[11px] rounded-full font-semibold uppercase tracking-wide">Pensiun</span>;
            default: return null;
        }
    };

    return (
        <AuthenticatedLayout header="Data Guru">
            <Head title="Data Guru" />

            <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] overflow-hidden">
                {/* Header Action & Filter */}
                <div className="p-5 border-b border-[#E2DDD0] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <form onSubmit={applyFilters} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A296]" />
                            <input
                                type="text"
                                placeholder="Cari nama atau NIP guru..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none transition-all"
                            />
                        </div>
                        <div className="relative w-full sm:w-48">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A296]" />
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    router.get('/teachers', { search, status: e.target.value }, { preserveState: true });
                                }}
                                className="w-full pl-9 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none appearance-none transition-all"
                            >
                                <option value="">Semua Status</option>
                                <option value="active">Aktif Mengajar</option>
                                <option value="inactive">Cuti / Nonaktif</option>
                                <option value="retired">Pensiun</option>
                            </select>
                        </div>
                        <button type="submit" className="hidden">Filter</button>
                    </form>

                    <button
                        onClick={openCreateModal}
                        className="w-full md:w-auto bg-[#16213E] hover:bg-[#1C2A4F] text-[#D4AF7A] px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Data Guru
                    </button>
                </div>

                {/* Table Data */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#5B5648]">
                        <thead className="bg-[#FAF8F3] text-[#16213E] font-semibold border-b border-[#E2DDD0]">
                            <tr>
                                <th className="px-6 py-4">NIP</th>
                                <th className="px-6 py-4">Nama Guru</th>
                                <th className="px-6 py-4">L/P</th>
                                <th className="px-6 py-4">Kontak</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2DDD0]">
                            {teachers.data.length > 0 ? (
                                teachers.data.map((record) => (
                                    <tr key={record.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-[#16213E]">{record.nip || '-'}</td>
                                        <td className="px-6 py-4 font-semibold text-[#16213E]">{record.name}</td>
                                        <td className="px-6 py-4">{record.gender}</td>
                                        <td className="px-6 py-4">{record.phone || <span className="text-gray-400 italic">Kosong</span>}</td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(record.status)}
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
                                    <td colSpan={6} className="px-6 py-12 text-center text-[#8B93A8]">
                                        <BriefcaseBusiness className="w-12 h-12 mx-auto text-[#E2DDD0] mb-3" />
                                        Belum ada data guru.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {teachers.links && teachers.links.length > 3 && (
                    <div className="p-4 border-t border-[#E2DDD0] flex justify-end">
                        <div className="flex gap-1">
                            {teachers.links.map((link, k) => (
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1020]/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden my-auto">
                        <div className="px-6 py-4 border-b border-[#E2DDD0] flex justify-between items-center bg-[#FAF8F3] sticky top-0 z-10">
                            <h3 className="font-serif font-semibold text-[#16213E]">
                                {editingRecord ? 'Edit Data Guru' : 'Tambah Data Guru'}
                            </h3>
                            <button onClick={closeModal} className="text-[#8B93A8] hover:text-[#16213E]">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={submit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                {/* Baris 1 */}
                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Nomor Induk Pegawai (NIP)</label>
                                    <input type="text" value={data.nip} onChange={e => setData('nip', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none" placeholder="Isi jika ASN/PNS" />
                                    {errors.nip && <p className="text-red-500 text-xs mt-1">{errors.nip}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Nama Lengkap & Gelar <span className="text-red-500">*</span></label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none" required placeholder="Contoh: Budi Santoso, S.Pd." />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                {/* Baris 2 */}
                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Jenis Kelamin</label>
                                    <select value={data.gender} onChange={e => setData('gender', e.target.value as 'L'|'P')} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none">
                                        <option value="L">Laki-laki</option>
                                        <option value="P">Perempuan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Nomor Handphone / WA</label>
                                    <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" />
                                </div>

                                {/* Baris 3 */}
                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Tempat Lahir</label>
                                    <input type="text" value={data.birth_place} onChange={e => setData('birth_place', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Tanggal Lahir</label>
                                    <input type="date" value={data.birth_date} onChange={e => setData('birth_date', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" />
                                </div>

                                {/* Baris 4 */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Alamat Domisili</label>
                                    <textarea value={data.address} onChange={e => setData('address', e.target.value)} rows={2} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none resize-none"></textarea>
                                </div>

                                {/* Baris 5 */}
                                <div className="md:col-span-2 pt-2 border-t border-[#E2DDD0] mt-2">
                                    <label className="block text-sm font-medium text-[#5B5648] mb-2">Status Kepegawaian</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 text-sm text-[#1C2333]">
                                            <input type="radio" name="status" value="active" checked={data.status === 'active'} onChange={e => setData('status', 'active')} className="text-[#B8935F] focus:ring-[#B8935F]" />
                                            Aktif Mengajar
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-[#1C2333]">
                                            <input type="radio" name="status" value="inactive" checked={data.status === 'inactive'} onChange={e => setData('status', 'inactive')} className="text-[#B8935F] focus:ring-[#B8935F]" />
                                            Cuti / Nonaktif
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-[#1C2333]">
                                            <input type="radio" name="status" value="retired" checked={data.status === 'retired'} onChange={e => setData('status', 'retired')} className="text-[#B8935F] focus:ring-[#B8935F]" />
                                            Pensiun
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end gap-3 mt-4">
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
                        <h3 className="font-serif font-semibold text-lg text-[#16213E] mb-2">Hapus Data Guru?</h3>
                        <p className="text-sm text-[#8B93A8] mb-6">
                            Yakin ingin menghapus <span className="font-semibold text-[#16213E]">{recordToDelete?.name}</span>? Data yang dihapus tidak dapat dikembalikan.
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