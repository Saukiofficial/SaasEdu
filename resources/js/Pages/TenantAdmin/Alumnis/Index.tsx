import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Search, Plus, Edit2, Trash2, X, AlertTriangle, Award, Filter, Briefcase, GraduationCap } from 'lucide-react';

interface Student {
    id: string;
    name: string;
    nis: string | null;
    status: string;
}

interface Alumni {
    id: string;
    student_id: string;
    graduation_year: string;
    current_activity: 'Kuliah' | 'Bekerja' | 'Wirausaha' | 'Mencari Kerja' | 'Lainnya';
    institution_name: string | null;
    major_or_position: string | null;
    contact_number: string | null;
    student?: Student;
}

interface Props {
    alumnis: {
        data: Alumni[];
        current_page: number;
        last_page: number;
        links: any[];
    };
    students: Student[];
    filters: {
        search?: string;
        activity?: string;
    };
}

export default function Index({ alumnis, students, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [activityFilter, setActivityFilter] = useState(filters.activity || '');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<Alumni | null>(null);
    const [recordToDelete, setRecordToDelete] = useState<Alumni | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        student_id: '',
        graduation_year: new Date().getFullYear().toString(),
        current_activity: 'Mencari Kerja' as 'Kuliah' | 'Bekerja' | 'Wirausaha' | 'Mencari Kerja' | 'Lainnya',
        institution_name: '',
        major_or_position: '',
        contact_number: '',
    });

    const applyFilters = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get('/alumnis', { search, activity: activityFilter }, { preserveState: true });
    };

    const openCreateModal = () => {
        clearErrors();
        reset();
        setEditingRecord(null);
        setIsModalOpen(true);
    };

    const openEditModal = (record: Alumni) => {
        clearErrors();
        setEditingRecord(record);
        setData({
            student_id: record.student_id,
            graduation_year: record.graduation_year,
            current_activity: record.current_activity,
            institution_name: record.institution_name || '',
            major_or_position: record.major_or_position || '',
            contact_number: record.contact_number || '',
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
            put(`/alumnis/${editingRecord.id}`, { onSuccess: () => closeModal() });
        } else {
            post('/alumnis', { onSuccess: () => closeModal() });
        }
    };

    const confirmDelete = (record: Alumni) => {
        setRecordToDelete(record);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = () => {
        if (recordToDelete) {
            destroy(`/alumnis/${recordToDelete.id}`, { onSuccess: () => setIsDeleteModalOpen(false) });
        }
    };

    const getActivityColor = (activity: string) => {
        switch (activity) {
            case 'Kuliah': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Bekerja': return 'bg-green-100 text-green-700 border-green-200';
            case 'Wirausaha': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Mencari Kerja': return 'bg-orange-100 text-orange-700 border-orange-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <AuthenticatedLayout header="Data Alumni (Tracer Study)">
            <Head title="Data Alumni" />

            <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] overflow-hidden">
                <div className="p-5 border-b border-[#E2DDD0] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <form onSubmit={applyFilters} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A296]" />
                            <input
                                type="text"
                                placeholder="Cari alumni / instansi..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none transition-all"
                            />
                        </div>
                        <div className="relative w-full sm:w-48">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A296]" />
                            <select
                                value={activityFilter}
                                onChange={(e) => {
                                    setActivityFilter(e.target.value);
                                    router.get('/alumnis', { search, activity: e.target.value }, { preserveState: true });
                                }}
                                className="w-full pl-9 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none appearance-none transition-all"
                            >
                                <option value="">Semua Aktivitas</option>
                                <option value="Kuliah">Kuliah</option>
                                <option value="Bekerja">Bekerja</option>
                                <option value="Wirausaha">Wirausaha</option>
                                <option value="Mencari Kerja">Mencari Kerja</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>
                        <button type="submit" className="hidden">Filter</button>
                    </form>

                    <button
                        onClick={openCreateModal}
                        className="w-full md:w-auto bg-[#16213E] hover:bg-[#1C2A4F] text-[#D4AF7A] px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        Catat Data Alumni
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#5B5648]">
                        <thead className="bg-[#FAF8F3] text-[#16213E] font-semibold border-b border-[#E2DDD0]">
                            <tr>
                                <th className="px-6 py-4">Nama Alumni</th>
                                <th className="px-6 py-4">Tahun Lulus</th>
                                <th className="px-6 py-4">Status / Aktivitas</th>
                                <th className="px-6 py-4">Instansi & Jurusan/Jabatan</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2DDD0]">
                            {alumnis.data.length > 0 ? (
                                alumnis.data.map((record) => (
                                    <tr key={record.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-[#16213E]">{record.student?.name || 'Siswa tidak ditemukan'}</div>
                                            <div className="text-xs text-[#A8A296]">NIS: {record.student?.nis || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{record.graduation_year}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase border ${getActivityColor(record.current_activity)}`}>
                                                {record.current_activity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {record.institution_name ? (
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-[#1C2333] flex items-center gap-1.5">
                                                        {record.current_activity === 'Kuliah' ? <GraduationCap className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
                                                        {record.institution_name}
                                                    </span>
                                                    <span className="text-xs text-[#8B93A8]">{record.major_or_position || '-'}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic text-xs">Belum ada data instansi</span>
                                            )}
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
                                        <Award className="w-12 h-12 mx-auto text-[#E2DDD0] mb-3" />
                                        Belum ada data tracer study alumni.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {alumnis.links && alumnis.links.length > 3 && (
                    <div className="p-4 border-t border-[#E2DDD0] flex justify-end">
                        <div className="flex gap-1">
                            {alumnis.links.map((link, k) => (
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
                                {editingRecord ? 'Edit Tracer Study Alumni' : 'Pendataan Alumni Baru'}
                            </h3>
                            <button onClick={closeModal} className="text-[#8B93A8] hover:text-[#16213E]">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={submit} className="p-6">
                            {!editingRecord && (
                                <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700 flex gap-3 items-start">
                                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                                    <p>Setelah data alumni disimpan, status siswa tersebut di sistem akan **otomatis** diubah menjadi <strong>Lulus (Graduated)</strong>.</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Pilih Siswa yang Lulus <span className="text-red-500">*</span></label>
                                    <select 
                                        value={data.student_id} 
                                        onChange={e => setData('student_id', e.target.value)}
                                        className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none"
                                        required
                                        disabled={!!editingRecord} // Tidak boleh ganti siswa saat diedit
                                    >
                                        <option value="">-- Cari dan Pilih Siswa --</option>
                                        {students.map(s => (
                                            <option key={s.id} value={s.id}>{s.name} {s.nis ? `(${s.nis})` : ''} - {s.status === 'graduated' ? '[Lulus]' : '[Aktif]'}</option>
                                        ))}
                                    </select>
                                    {errors.student_id && <p className="text-red-500 text-xs mt-1">{errors.student_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Tahun Kelulusan</label>
                                    <input type="number" min="2000" max={new Date().getFullYear() + 1} value={data.graduation_year} onChange={e => setData('graduation_year', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" required />
                                    {errors.graduation_year && <p className="text-red-500 text-xs mt-1">{errors.graduation_year}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Aktivitas Saat Ini</label>
                                    <select value={data.current_activity} onChange={e => setData('current_activity', e.target.value as 'Kuliah'|'Bekerja'|'Wirausaha'|'Mencari Kerja'|'Lainnya')} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none">
                                        <option value="Kuliah">Kuliah</option>
                                        <option value="Bekerja">Bekerja</option>
                                        <option value="Wirausaha">Wirausaha</option>
                                        <option value="Mencari Kerja">Mencari Kerja</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2 pt-2 border-t border-[#E2DDD0]">
                                    <h4 className="text-sm font-semibold text-[#16213E] mb-3">Detail Instansi (Opsional)</h4>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Nama Kampus / Perusahaan</label>
                                    <input type="text" value={data.institution_name} onChange={e => setData('institution_name', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" placeholder="Misal: Universitas Indonesia" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Jurusan / Posisi Pekerjaan</label>
                                    <input type="text" value={data.major_or_position} onChange={e => setData('major_or_position', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" placeholder="Misal: Teknik Informatika" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Nomor HP / WA yang Aktif</label>
                                    <input type="text" value={data.contact_number} onChange={e => setData('contact_number', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" placeholder="Untuk keperluan komunikasi tracer study" />
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end gap-3 mt-4 border-t border-[#E2DDD0]">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-[#5B5648] hover:bg-[#FAF8F3] rounded-lg transition-colors">
                                    Batal
                                </button>
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-[#B8935F] hover:bg-[#A37F4B] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-70">
                                    {processing ? 'Menyimpan...' : 'Simpan Data Alumni'}
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
                        <h3 className="font-serif font-semibold text-lg text-[#16213E] mb-2">Hapus Data Alumni?</h3>
                        <p className="text-sm text-[#8B93A8] mb-6">
                            Yakin ingin menghapus catatan tracer study ini? Data tidak dapat dikembalikan.
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
