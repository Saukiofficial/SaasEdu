import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Calendar, Plus, Edit2, Trash2, X, AlertTriangle, Clock, Filter, BookOpen } from 'lucide-react';

interface ReferenceData {
    id: string;
    name: string;
}

interface ClassroomData extends ReferenceData {
    level: string | null;
}

interface Schedule {
    id: string;
    academic_year_id: string;
    classroom_id: string;
    subject_id: string;
    teacher_id: string;
    day: string;
    start_time: string;
    end_time: string;
    academic_year?: ReferenceData;
    classroom?: ClassroomData;
    subject?: ReferenceData;
    teacher?: ReferenceData;
}

interface Props {
    schedules: {
        data: Schedule[];
        current_page: number;
        last_page: number;
        links: any[];
    };
    academicYears: ReferenceData[];
    classrooms: ClassroomData[];
    subjects: ReferenceData[];
    teachers: ReferenceData[];
    filters: {
        classroom_id?: string;
        day?: string;
    };
}

export default function Index({ schedules, academicYears, classrooms, subjects, teachers, filters }: Props) {
    const [classroomIdFilter, setClassroomIdFilter] = useState(filters.classroom_id || '');
    const [dayFilter, setDayFilter] = useState(filters.day || '');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<Schedule | null>(null);
    const [recordToDelete, setRecordToDelete] = useState<Schedule | null>(null);

    // Ambil tahun ajaran aktif pertama sebagai default value
    const defaultAcademicYearId = academicYears.length > 0 ? academicYears[0].id : '';

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        academic_year_id: defaultAcademicYearId,
        classroom_id: '',
        subject_id: '',
        teacher_id: '',
        day: 'Senin',
        start_time: '07:00',
        end_time: '08:30',
    });

    const applyFilters = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get('/lms/schedules', { classroom_id: classroomIdFilter, day: dayFilter }, { preserveState: true });
    };

    const openCreateModal = () => {
        clearErrors();
        reset();
        // Pertahankan nilai academic_year_id jika reset
        setData('academic_year_id', defaultAcademicYearId);
        setEditingRecord(null);
        setIsModalOpen(true);
    };

    const openEditModal = (record: Schedule) => {
        clearErrors();
        setEditingRecord(record);
        setData({
            academic_year_id: record.academic_year_id,
            classroom_id: record.classroom_id,
            subject_id: record.subject_id,
            teacher_id: record.teacher_id,
            day: record.day,
            start_time: record.start_time.substring(0, 5), // potong "07:00:00" jadi "07:00"
            end_time: record.end_time.substring(0, 5),
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
            put(`/lms/schedules/${editingRecord.id}`, { onSuccess: () => closeModal() });
        } else {
            post('/lms/schedules', { onSuccess: () => closeModal() });
        }
    };

    const confirmDelete = (record: Schedule) => {
        setRecordToDelete(record);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = () => {
        if (recordToDelete) {
            destroy(`/lms/schedules/${recordToDelete.id}`, { onSuccess: () => setIsDeleteModalOpen(false) });
        }
    };

    const getDayColor = (day: string) => {
        const colors: Record<string, string> = {
            'Senin': 'bg-blue-100 text-blue-700 border-blue-200',
            'Selasa': 'bg-green-100 text-green-700 border-green-200',
            'Rabu': 'bg-yellow-100 text-yellow-700 border-yellow-200',
            'Kamis': 'bg-orange-100 text-orange-700 border-orange-200',
            'Jumat': 'bg-purple-100 text-purple-700 border-purple-200',
            'Sabtu': 'bg-pink-100 text-pink-700 border-pink-200',
            'Minggu': 'bg-red-100 text-red-700 border-red-200',
        };
        return colors[day] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    return (
        <AuthenticatedLayout header="Jadwal Pelajaran">
            <Head title="Jadwal Pelajaran" />

            <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] overflow-hidden">
                {/* Header Action & Filter */}
                <div className="p-5 border-b border-[#E2DDD0] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <form onSubmit={applyFilters} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative w-full sm:w-48">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A296]" />
                            <select
                                value={classroomIdFilter}
                                onChange={(e) => {
                                    setClassroomIdFilter(e.target.value);
                                    router.get('/lms/schedules', { classroom_id: e.target.value, day: dayFilter }, { preserveState: true });
                                }}
                                className="w-full pl-9 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none appearance-none transition-all"
                            >
                                <option value="">Semua Kelas</option>
                                {classrooms.map(c => (
                                    <option key={c.id} value={c.id}>{c.level ? `Tk.${c.level} - ` : ''}{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="relative w-full sm:w-40">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A296]" />
                            <select
                                value={dayFilter}
                                onChange={(e) => {
                                    setDayFilter(e.target.value);
                                    router.get('/lms/schedules', { classroom_id: classroomIdFilter, day: e.target.value }, { preserveState: true });
                                }}
                                className="w-full pl-9 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none appearance-none transition-all"
                            >
                                <option value="">Semua Hari</option>
                                <option value="Senin">Senin</option>
                                <option value="Selasa">Selasa</option>
                                <option value="Rabu">Rabu</option>
                                <option value="Kamis">Kamis</option>
                                <option value="Jumat">Jumat</option>
                                <option value="Sabtu">Sabtu</option>
                            </select>
                        </div>
                        <button type="submit" className="hidden">Filter</button>
                    </form>

                    <button
                        onClick={openCreateModal}
                        className="w-full md:w-auto bg-[#16213E] hover:bg-[#1C2A4F] text-[#D4AF7A] px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Jadwal
                    </button>
                </div>

                {/* Table Data */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#5B5648]">
                        <thead className="bg-[#FAF8F3] text-[#16213E] font-semibold border-b border-[#E2DDD0]">
                            <tr>
                                <th className="px-6 py-4 w-32">Hari</th>
                                <th className="px-6 py-4 w-40">Jam Pelajaran</th>
                                <th className="px-6 py-4">Mata Pelajaran & Guru</th>
                                <th className="px-6 py-4">Kelas</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2DDD0]">
                            {schedules.data.length > 0 ? (
                                schedules.data.map((record) => (
                                    <tr key={record.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold border ${getDayColor(record.day)}`}>
                                                {record.day}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-[#16213E] flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-[#A8A296]" />
                                            {record.start_time.substring(0, 5)} - {record.end_time.substring(0, 5)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-[#16213E]">{record.subject?.name}</div>
                                            <div className="text-xs text-[#8B93A8] mt-0.5">Oleh: {record.teacher?.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#FAF8F3] border border-[#E2DDD0] text-xs font-medium text-[#5B5648]">
                                                {record.classroom?.name}
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
                                        Belum ada jadwal pelajaran yang dibuat untuk filter ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {schedules.links && schedules.links.length > 3 && (
                    <div className="p-4 border-t border-[#E2DDD0] flex justify-end">
                        <div className="flex gap-1">
                            {schedules.links.map((link, k) => (
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
                                {editingRecord ? 'Edit Jadwal Pelajaran' : 'Tambah Jadwal Pelajaran'}
                            </h3>
                            <button onClick={closeModal} className="text-[#8B93A8] hover:text-[#16213E]">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={submit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Tahun Ajaran <span className="text-red-500">*</span></label>
                                    <select 
                                        value={data.academic_year_id} 
                                        onChange={e => setData('academic_year_id', e.target.value)}
                                        className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none"
                                        required
                                    >
                                        <option value="">-- Pilih Tahun Ajaran --</option>
                                        {academicYears.map(ay => (
                                            <option key={ay.id} value={ay.id}>{ay.name}</option>
                                        ))}
                                    </select>
                                    {errors.academic_year_id && <p className="text-red-500 text-xs mt-1">{errors.academic_year_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Pilih Kelas <span className="text-red-500">*</span></label>
                                    <select 
                                        value={data.classroom_id} 
                                        onChange={e => setData('classroom_id', e.target.value)}
                                        className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none"
                                        required
                                    >
                                        <option value="">-- Pilih Kelas --</option>
                                        {classrooms.map(c => (
                                            <option key={c.id} value={c.id}>{c.level ? `Tk.${c.level} - ` : ''}{c.name}</option>
                                        ))}
                                    </select>
                                    {errors.classroom_id && <p className="text-red-500 text-xs mt-1">{errors.classroom_id}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Hari <span className="text-red-500">*</span></label>
                                    <select value={data.day} onChange={e => setData('day', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" required>
                                        <option value="Senin">Senin</option>
                                        <option value="Selasa">Selasa</option>
                                        <option value="Rabu">Rabu</option>
                                        <option value="Kamis">Kamis</option>
                                        <option value="Jumat">Jumat</option>
                                        <option value="Sabtu">Sabtu</option>
                                        <option value="Minggu">Minggu</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Mata Pelajaran <span className="text-red-500">*</span></label>
                                    <select 
                                        value={data.subject_id} 
                                        onChange={e => setData('subject_id', e.target.value)}
                                        className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none"
                                        required
                                    >
                                        <option value="">-- Pilih Mata Pelajaran --</option>
                                        {subjects.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                    {errors.subject_id && <p className="text-red-500 text-xs mt-1">{errors.subject_id}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Guru Pengajar <span className="text-red-500">*</span></label>
                                    <select 
                                        value={data.teacher_id} 
                                        onChange={e => setData('teacher_id', e.target.value)}
                                        className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none"
                                        required
                                    >
                                        <option value="">-- Pilih Guru --</option>
                                        {teachers.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                    {errors.teacher_id && <p className="text-red-500 text-xs mt-1">{errors.teacher_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Jam Mulai <span className="text-red-500">*</span></label>
                                    <input type="time" value={data.start_time} onChange={e => setData('start_time', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" required />
                                    {errors.start_time && <p className="text-red-500 text-xs mt-1">{errors.start_time}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Jam Selesai <span className="text-red-500">*</span></label>
                                    <input type="time" value={data.end_time} onChange={e => setData('end_time', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" required />
                                    {errors.end_time && <p className="text-red-500 text-xs mt-1">{errors.end_time}</p>}
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
                        <h3 className="font-serif font-semibold text-lg text-[#16213E] mb-2">Hapus Jadwal?</h3>
                        <p className="text-sm text-[#8B93A8] mb-6">
                            Yakin ingin menghapus jadwal ini? Tindakan ini tidak dapat dikembalikan.
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
