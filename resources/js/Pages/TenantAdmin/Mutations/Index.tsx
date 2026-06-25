import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Search, Plus, Edit2, Trash2, X, AlertTriangle, RotateCcw, Filter, FileText } from 'lucide-react';

interface Student {
    id: string;
    name: string;
    nis: string | null;
}

interface Mutation {
    id: string;
    student_id: string;
    type: 'Masuk' | 'Keluar';
    mutation_date: string;
    reference_number: string | null;
    origin_school: string | null;
    destination_school: string | null;
    reason: string | null;
    student?: Student;
}

interface Props {
    mutations: {
        data: Mutation[];
        current_page: number;
        last_page: number;
        links: any[];
    };
    students: Student[];
    filters: {
        search?: string;
        type?: string;
    };
}

export default function Index({ mutations, students, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [typeFilter, setTypeFilter] = useState(filters.type || '');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<Mutation | null>(null);
    const [recordToDelete, setRecordToDelete] = useState<Mutation | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        student_id: '',
        type: 'Keluar' as 'Masuk' | 'Keluar',
        mutation_date: new Date().toISOString().split('T')[0],
        reference_number: '',
        origin_school: '',
        destination_school: '',
        reason: '',
    });

    const applyFilters = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get('/mutations', { search, type: typeFilter }, { preserveState: true });
    };

    const openCreateModal = () => {
        clearErrors();
        reset();
        setEditingRecord(null);
        setIsModalOpen(true);
    };

    const openEditModal = (record: Mutation) => {
        clearErrors();
        setEditingRecord(record);
        setData({
            student_id: record.student_id,
            type: record.type,
            mutation_date: record.mutation_date,
            reference_number: record.reference_number || '',
            origin_school: record.origin_school || '',
            destination_school: record.destination_school || '',
            reason: record.reason || '',
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
            put(`/mutations/${editingRecord.id}`, { onSuccess: () => closeModal() });
        } else {
            post('/mutations', { onSuccess: () => closeModal() });
        }
    };

    const confirmDelete = (record: Mutation) => {
        setRecordToDelete(record);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = () => {
        if (recordToDelete) {
            destroy(`/mutations/${recordToDelete.id}`, { onSuccess: () => setIsDeleteModalOpen(false) });
        }
    };

    return (
        <AuthenticatedLayout header="Mutasi Siswa">
            <Head title="Mutasi Siswa" />

            <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] overflow-hidden">
                <div className="p-5 border-b border-[#E2DDD0] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <form onSubmit={applyFilters} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A296]" />
                            <input
                                type="text"
                                placeholder="Cari nama siswa atau no surat..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none transition-all"
                            />
                        </div>
                        <div className="relative w-full sm:w-48">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A296]" />
                            <select
                                value={typeFilter}
                                onChange={(e) => {
                                    setTypeFilter(e.target.value);
                                    router.get('/mutations', { search, type: e.target.value }, { preserveState: true });
                                }}
                                className="w-full pl-9 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none appearance-none transition-all"
                            >
                                <option value="">Semua Mutasi</option>
                                <option value="Masuk">Mutasi Masuk</option>
                                <option value="Keluar">Mutasi Keluar</option>
                            </select>
                        </div>
                        <button type="submit" className="hidden">Filter</button>
                    </form>

                    <button
                        onClick={openCreateModal}
                        className="w-full md:w-auto bg-[#16213E] hover:bg-[#1C2A4F] text-[#D4AF7A] px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        Catat Mutasi Baru
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#5B5648]">
                        <thead className="bg-[#FAF8F3] text-[#16213E] font-semibold border-b border-[#E2DDD0]">
                            <tr>
                                <th className="px-6 py-4">Siswa</th>
                                <th className="px-6 py-4">Tipe & Tanggal</th>
                                <th className="px-6 py-4">Keterangan Instansi</th>
                                <th className="px-6 py-4">No. Surat & Alasan</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2DDD0]">
                            {mutations.data.length > 0 ? (
                                mutations.data.map((record) => (
                                    <tr key={record.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-[#16213E]">{record.student?.name || 'Siswa tidak ditemukan'}</div>
                                            <div className="text-xs text-[#A8A296]">{record.student?.nis || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-start gap-1">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase ${record.type === 'Masuk' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                                                    {record.type}
                                                </span>
                                                <span className="text-xs font-medium text-[#5B5648]">{record.mutation_date}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {record.type === 'Masuk' ? (
                                                <div className="text-sm">
                                                    <span className="text-[#A8A296] text-xs block">Dari:</span>
                                                    {record.origin_school || '-'}
                                                </div>
                                            ) : (
                                                <div className="text-sm">
                                                    <span className="text-[#A8A296] text-xs block">Ke:</span>
                                                    {record.destination_school || '-'}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-2">
                                                <FileText className="w-4 h-4 text-[#A8A296] shrink-0 mt-0.5" />
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-[#1C2333]">{record.reference_number || 'Tidak ada no surat'}</span>
                                                    <span className="text-xs text-[#8B93A8] line-clamp-1">{record.reason || 'Tidak ada alasan.'}</span>
                                                </div>
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
                                    <td colSpan={5} className="px-6 py-12 text-center text-[#8B93A8]">
                                        <RotateCcw className="w-12 h-12 mx-auto text-[#E2DDD0] mb-3" />
                                        Belum ada riwayat mutasi siswa.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {mutations.links && mutations.links.length > 3 && (
                    <div className="p-4 border-t border-[#E2DDD0] flex justify-end">
                        <div className="flex gap-1">
                            {mutations.links.map((link, k) => (
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
                                {editingRecord ? 'Edit Data Mutasi' : 'Catat Mutasi Siswa'}
                            </h3>
                            <button onClick={closeModal} className="text-[#8B93A8] hover:text-[#16213E]">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={submit} className="p-6">
                            {/* Peringatan Otomatisasi */}
                            {!editingRecord && (
                                <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700 flex gap-3 items-start">
                                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                                    <p>Status siswa di menu Data Siswa akan otomatis terupdate menjadi <strong>Aktif</strong> (untuk Mutasi Masuk) atau <strong>Dikeluarkan / Pindah</strong> (untuk Mutasi Keluar) setelah Anda menyimpan data ini.</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Pilih Siswa <span className="text-red-500">*</span></label>
                                    <select 
                                        value={data.student_id} 
                                        onChange={e => setData('student_id', e.target.value)}
                                        className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none"
                                        required
                                    >
                                        <option value="">-- Cari dan Pilih Siswa --</option>
                                        {students.map(s => (
                                            <option key={s.id} value={s.id}>{s.name} {s.nis ? `(${s.nis})` : ''}</option>
                                        ))}
                                    </select>
                                    {errors.student_id && <p className="text-red-500 text-xs mt-1">{errors.student_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Jenis Mutasi</label>
                                    <select value={data.type} onChange={e => setData('type', e.target.value as 'Masuk'|'Keluar')} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none">
                                        <option value="Keluar">Mutasi Keluar</option>
                                        <option value="Masuk">Mutasi Masuk</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Tanggal Mutasi</label>
                                    <input type="date" value={data.mutation_date} onChange={e => setData('mutation_date', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" required />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Nomor Surat Resmi (Opsional)</label>
                                    <input type="text" value={data.reference_number} onChange={e => setData('reference_number', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" placeholder="Misal: 421/SMK/Mutasi/X/2026" />
                                </div>

                                {data.type === 'Masuk' ? (
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-[#5B5648] mb-1">Asal Sekolah</label>
                                        <input type="text" value={data.origin_school} onChange={e => setData('origin_school', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" placeholder="Nama sekolah asal..." />
                                    </div>
                                ) : (
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-[#5B5648] mb-1">Sekolah Tujuan</label>
                                        <input type="text" value={data.destination_school} onChange={e => setData('destination_school', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" placeholder="Nama sekolah tujuan..." />
                                    </div>
                                )}

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Alasan / Catatan</label>
                                    <textarea value={data.reason} onChange={e => setData('reason', e.target.value)} rows={3} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none resize-none" placeholder="Tuliskan alasan pindah/masuk..."></textarea>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end gap-3 mt-4 border-t border-[#E2DDD0]">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-[#5B5648] hover:bg-[#FAF8F3] rounded-lg transition-colors">
                                    Batal
                                </button>
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-[#B8935F] hover:bg-[#A37F4B] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-70">
                                    {processing ? 'Menyimpan...' : 'Simpan & Update Status'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1020]/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="font-serif font-semibold text-lg text-[#16213E] mb-2">Hapus Riwayat Mutasi?</h3>
                        <p className="text-sm text-[#8B93A8] mb-6">
                            Yakin ingin menghapus catatan ini? Status siswa <strong>tidak akan otomatis kembali</strong> jika Anda menghapus riwayat ini.
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
