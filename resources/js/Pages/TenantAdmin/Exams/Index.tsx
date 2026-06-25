import React, { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout';
import { Search, Plus, Edit2, Trash2, X, AlertTriangle, Filter, FileQuestion, Clock, ListChecks } from 'lucide-react';

interface ReferenceData {
    id: string;
    name: string;
}

interface ClassroomData extends ReferenceData {
    level: string | null;
}

interface Exam {
    id: string;
    title: string;
    description: string | null;
    start_time: string;
    end_time: string;
    duration: number;
    is_active: boolean;
    teacher_id: string;
    subject_id: string;
    classroom_id: string;
    teacher?: ReferenceData;
    subject?: ReferenceData;
    classroom?: ClassroomData;
}

interface Props {
    exams: {
        data: Exam[];
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
    };
}

export default function Index({ exams, classrooms, subjects, teachers, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [classroomIdFilter, setClassroomIdFilter] = useState(filters.classroom_id || '');
    const [subjectIdFilter, setSubjectIdFilter] = useState(filters.subject_id || '');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<Exam | null>(null);
    const [recordToDelete, setRecordToDelete] = useState<Exam | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        duration: 60,
        is_active: false,
        teacher_id: '',
        subject_id: '',
        classroom_id: '',
    });

    const applyFilters = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get('/exams', { 
            search, 
            classroom_id: classroomIdFilter, 
            subject_id: subjectIdFilter 
        }, { preserveState: true });
    };

    const openCreateModal = () => {
        clearErrors();
        reset();
        setEditingRecord(null);
        setIsModalOpen(true);
    };

    const openEditModal = (record: Exam) => {
        clearErrors();
        setEditingRecord(record);
        setData({
            title: record.title,
            description: record.description || '',
            start_time: record.start_time ? record.start_time.replace(' ', 'T').substring(0, 16) : '',
            end_time: record.end_time ? record.end_time.replace(' ', 'T').substring(0, 16) : '',
            duration: record.duration,
            is_active: record.is_active,
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
            put(`/exams/${editingRecord.id}`, { onSuccess: () => closeModal() });
        } else {
            post('/exams', { onSuccess: () => closeModal() });
        }
    };

    const confirmDelete = (record: Exam) => {
        setRecordToDelete(record);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = () => {
        if (recordToDelete) {
            destroy(`/exams/${recordToDelete.id}`, { onSuccess: () => setIsDeleteModalOpen(false) });
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        }).format(date);
    };

    return (
        <AuthenticatedLayout header="Ujian (CBT)">
            <Head title="Ujian (CBT)" />

            <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] overflow-hidden">
                <div className="p-5 border-b border-[#E2DDD0] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <form onSubmit={applyFilters} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative w-full sm:w-56">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A296]" />
                            <input
                                type="text"
                                placeholder="Cari ujian..."
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
                                    router.get('/exams', { search, classroom_id: e.target.value, subject_id: subjectIdFilter }, { preserveState: true });
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
                        Buat Ujian Baru
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#5B5648]">
                        <thead className="bg-[#FAF8F3] text-[#16213E] font-semibold border-b border-[#E2DDD0]">
                            <tr>
                                <th className="px-6 py-4">Judul Ujian & Kelas</th>
                                <th className="px-6 py-4">Mata Pelajaran & Guru</th>
                                <th className="px-6 py-4">Waktu Ujian</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2DDD0]">
                            {exams.data.length > 0 ? (
                                exams.data.map((record) => (
                                    <tr key={record.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-[#16213E] text-base">{record.title}</div>
                                            <div className="mt-1 flex items-center gap-2 text-xs">
                                                <span className="px-2 py-0.5 bg-[#FAF8F3] border border-[#E2DDD0] rounded text-[#5B5648] font-medium">
                                                    Kelas {record.classroom?.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-[#16213E]">{record.subject?.name}</div>
                                            <div className="text-xs text-[#8B93A8] mt-0.5">Oleh: {record.teacher?.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1 text-xs">
                                                <div className="flex items-center gap-1.5 font-medium text-[#16213E]">
                                                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                                                    Mulai: {formatDate(record.start_time)}
                                                </div>
                                                <div className="flex items-center gap-1.5 font-medium text-[#8B93A8]">
                                                    <Clock className="w-3.5 h-3.5 text-orange-600" />
                                                    Selesai: {formatDate(record.end_time)}
                                                </div>
                                                <div className="font-medium text-[#8B93A8] ml-5">
                                                    Durasi: {record.duration} Menit
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase ${record.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {record.is_active ? 'Tayang' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link 
                                                    href={`/exams/${record.id}/questions`}
                                                    className="p-1.5 text-[#16213E] hover:text-[#B8935F] hover:bg-[#FAF8F3] rounded-md transition-colors border border-transparent hover:border-[#E2DDD0]"
                                                    title="Kelola Soal"
                                                >
                                                    <ListChecks className="w-4 h-4" />
                                                </Link>
                                                
                                                <button onClick={() => openEditModal(record)} className="p-1.5 text-[#8B93A8] hover:text-[#B8935F] hover:bg-[#FAF8F3] rounded-md transition-colors border border-transparent hover:border-[#E2DDD0]">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => confirmDelete(record)} className="p-1.5 text-[#8B93A8] hover:text-red-500 hover:bg-red-50 rounded-md transition-colors border border-transparent hover:border-red-100">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center text-[#8B93A8]">
                                        <FileQuestion className="w-16 h-16 mx-auto text-[#E2DDD0] mb-3" />
                                        Belum ada ujian yang dibuat.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {exams.links && exams.links.length > 3 && (
                    <div className="p-4 border-t border-[#E2DDD0] flex justify-end">
                        <div className="flex gap-1">
                            {exams.links.map((link, k) => (
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
                                {editingRecord ? 'Edit Ujian' : 'Buat Ujian Baru'}
                            </h3>
                            <button onClick={closeModal} className="text-[#8B93A8] hover:text-[#16213E]">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={submit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Judul Ujian <span className="text-red-500">*</span></label>
                                    <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" required placeholder="Contoh: UAS Semester Ganjil 2026" />
                                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Pilih Kelas <span className="text-red-500">*</span></label>
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
                                
                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Durasi Pengerjaan Ujian (Menit) <span className="text-red-500">*</span></label>
                                    <input type="number" min="1" value={data.duration} onChange={e => setData('duration', parseInt(e.target.value))} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" required />
                                    {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Waktu Mulai <span className="text-red-500">*</span></label>
                                    <input type="datetime-local" value={data.start_time} onChange={e => setData('start_time', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" required />
                                    {errors.start_time && <p className="text-red-500 text-xs mt-1">{errors.start_time}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Waktu Ditutup (Batas Submit) <span className="text-red-500">*</span></label>
                                    <input type="datetime-local" value={data.end_time} onChange={e => setData('end_time', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" required />
                                    {errors.end_time && <p className="text-red-500 text-xs mt-1">{errors.end_time}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Deskripsi / Instruksi</label>
                                    <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={3} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none resize-none" placeholder="Berikan instruksi ujian..."></textarea>
                                </div>

                                <div className="md:col-span-2 flex items-center gap-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="rounded border-blue-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                    />
                                    <label htmlFor="is_active" className="text-sm font-medium text-blue-800 cursor-pointer select-none">
                                        Publikasikan Ujian (Status Aktif)
                                        <p className="text-xs font-normal text-blue-600 mt-0.5">
                                            Jika tidak dicentang, ujian akan berstatus Draft dan tidak dapat dilihat siswa.
                                        </p>
                                    </label>
                                </div>

                            </div>

                            <div className="pt-6 flex justify-end gap-3 mt-4 border-t border-[#E2DDD0]">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-[#5B5648] hover:bg-[#FAF8F3] rounded-lg transition-colors">
                                    Batal
                                </button>
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-[#B8935F] hover:bg-[#A37F4B] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-70">
                                    {processing ? 'Menyimpan...' : 'Simpan Ujian'}
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
                        <h3 className="font-serif font-semibold text-lg text-[#16213E] mb-2">Hapus Ujian?</h3>
                        <p className="text-sm text-[#8B93A8] mb-6">
                            Yakin ingin menghapus ujian <span className="font-semibold text-[#16213E]">{recordToDelete?.title}</span>?
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