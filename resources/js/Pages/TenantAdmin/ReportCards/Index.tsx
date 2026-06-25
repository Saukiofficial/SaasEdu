import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Filter, Printer, Users, FileText, Search } from 'lucide-react';

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

interface StudentData {
    id: string;
    name: string;
    nis: string | null;
    average_score: number;
}

interface Props {
    academicYears: AcademicYearData[];
    classrooms: ClassroomData[];
    students: StudentData[];
    filters: {
        academic_year_id?: string;
        classroom_id?: string;
    };
}

export default function Index({ academicYears, classrooms, students, filters }: Props) {
    const defaultAcademicYear = filters.academic_year_id || (academicYears.find(ay => ay.is_active)?.id || '');
    
    const [academicYearId, setAcademicYearId] = useState(defaultAcademicYear);
    const [classroomId, setClassroomId] = useState(filters.classroom_id || '');
    const [search, setSearch] = useState('');

    const applyFilter = (key: string, value: string) => {
        let newFilters = {
            academic_year_id: academicYearId,
            classroom_id: classroomId,
            [key]: value
        };

        if (key === 'academic_year_id') setAcademicYearId(value);
        if (key === 'classroom_id') setClassroomId(value);

        if (newFilters.academic_year_id && newFilters.classroom_id) {
            router.get('/report-cards', newFilters, { preserveState: true, preserveScroll: true });
        }
    };

    const isFilterComplete = academicYearId && classroomId;

    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(search.toLowerCase()) || 
        (student.nis && student.nis.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <AuthenticatedLayout header="Cetak Rapor Siswa">
            <Head title="Cetak Rapor" />

            <div className="space-y-6">
                {/* Bagian Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] p-5">
                    <h3 className="text-sm font-semibold text-[#16213E] mb-4 flex items-center gap-2">
                        <Filter className="w-4 h-4 text-[#B8935F]" /> Filter Kelas & Tahun Ajaran
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                        <div>
                            <label className="block text-xs font-medium text-[#5B5648] mb-1">Tahun Ajaran</label>
                            <select
                                value={academicYearId}
                                onChange={(e) => applyFilter('academic_year_id', e.target.value)}
                                className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none"
                            >
                                <option value="">-- Pilih Tahun Ajaran --</option>
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
                                <option value="">-- Pilih Kelas --</option>
                                {classrooms.map(c => (
                                    <option key={c.id} value={c.id}>{c.level ? `Tk.${c.level} - ` : ''}{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Area Daftar Siswa */}
                {!isFilterComplete ? (
                    <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] py-16 text-center">
                        <FileText className="w-16 h-16 mx-auto text-[#E2DDD0] mb-4" />
                        <h3 className="text-lg font-serif font-semibold text-[#16213E]">Lengkapi Filter</h3>
                        <p className="text-[#8B93A8] mt-1 text-sm">Pilih Tahun Ajaran dan Kelas untuk melihat daftar siswa dan mencetak rapor.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] overflow-hidden">
                        <div className="p-4 border-b border-[#E2DDD0] bg-[#FAF8F3] flex justify-between items-center">
                            <div className="relative w-full max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A296]" />
                                <input
                                    type="text"
                                    placeholder="Cari siswa..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-white border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none transition-all"
                                />
                            </div>
                            <span className="text-sm font-semibold text-[#5B5648]">{filteredStudents.length} Siswa</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-[#5B5648]">
                                <thead className="bg-[#FAF8F3] text-[#16213E] font-semibold border-b border-[#E2DDD0]">
                                    <tr>
                                        <th className="px-6 py-4 w-16 text-center">No</th>
                                        <th className="px-6 py-4">Nama Siswa</th>
                                        <th className="px-6 py-4 text-center">Rata-rata Nilai</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E2DDD0]">
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((student, index) => (
                                            <tr key={student.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                                                <td className="px-6 py-4 text-center font-medium">{index + 1}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-[#16213E]">{student.name}</div>
                                                    <div className="text-xs text-[#8B93A8]">NIS: {student.nis || '-'}</div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded font-semibold text-xs ${student.average_score >= 75 ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                                                        {student.average_score}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link 
                                                        href={`/report-cards/${student.id}?academic_year_id=${academicYearId}`}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[#16213E] text-[#D4AF7A] hover:bg-[#1C2A4F] transition-colors"
                                                    >
                                                        <Printer className="w-3.5 h-3.5" />
                                                        Preview & Cetak
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-[#8B93A8]">
                                                <Users className="w-12 h-12 mx-auto text-[#E2DDD0] mb-3" />
                                                Data siswa tidak ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
