import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Search, Plus, Edit2, Trash2, X, AlertTriangle, GraduationCap, Filter } from 'lucide-react';

interface Classroom {
    id: string;
    name: string;
    level: string | null;
}

interface Student {
    id: string;
    classroom_id: string | null;
    nis: string | null;
    nisn: string | null;
    name: string;
    gender: 'L' | 'P';
    birth_place: string | null;
    birth_date: string | null;
    address: string | null;
    parent_name: string | null;
    parent_phone: string | null;
    status: 'active' | 'graduated' | 'dropped_out';
    classroom?: Classroom;
}

interface Props {
    students: {
        data: Student[];
        current_page: number;
        last_page: number;
        links: any[];
    };
    classrooms: Classroom[];
    filters: {
        search?: string;
        classroom_id?: string;
    };
}

export default function Index({ students, classrooms, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [classroomIdFilter, setClassroomIdFilter] = useState(filters.classroom_id || '');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<Student | null>(null);
    const [recordToDelete, setRecordToDelete] = useState<Student | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        classroom_id: '',
        nis: '',
        nisn: '',
        name: '',
        gender: 'L' as 'L' | 'P',
        birth_place: '',
        birth_date: '',
        address: '',
        parent_name: '',
        parent_phone: '',
        status: 'active' as 'active' | 'graduated' | 'dropped_out',
    });

    const applyFilters = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get('/students', { search, classroom_id: classroomIdFilter }, { preserveState: true });
    };

    const openCreateModal = () => {
        clearErrors();
        reset();
        setEditingRecord(null);
        setIsModalOpen(true);
    };

    const openEditModal = (record: Student) => {
        clearErrors();
        setEditingRecord(record);
        setData({
            classroom_id: record.classroom_id || '',
            nis: record.nis || '',
            nisn: record.nisn || '',
            name: record.name,
            gender: record.gender,
            birth_place: record.birth_place || '',
            birth_date: record.birth_date || '',
            address: record.address || '',
            parent_name: record.parent_name || '',
            parent_phone: record.parent_phone || '',
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
            put(`/students/${editingRecord.id}`, { onSuccess: () => closeModal() });
        } else {
            post('/students', { onSuccess: () => closeModal() });
        }
    };

    const confirmDelete = (record: Student) => {
        setRecordToDelete(record);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = () => {
        if (recordToDelete) {
            destroy(`/students/${recordToDelete.id}`, { onSuccess: () => setIsDeleteModalOpen(false) });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return <span className="px-2 py-1 bg-green-100 text-green-700 text-[11px] rounded-full font-semibold uppercase">Aktif</span>;
            case 'graduated': return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[11px] rounded-full font-semibold uppercase">Lulus</span>;
            case 'dropped_out': return <span className="px-2 py-1 bg-red-100 text-red-700 text-[11px] rounded-full font-semibold uppercase">Keluar</span>;
            default: return null;
        }
    };

    return (
        <AuthenticatedLayout header="Data Siswa">
            <Head title="Data Siswa" />

            <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] overflow-hidden">
                {/* Header Action & Filter */}
                <div className="p-5 border-b border-[#E2DDD0] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <form onSubmit={applyFilters} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A296]" />
                            <input
                                type="text"
                                placeholder="Cari nama, NIS, atau NISN..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none transition-all"
                            />
                        </div>
                        <div className="relative w-full sm:w-48">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A296]" />
                            <select
                                value={classroomIdFilter}
                                onChange={(e) => {
                                    setClassroomIdFilter(e.target.value);
                                    router.get('/students', { search, classroom_id: e.target.value }, { preserveState: true });
                                }}
                                className="w-full pl-9 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none appearance-none transition-all"
                            >
                                <option value="">Semua Kelas</option>
                                {classrooms.map(c => (
                                    <option key={c.id} value={c.id}>{c.level ? `Tk.${c.level} - ` : ''}{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="hidden">Filter</button>
                    </form>

                    <button
                        onClick={openCreateModal}
                        className="w-full md:w-auto bg-[#16213E] hover:bg-[#1C2A4F] text-[#D4AF7A] px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Siswa
                    </button>
                </div>

                {/* Table Data */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#5B5648]">
                        <thead className="bg-[#FAF8F3] text-[#16213E] font-semibold border-b border-[#E2DDD0]">
                            <tr>
                                <th className="px-6 py-4">NIS / NISN</th>
                                <th className="px-6 py-4">Nama Siswa</th>
                                <th className="px-6 py-4">L/P</th>
                                <th className="px-6 py-4">Kelas</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2DDD0]">
                            {students.data.length > 0 ? (
                                students.data.map((record) => (
                                    <tr key={record.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-[#16213E]">
                                            <div className="flex flex-col">
                                                <span>{record.nis || '-'}</span>
                                                <span className="text-xs text-[#A8A296]">{record.nisn || 'NISN Kosong'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-[#16213E]">{record.name}</td>
                                        <td className="px-6 py-4">{record.gender}</td>
                                        <td className="px-6 py-4">
                                            {record.classroom ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#FAF8F3] border border-[#E2DDD0] text-xs font-medium text-[#5B5648]">
                                                    {record.classroom.name}
                                                </span>
                                            ) : (
                                                <span className="text-[#A8A296] italic text-xs">Belum ada kelas</span>
                                            )}
                                        </td>
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
                                        <GraduationCap className="w-12 h-12 mx-auto text-[#E2DDD0] mb-3" />
                                        Belum ada data siswa.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {students.links && students.links.length > 3 && (
                    <div className="p-4 border-t border-[#E2DDD0] flex justify-end">
                        <div className="flex gap-1">
                            {students.links.map((link, k) => (
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
                                {editingRecord ? 'Edit Data Siswa' : 'Tambah Data Siswa'}
                            </h3>
                            <button onClick={closeModal} className="text-[#8B93A8] hover:text-[#16213E]">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={submit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                {/* Baris 1 */}
                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">NIS</label>
                                    <input type="text" value={data.nis} onChange={e => setData('nis', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none" />
                                    {errors.nis && <p className="text-red-500 text-xs mt-1">{errors.nis}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">NISN</label>
                                    <input type="text" value={data.nisn} onChange={e => setData('nisn', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none" />
                                    {errors.nisn && <p className="text-red-500 text-xs mt-1">{errors.nisn}</p>}
                                </div>

                                {/* Baris 2 */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Nama Lengkap Siswa <span className="text-red-500">*</span></label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none" required />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                {/* Baris 3 */}
                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Jenis Kelamin</label>
                                    <select value={data.gender} onChange={e => setData('gender', e.target.value as 'L'|'P')} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none">
                                        <option value="L">Laki-laki</option>
                                        <option value="P">Perempuan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Pilih Kelas Saat Ini</label>
                                    <select value={data.classroom_id} onChange={e => setData('classroom_id', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none">
                                        <option value="">-- Pilih Kelas --</option>
                                        {classrooms.map(c => (
                                            <option key={c.id} value={c.id}>{c.level ? `Tk.${c.level} - ` : ''}{c.name}</option>
                                        ))}
                                    </select>
                                    {errors.classroom_id && <p className="text-red-500 text-xs mt-1">{errors.classroom_id}</p>}
                                </div>

                                {/* Baris 4 */}
                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Tempat Lahir</label>
                                    <input type="text" value={data.birth_place} onChange={e => setData('birth_place', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Tanggal Lahir</label>
                                    <input type="date" value={data.birth_date} onChange={e => setData('birth_date', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" />
                                </div>

                                {/* Baris 5 */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Alamat Lengkap</label>
                                    <textarea value={data.address} onChange={e => setData('address', e.target.value)} rows={2} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none resize-none"></textarea>
                                </div>

                                {/* Baris 6 */}
                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Nama Orang Tua / Wali</label>
                                    <input type="text" value={data.parent_name} onChange={e => setData('parent_name', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">No. Telp Orang Tua</label>
                                    <input type="text" value={data.parent_phone} onChange={e => setData('parent_phone', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" />
                                </div>

                                {/* Baris 7 */}
                                <div className="md:col-span-2 pt-2 border-t border-[#E2DDD0] mt-2">
                                    <label className="block text-sm font-medium text-[#5B5648] mb-2">Status Akademik</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 text-sm text-[#1C2333]">
                                            <input type="radio" name="status" value="active" checked={data.status === 'active'} onChange={e => setData('status', 'active')} className="text-[#B8935F] focus:ring-[#B8935F]" />
                                            Siswa Aktif
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-[#1C2333]">
                                            <input type="radio" name="status" value="graduated" checked={data.status === 'graduated'} onChange={e => setData('status', 'graduated')} className="text-[#B8935F] focus:ring-[#B8935F]" />
                                            Lulus
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-[#1C2333]">
                                            <input type="radio" name="status" value="dropped_out" checked={data.status === 'dropped_out'} onChange={e => setData('status', 'dropped_out')} className="text-[#B8935F] focus:ring-[#B8935F]" />
                                            Dikeluarkan / Pindah
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
                        <h3 className="font-serif font-semibold text-lg text-[#16213E] mb-2">Hapus Data Siswa?</h3>
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
