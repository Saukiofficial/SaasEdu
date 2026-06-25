import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Calendar, Filter, Save, Users, UserCheck, FileEdit, GraduationCap, BriefcaseBusiness, BookOpen } from 'lucide-react';

interface ReferenceData {
    id: string;
    name: string;
}

interface ClassroomData extends ReferenceData {
    level: string | null;
}

interface AcademicYearData extends ReferenceData {
    is_active: boolean;
}

interface GradeFormData {
    student_id: string;
    name: string;
    nis: string | null;
    score: number;
    description: string;
}

interface Props {
    academicYears: AcademicYearData[];
    classrooms: ClassroomData[];
    subjects: ReferenceData[];
    teachers: ReferenceData[];
    types: string[];
    studentsForm: GradeFormData[];
    filters: {
        academic_year_id?: string;
        classroom_id?: string;
        subject_id?: string;
        teacher_id?: string;
        type?: string;
    };
}

export default function Index({ academicYears, classrooms, subjects, teachers, types, studentsForm, filters }: Props) {
    
    // Auto-select active academic year if not provided
    const defaultAcademicYear = filters.academic_year_id || (academicYears.find(ay => ay.is_active)?.id || '');
    
    const [academicYearId, setAcademicYearId] = useState(defaultAcademicYear);
    const [classroomId, setClassroomId] = useState(filters.classroom_id || '');
    const [subjectId, setSubjectId] = useState(filters.subject_id || '');
    const [teacherId, setTeacherId] = useState(filters.teacher_id || '');
    const [type, setType] = useState(filters.type || '');

    // Form setup for bulk submit
    const { data, setData, post, processing, errors } = useForm({
        academic_year_id: defaultAcademicYear,
        classroom_id: filters.classroom_id || '',
        subject_id: filters.subject_id || '',
        teacher_id: filters.teacher_id || '',
        type: filters.type || '',
        grades: studentsForm || [],
    });

    // Sinkronisasi form data ketika props 'studentsForm' berubah (setelah filter)
    useEffect(() => {
        setData('grades', studentsForm);
    }, [studentsForm]);

    // Handle filter perubahan
    const applyFilter = (key: string, value: string) => {
        let newFilters = {
            academic_year_id: academicYearId,
            classroom_id: classroomId,
            subject_id: subjectId,
            teacher_id: teacherId,
            type: type,
            [key]: value
        };

        // Update state lokal
        if (key === 'academic_year_id') setAcademicYearId(value);
        if (key === 'classroom_id') setClassroomId(value);
        if (key === 'subject_id') setSubjectId(value);
        if (key === 'teacher_id') setTeacherId(value);
        if (key === 'type') setType(value);

        // Update Form state
        setData(key as any, value);

        // Cek apakah semua filter krusial sudah terisi
        if (newFilters.academic_year_id && newFilters.classroom_id && newFilters.subject_id && newFilters.teacher_id && newFilters.type) {
            router.get('/grades', newFilters, { preserveState: true, preserveScroll: true });
        }
    };

    const handleScoreChange = (studentId: string, scoreStr: string) => {
        let score = parseFloat(scoreStr);
        if (isNaN(score)) score = 0;
        if (score > 100) score = 100;
        if (score < 0) score = 0;

        const updated = data.grades.map(g => 
            g.student_id === studentId ? { ...g, score: score } : g
        );
        setData('grades', updated);
    };

    const handleNotesChange = (studentId: string, description: string) => {
        const updated = data.grades.map(g => 
            g.student_id === studentId ? { ...g, description } : g
        );
        setData('grades', updated);
    };

    // Fungsi Set Semua Nilai Sama
    const setAllScores = () => {
        const score = prompt("Masukkan nilai untuk diterapkan ke SEMUA siswa:", "80");
        if (score !== null) {
            let parsedScore = parseFloat(score);
            if (!isNaN(parsedScore) && parsedScore >= 0 && parsedScore <= 100) {
                const updated = data.grades.map(g => ({ ...g, score: parsedScore }));
                setData('grades', updated);
            } else {
                alert("Nilai tidak valid. Masukkan angka 0-100.");
            }
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/grades', {
            preserveScroll: true,
        });
    };

    const isFilterComplete = academicYearId && classroomId && subjectId && teacherId && type;

    return (
        <AuthenticatedLayout header="Input Nilai / Grades">
            <Head title="Input Nilai" />

            <div className="space-y-6">
                {/* Bagian Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] p-5">
                    <h3 className="text-sm font-semibold text-[#16213E] mb-4 flex items-center gap-2">
                        <Filter className="w-4 h-4 text-[#B8935F]" /> Filter Penilaian
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-[#5B5648] mb-1">Tahun Ajaran</label>
                            <select
                                value={academicYearId}
                                onChange={(e) => applyFilter('academic_year_id', e.target.value)}
                                className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none"
                            >
                                <option value="">-- Pilih --</option>
                                {academicYears.map(ay => (
                                    <option key={ay.id} value={ay.id}>{ay.name} {ay.is_active ? '(Aktif)' : ''}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[#5B5648] mb-1">Kelas</label>
                            <select
                                value={classroomId}
                                onChange={(e) => applyFilter('classroom_id', e.target.value)}
                                className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none"
                            >
                                <option value="">-- Pilih --</option>
                                {classrooms.map(c => (
                                    <option key={c.id} value={c.id}>{c.level ? `Tk.${c.level} - ` : ''}{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[#5B5648] mb-1">Mata Pelajaran</label>
                            <select
                                value={subjectId}
                                onChange={(e) => applyFilter('subject_id', e.target.value)}
                                className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none"
                            >
                                <option value="">-- Pilih --</option>
                                {subjects.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[#5B5648] mb-1">Guru Pengampu</label>
                            <select
                                value={teacherId}
                                onChange={(e) => applyFilter('teacher_id', e.target.value)}
                                className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none"
                            >
                                <option value="">-- Pilih --</option>
                                {teachers.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[#5B5648] mb-1">Jenis Nilai</label>
                            <select
                                value={type}
                                onChange={(e) => applyFilter('type', e.target.value)}
                                className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none"
                            >
                                <option value="">-- Pilih --</option>
                                {types.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Area Input Nilai */}
                {!isFilterComplete ? (
                    <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] py-16 text-center">
                        <FileEdit className="w-16 h-16 mx-auto text-[#E2DDD0] mb-4" />
                        <h3 className="text-lg font-serif font-semibold text-[#16213E]">Lengkapi Filter</h3>
                        <p className="text-[#8B93A8] mt-1 text-sm">Silakan pilih Tahun Ajaran, Kelas, Mapel, Guru, dan Jenis Nilai untuk mulai mengisi nilai.</p>
                    </div>
                ) : data.grades.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] py-16 text-center">
                        <Users className="w-16 h-16 mx-auto text-orange-200 mb-4" />
                        <h3 className="text-lg font-serif font-semibold text-[#16213E]">Tidak ada siswa</h3>
                        <p className="text-[#8B93A8] mt-1 text-sm">Belum ada siswa aktif yang terdaftar di kelas ini.</p>
                    </div>
                ) : (
                    <form onSubmit={submit} className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] overflow-hidden">
                        
                        {/* Header Tabel & Aksi Masal */}
                        <div className="p-4 border-b border-[#E2DDD0] bg-[#FAF8F3] flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex gap-3 items-center text-sm font-semibold text-[#16213E]">
                                <GraduationCap className="w-5 h-5 text-[#B8935F]"/> 
                                {data.grades.length} Siswa ditemukan
                            </div>
                            <div className="flex items-center gap-2">
                                <button type="button" onClick={setAllScores} className="px-3 py-1.5 text-xs font-semibold rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
                                    Set Semua Nilai
                                </button>
                            </div>
                        </div>

                        {/* Tabel Input Nilai */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-[#5B5648]">
                                <thead className="bg-[#FAF8F3] text-[#16213E] font-semibold border-b border-[#E2DDD0]">
                                    <tr>
                                        <th className="px-6 py-4 w-12 text-center">No</th>
                                        <th className="px-6 py-4 min-w-[200px]">Nama Siswa (NIS)</th>
                                        <th className="px-6 py-4 w-40 text-center">Skor Nilai (0-100)</th>
                                        <th className="px-6 py-4">Catatan / Keterangan (Opsional)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E2DDD0]">
                                    {data.grades.map((grade, index) => (
                                        <tr key={grade.student_id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                                            <td className="px-6 py-4 text-center font-medium">{index + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-[#16213E]">{grade.name}</div>
                                                <div className="text-xs text-[#8B93A8]">{grade.nis || '-'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    max="100"
                                                    value={grade.score}
                                                    onChange={(e) => handleScoreChange(grade.student_id, e.target.value)}
                                                    className={`w-full text-center px-3 py-1.5 bg-white border rounded text-sm font-semibold focus:outline-none transition-colors ${grade.score < 75 ? 'text-red-600 border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'text-green-700 border-[#E2DDD0] focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F]'}`}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="text"
                                                    value={grade.description || ''}
                                                    onChange={(e) => handleNotesChange(grade.student_id, e.target.value)}
                                                    placeholder="Keterangan..."
                                                    className="w-full px-3 py-1.5 bg-white border border-[#E2DDD0] rounded text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none placeholder:text-gray-300"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-4 bg-[#FAF8F3] border-t border-[#E2DDD0] flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2 px-6 py-2.5 bg-[#B8935F] hover:bg-[#A37F4B] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-70"
                            >
                                <Save className="w-4 h-4" />
                                {processing ? 'Menyimpan Nilai...' : 'Simpan Nilai'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
