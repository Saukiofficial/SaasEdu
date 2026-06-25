import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Calendar, Filter, Save, Users, UserCheck, UserX, Thermometer, Briefcase } from 'lucide-react';

interface Classroom {
    id: string;
    name: string;
    level: string | null;
}

interface StudentAttendanceData {
    student_id: string;
    name: string;
    nis: string | null;
    gender: 'L' | 'P';
    status: 'present' | 'sick' | 'leave' | 'absent';
    notes: string;
}

interface Props {
    classrooms: Classroom[];
    attendances: StudentAttendanceData[];
    filters: {
        date: string;
        classroom_id: string;
    };
}

export default function Index({ classrooms, attendances, filters }: Props) {
    const [date, setDate] = useState(filters.date);
    const [classroomId, setClassroomId] = useState(filters.classroom_id);

    // Form setup for bulk submit
    const { data, setData, post, processing, errors } = useForm({
        date: filters.date,
        classroom_id: filters.classroom_id,
        attendances: attendances || [],
    });

    // Sinkronisasi form data ketika props 'attendances' berubah
    useEffect(() => {
        setData('attendances', attendances);
    }, [attendances]);

    const handleFilterChange = (newDate: string, newClassroom: string) => {
        setDate(newDate);
        setClassroomId(newClassroom);
        setData('date', newDate);
        setData('classroom_id', newClassroom);

        // Langsung redirect untuk fetch data
        if (newClassroom) {
            router.get('/student-attendances', { date: newDate, classroom_id: newClassroom }, { preserveState: true, preserveScroll: true });
        }
    };

    const handleStatusChange = (studentId: string, newStatus: 'present' | 'sick' | 'leave' | 'absent') => {
        const updated = data.attendances.map(att => 
            att.student_id === studentId ? { ...att, status: newStatus } : att
        );
        setData('attendances', updated);
    };

    const handleNotesChange = (studentId: string, notes: string) => {
        const updated = data.attendances.map(att => 
            att.student_id === studentId ? { ...att, notes } : att
        );
        setData('attendances', updated);
    };

    // Fungsi Set Semua
    const setAllStatus = (status: 'present' | 'sick' | 'leave' | 'absent') => {
        const updated = data.attendances.map(att => ({ ...att, status }));
        setData('attendances', updated);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/student-attendances', {
            preserveScroll: true,
        });
    };

    // Hitung ringkasan
    const stats = {
        present: data.attendances.filter(a => a.status === 'present').length,
        sick: data.attendances.filter(a => a.status === 'sick').length,
        leave: data.attendances.filter(a => a.status === 'leave').length,
        absent: data.attendances.filter(a => a.status === 'absent').length,
    };

    return (
        <AuthenticatedLayout header="Absensi Siswa Harian">
            <Head title="Absensi Siswa" />

            <div className="space-y-6">
                {/* Bagian Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] p-5 flex flex-col md:flex-row gap-4 items-end md:items-center">
                    <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#5B5648] mb-1">Tanggal Absensi</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A296]" />
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => handleFilterChange(e.target.value, classroomId)}
                                    className="w-full pl-9 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#5B5648] mb-1">Pilih Kelas</label>
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A296]" />
                                <select
                                    value={classroomId}
                                    onChange={(e) => handleFilterChange(date, e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none appearance-none"
                                >
                                    <option value="">-- Pilih Kelas Terlebih Dahulu --</option>
                                    {classrooms.map(c => (
                                        <option key={c.id} value={c.id}>{c.level ? `Tk.${c.level} - ` : ''}{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Absensi */}
                {!classroomId ? (
                    <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] py-16 text-center">
                        <Users className="w-16 h-16 mx-auto text-[#E2DDD0] mb-4" />
                        <h3 className="text-lg font-serif font-semibold text-[#16213E]">Pilih Kelas</h3>
                        <p className="text-[#8B93A8] mt-1 text-sm">Silakan pilih kelas pada filter di atas untuk mulai mengisi absensi.</p>
                    </div>
                ) : data.attendances.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] py-16 text-center">
                        <UserX className="w-16 h-16 mx-auto text-orange-200 mb-4" />
                        <h3 className="text-lg font-serif font-semibold text-[#16213E]">Tidak ada siswa</h3>
                        <p className="text-[#8B93A8] mt-1 text-sm">Belum ada siswa aktif yang terdaftar di kelas ini.</p>
                    </div>
                ) : (
                    <form onSubmit={submit} className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] overflow-hidden">
                        
                        {/* Header Tabel & Aksi Masal */}
                        <div className="p-4 border-b border-[#E2DDD0] bg-[#FAF8F3] flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex gap-4 text-sm font-medium">
                                <span className="text-green-600 flex items-center gap-1"><UserCheck className="w-4 h-4"/> Hadir: {stats.present}</span>
                                <span className="text-yellow-600 flex items-center gap-1"><Thermometer className="w-4 h-4"/> Sakit: {stats.sick}</span>
                                <span className="text-blue-600 flex items-center gap-1"><Briefcase className="w-4 h-4"/> Izin: {stats.leave}</span>
                                <span className="text-red-600 flex items-center gap-1"><UserX className="w-4 h-4"/> Alpa: {stats.absent}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-[#8B93A8] mr-2">Set Semua:</span>
                                <button type="button" onClick={() => setAllStatus('present')} className="px-2 py-1 text-[11px] font-semibold uppercase rounded bg-green-100 text-green-700 hover:bg-green-200">Hadir</button>
                                <button type="button" onClick={() => setAllStatus('sick')} className="px-2 py-1 text-[11px] font-semibold uppercase rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200">Sakit</button>
                                <button type="button" onClick={() => setAllStatus('leave')} className="px-2 py-1 text-[11px] font-semibold uppercase rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Izin</button>
                                <button type="button" onClick={() => setAllStatus('absent')} className="px-2 py-1 text-[11px] font-semibold uppercase rounded bg-red-100 text-red-700 hover:bg-red-200">Alpa</button>
                            </div>
                        </div>

                        {/* Tabel Absensi */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-[#5B5648]">
                                <thead className="bg-[#FAF8F3] text-[#16213E] font-semibold border-b border-[#E2DDD0]">
                                    <tr>
                                        <th className="px-6 py-4 w-12 text-center">No</th>
                                        <th className="px-6 py-4 min-w-[200px]">Nama Siswa (NIS)</th>
                                        <th className="px-6 py-4 w-[350px]">Kehadiran</th>
                                        <th className="px-6 py-4">Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E2DDD0]">
                                    {data.attendances.map((att, index) => (
                                        <tr key={att.student_id} className={`transition-colors ${att.status === 'absent' ? 'bg-red-50/50' : 'hover:bg-[#FAF8F3]/50'}`}>
                                            <td className="px-6 py-4 text-center font-medium">{index + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-[#16213E]">{att.name}</div>
                                                <div className="text-xs text-[#8B93A8]">{att.nis || '-'} • {att.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex bg-gray-100 rounded-lg p-1 w-max">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusChange(att.student_id, 'present')}
                                                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${att.status === 'present' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                                    >
                                                        Hadir
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusChange(att.student_id, 'sick')}
                                                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${att.status === 'sick' ? 'bg-white text-yellow-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                                    >
                                                        Sakit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusChange(att.student_id, 'leave')}
                                                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${att.status === 'leave' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                                    >
                                                        Izin
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusChange(att.student_id, 'absent')}
                                                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${att.status === 'absent' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                                    >
                                                        Alpa
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="text"
                                                    value={att.notes || ''}
                                                    onChange={(e) => handleNotesChange(att.student_id, e.target.value)}
                                                    placeholder="Keterangan..."
                                                    className="w-full px-3 py-1.5 bg-white border border-[#E2DDD0] rounded text-sm focus:border-[#B8935F] outline-none placeholder:text-gray-300"
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
                                {processing ? 'Menyimpan Absensi...' : 'Simpan Absensi'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
