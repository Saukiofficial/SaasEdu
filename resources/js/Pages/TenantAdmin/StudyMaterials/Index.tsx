import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Search, Plus, Edit2, Trash2, X, AlertTriangle, Filter, BookOpen, FileText, Link as LinkIcon, Clock } from 'lucide-react';

interface ReferenceData {
    id: string;
    name: string;
}

interface ClassroomData extends ReferenceData {
    level: string | null;
}

interface StudyMaterial {
    id: string;
    title: string;
    type: 'material' | 'assignment';
    description: string | null;
    file_url: string | null;
    due_date: string | null;
    teacher_id: string;
    subject_id: string;
    classroom_id: string;
    teacher?: ReferenceData;
    subject?: ReferenceData;
    classroom?: ClassroomData;
    created_at: string;
}

interface Props {
    materials: {
        data: StudyMaterial[];
        current_page: number;
        last_page: number;
        links: any[];
    };
    classrooms: ClassroomData[];
    subjects: ReferenceData[];
    teachers: ReferenceData[];
    filters: {
        search?: string;
        classroom_id?: string;
        subject_id?: string;
        type?: string;
    };
}

export default function Index({ materials, classrooms, subjects, teachers, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [classroomIdFilter, setClassroomIdFilter] = useState(filters.classroom_id || '');
    const [typeFilter, setTypeFilter] = useState(filters.type || '');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<StudyMaterial | null>(null);
    const [recordToDelete, setRecordToDelete] = useState<StudyMaterial | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        title: '',
        type: 'material' as 'material' | 'assignment',
        description: '',
        file_url: '',
        due_date: '',
        teacher_id: '',
        subject_id: '',
        classroom_id: '',
    });

    const applyFilters = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get('/study-materials', { 
            search, 
            classroom_id: classroomIdFilter, 
            type: typeFilter 
        }, { preserveState: true });
    };

    const openCreateModal = () => {
        clearErrors();
        reset();
        setEditingRecord(null);
        setIsModalOpen(true);
    };

    const openEditModal = (record: StudyMaterial) => {
        clearErrors();
        setEditingRecord(record);
        setData({
            title: record.title,
            type: record.type,
            description: record.description || '',
            file_url: record.file_url || '',
            // Format datetime untuk input type="datetime-local" (YYYY-MM-DDTHH:mm)
            due_date: record.due_date ? record.due_date.substring(0, 16) : '',
            teacher_id: record.teacher_id,
            subject_id: record.subject_id,
            classroom_id: record.classroom_id,
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
            put(`/study-materials/${editingRecord.id}`, { onSuccess: () => closeModal() });
        } else {
            post('/study-materials', { onSuccess: () => closeModal() });
        }
    };

    const confirmDelete = (record: StudyMaterial) => {
        setRecordToDelete(record);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = () => {
        if (recordToDelete) {
            destroy(`/study-materials/${recordToDelete.id}`, { onSuccess: () => setIsDeleteModalOpen(false) });
        }
    };

    // Fungsi format tanggal sederhana
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        }).format(date);
    };

    return (
        <AuthenticatedLayout header="LMS / E-Learning">
            <Head title="LMS - Materi & Tugas" />

            <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] overflow-hidden">
                {/* Header Action & Filter */}
                <div className="p-5 border-b border-[#E2DDD0] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <form onSubmit={applyFilters} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative w-full sm:w-56">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A296]" />
                            <input
                                type="text"
                                placeholder="Cari judul..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none transition-all"
                            />
                        </div>
                        <div className="relative w-full sm:w-40">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A296]" />
                            <select
                                value={typeFilter}
                                onChange={(e) => {
                                    setTypeFilter(e.target.value);
                                    router.get('/study-materials', { search, classroom_id: classroomIdFilter, type: e.target.value }, { preserveState: true });
                                }}
                                className="w-full pl-9 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none appearance-none transition-all"
                            >
                                <option value="">Semua Tipe</option>
                                <option value="material">Materi</option>
                                <option value="assignment">Tugas</option>
                            </select>
                        </div>
                        <div className="relative w-full sm:w-48">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A296]" />
                            <select
                                value={classroomIdFilter}
                                onChange={(e) => {
                                    setClassroomIdFilter(e.target.value);
                                    router.get('/study-materials', { search, classroom_id: e.target.value, type: typeFilter }, { preserveState: true });
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
                        Buat Konten Baru
                    </button>
                </div>

                {/* Table Data */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#5B5648]">
                        <thead className="bg-[#FAF8F3] text-[#16213E] font-semibold border-b border-[#E2DDD0]">
                            <tr>
                                <th className="px-6 py-4 w-16 text-center">Tipe</th>
                                <th className="px-6 py-4">Judul & Kelas</th>
                                <th className="px-6 py-4">Mata Pelajaran & Guru</th>
                                <th className="px-6 py-4">Informasi Tambahan</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2DDD0]">
                            {materials.data.length > 0 ? (
                                materials.data.map((record) => (
                                    <tr key={record.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                                        <td className="px-6 py-4 text-center">
                                            {record.type === 'material' ? (
                                                <div className="w-10 h-10 mx-auto rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600" title="Materi">
                                                    <BookOpen className="w-5 h-5" />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 mx-auto rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600" title="Tugas">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-[#16213E] text-base">{record.title}</div>
                                            <div className="mt-1 flex items-center gap-2 text-xs">
                                                <span className="px-2 py-0.5 bg-[#FAF8F3] border border-[#E2DDD0] rounded text-[#5B5648] font-medium">
                                                    Kelas {record.classroom?.name}
                                                </span>
                                                <span className="text-[#8B93A8]">Dibuat: {formatDate(record.created_at)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-[#16213E]">{record.subject?.name}</div>
                                            <div className="text-xs text-[#8B93A8] mt-0.5">Oleh: {record.teacher?.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1.5">
                                                {record.type === 'assignment' && record.due_date && (
                                                    <div className="flex items-center gap-1.5 text-xs font-medium text-orange-600 bg-orange-50 w-max px-2 py-0.5 rounded border border-orange-100">
                                                        <Clock className="w-3.5 h-3.5" /> 
                                                        Deadline: {formatDate(record.due_date)}
                                                    </div>
                                                )}
                                                {record.file_url && (
                                                    <a href={record.file_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:underline">
                                                        <LinkIcon className="w-3.5 h-3.5" /> Buka Lampiran
                                                    </a>
                                                )}
                                                {!record.file_url && record.type !== 'assignment' && (
                                                    <span className="text-xs text-gray-400 italic">Tidak ada lampiran</span>
                                                )}
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
                                    <td colSpan={5} className="px-6 py-16 text-center text-[#8B93A8]">
                                        <BookOpen className="w-16 h-16 mx-auto text-[#E2DDD0] mb-3" />
                                        Belum ada materi atau tugas yang didistribusikan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {materials.links && materials.links.length > 3 && (
                    <div className="p-4 border-t border-[#E2DDD0] flex justify-end">
                        <div className="flex gap-1">
                            {materials.links.map((link, k) => (
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
                                {editingRecord ? 'Edit Konten Pembelajaran' : 'Buat Materi / Tugas Baru'}
                            </h3>
                            <button onClick={closeModal} className="text-[#8B93A8] hover:text-[#16213E]">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={submit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                
                                {/* Pilihan Tipe Konten */}
                                <div className="md:col-span-2 flex gap-4">
                                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${data.type === 'material' ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold shadow-sm' : 'border-[#E2DDD0] bg-[#FAF8F3] text-[#5B5648] hover:bg-white'}`}>
                                        <input type="radio" name="type" value="material" checked={data.type === 'material'} onChange={() => setData('type', 'material')} className="hidden" />
                                        <BookOpen className="w-5 h-5" />
                                        Materi Bacaan / Tontonan
                                    </label>
                                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${data.type === 'assignment' ? 'bg-orange-50 border-orange-500 text-orange-700 font-semibold shadow-sm' : 'border-[#E2DDD0] bg-[#FAF8F3] text-[#5B5648] hover:bg-white'}`}>
                                        <input type="radio" name="type" value="assignment" checked={data.type === 'assignment'} onChange={() => setData('type', 'assignment')} className="hidden" />
                                        <FileText className="w-5 h-5" />
                                        Tugas Terstruktur
                                    </label>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Judul Konten <span className="text-red-500">*</span></label>
                                    <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" required placeholder="Contoh: Modul 1 - Pengenalan Sel, atau Tugas Mandiri 1" />
                                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Distribusikan ke Kelas <span className="text-red-500">*</span></label>
                                    <select value={data.classroom_id} onChange={e => setData('classroom_id', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" required>
                                        <option value="">-- Pilih Kelas --</option>
                                        {classrooms.map(c => (
                                            <option key={c.id} value={c.id}>{c.level ? `Tk.${c.level} - ` : ''}{c.name}</option>
                                        ))}
                                    </select>
                                    {errors.classroom_id && <p className="text-red-500 text-xs mt-1">{errors.classroom_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Mata Pelajaran <span className="text-red-500">*</span></label>
                                    <select value={data.subject_id} onChange={e => setData('subject_id', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" required>
                                        <option value="">-- Pilih Mapel --</option>
                                        {subjects.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                    {errors.subject_id && <p className="text-red-500 text-xs mt-1">{errors.subject_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Guru Pengajar <span className="text-red-500">*</span></label>
                                    <select value={data.teacher_id} onChange={e => setData('teacher_id', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" required>
                                        <option value="">-- Pilih Guru --</option>
                                        {teachers.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                    {errors.teacher_id && <p className="text-red-500 text-xs mt-1">{errors.teacher_id}</p>}
                                </div>

                                {data.type === 'assignment' && (
                                    <div>
                                        <label className="block text-sm font-medium text-[#5B5648] mb-1 flex items-center gap-1"><Clock className="w-4 h-4 text-orange-500"/> Batas Pengumpulan (Deadline) <span className="text-red-500">*</span></label>
                                        <input type="datetime-local" value={data.due_date} onChange={e => setData('due_date', e.target.value)} className="w-full px-4 py-2 bg-orange-50 border border-orange-200 rounded-lg text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" required={data.type === 'assignment'} />
                                        {errors.due_date && <p className="text-red-500 text-xs mt-1">{errors.due_date}</p>}
                                    </div>
                                )}

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Deskripsi / Instruksi</label>
                                    <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={3} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none resize-none" placeholder="Berikan instruksi jelas untuk siswa..." />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Tautan Lampiran (URL Google Drive, Youtube, dll)</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A296]" />
                                        <input type="url" value={data.file_url} onChange={e => setData('file_url', e.target.value)} className="w-full pl-9 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" placeholder="https://..." />
                                    </div>
                                    {errors.file_url && <p className="text-red-500 text-xs mt-1">{errors.file_url}</p>}
                                </div>

                            </div>

                            <div className="pt-6 flex justify-end gap-3 mt-4 border-t border-[#E2DDD0]">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-[#5B5648] hover:bg-[#FAF8F3] rounded-lg transition-colors">
                                    Batal
                                </button>
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-[#B8935F] hover:bg-[#A37F4B] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-70">
                                    {processing ? 'Menyimpan...' : 'Distribusikan'}
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
                        <h3 className="font-serif font-semibold text-lg text-[#16213E] mb-2">Hapus Konten?</h3>
                        <p className="text-sm text-[#8B93A8] mb-6">
                            Yakin ingin menghapus <span className="font-semibold text-[#16213E]">{recordToDelete?.title}</span>? Tindakan ini tidak dapat dikembalikan.
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
