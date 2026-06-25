import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Calendar, Save, UserCheck, UserX, Thermometer, Briefcase, BriefcaseBusiness } from 'lucide-react';

interface TeacherAttendanceData {
    teacher_id: string;
    name: string;
    nip: string | null;
    status: 'present' | 'sick' | 'leave' | 'absent';
    notes: string;
}

interface Props {
    attendances: TeacherAttendanceData[];
    filters: {
        date: string;
    };
}

export default function Index({ attendances, filters }: Props) {
    const [date, setDate] = useState(filters.date);

    // Form setup for bulk submit
    const { data, setData, post, processing, errors } = useForm({
        date: filters.date,
        attendances: attendances || [],
    });

    // Sinkronisasi form data ketika props 'attendances' berubah
    useEffect(() => {
        setData('attendances', attendances);
    }, [attendances]);

    const handleDateChange = (newDate: string) => {
        setDate(newDate);
        setData('date', newDate);

        // Langsung redirect untuk fetch data berdasarkan tanggal baru
        router.get('/teacher-attendances', { date: newDate }, { preserveState: true, preserveScroll: true });
    };

    const handleStatusChange = (teacherId: string, newStatus: 'present' | 'sick' | 'leave' | 'absent') => {
        const updated = data.attendances.map(att => 
            att.teacher_id === teacherId ? { ...att, status: newStatus } : att
        );
        setData('attendances', updated);
    };

    const handleNotesChange = (teacherId: string, notes: string) => {
        const updated = data.attendances.map(att => 
            att.teacher_id === teacherId ? { ...att, notes } : att
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
        post('/teacher-attendances', {
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
        <AuthenticatedLayout header="Absensi Guru Harian">
            <Head title="Absensi Guru" />

            <div className="space-y-6">
                {/* Bagian Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] p-5 flex flex-col md:flex-row gap-4 items-end md:items-center">
                    <div className="flex-1 w-full max-w-sm">
                        <label className="block text-sm font-medium text-[#5B5648] mb-1">Pilih Tanggal Absensi</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A296]" />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => handleDateChange(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Form Absensi */}
                {data.attendances.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] py-16 text-center">
                        <BriefcaseBusiness className="w-16 h-16 mx-auto text-[#E2DDD0] mb-4" />
                        <h3 className="text-lg font-serif font-semibold text-[#16213E]">Tidak ada data guru</h3>
                        <p className="text-[#8B93A8] mt-1 text-sm">Belum ada guru dengan status aktif di sistem.</p>
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
                                        <th className="px-6 py-4 min-w-[200px]">Nama Guru (NIP)</th>
                                        <th className="px-6 py-4 w-[350px]">Kehadiran</th>
                                        <th className="px-6 py-4">Keterangan / Alasan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E2DDD0]">
                                    {data.attendances.map((att, index) => (
                                        <tr key={att.teacher_id} className={`transition-colors ${att.status === 'absent' ? 'bg-red-50/50' : 'hover:bg-[#FAF8F3]/50'}`}>
                                            <td className="px-6 py-4 text-center font-medium">{index + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-[#16213E]">{att.name}</div>
                                                <div className="text-xs text-[#8B93A8]">{att.nip || 'Non NIP'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex bg-gray-100 rounded-lg p-1 w-max">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusChange(att.teacher_id, 'present')}
                                                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${att.status === 'present' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                                    >
                                                        Hadir
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusChange(att.teacher_id, 'sick')}
                                                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${att.status === 'sick' ? 'bg-white text-yellow-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                                    >
                                                        Sakit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusChange(att.teacher_id, 'leave')}
                                                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${att.status === 'leave' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                                    >
                                                        Izin
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusChange(att.teacher_id, 'absent')}
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
                                                    onChange={(e) => handleNotesChange(att.teacher_id, e.target.value)}
                                                    placeholder="Isi alasan jika tidak hadir..."
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
