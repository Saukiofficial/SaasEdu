import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';

export default function AttendanceIndex({ classrooms, students, existing_attendances, filters, flash }: any) {
    const [classroomId, setClassroomId] = useState(filters.classroom_id || '');
    const [date, setDate] = useState(filters.date || '');

    // Struktur data untuk menampung absensi semua siswa di kelas tersebut
    const { data, setData, post, processing } = useForm({
        classroom_id: filters.classroom_id || '',
        date: filters.date || '',
        attendances: [] as any[],
    });

    // Menginisialisasi form state setiap kali data siswa/existing_attendances berubah dari server
    useEffect(() => {
        if (students && students.length > 0) {
            const initialAttendances = students.map((student: any) => {
                const existingRecord = existing_attendances[student.id];
                return {
                    student_id: student.id,
                    status: existingRecord ? existingRecord.status : 'hadir', // Default hadir
                    note: existingRecord ? existingRecord.note || '' : '',
                };
            });
            setData('attendances', initialAttendances);
        }
    }, [students, existing_attendances]);

    // Fungsi untuk mengubah query parameter dan memuat ulang data siswa di kelas tersebut
    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (classroomId && date) {
            router.get('/attendances', { classroom_id: classroomId, date: date }, { preserveState: true });
            setData('classroom_id', classroomId);
            setData('date', date);
        } else {
            alert('Silakan pilih kelas dan tanggal terlebih dahulu.');
        }
    };

    // Handler perubahan status absensi per siswa
    const handleAttendanceChange = (studentId: string, field: string, value: string) => {
        const updatedAttendances = data.attendances.map((att: any) => 
            att.student_id === studentId ? { ...att, [field]: value } : att
        );
        setData('attendances', updatedAttendances);
    };

    const submitAttendances = (e: React.FormEvent) => {
        e.preventDefault();
        post('/attendances', { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout header="Absensi Siswa Harian">
            <Head title="Absensi Siswa" />
            
            {/* Filter Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 mb-6">
                <form onSubmit={handleFilterSubmit} className="flex flex-col md:flex-row items-end gap-4">
                    <div className="w-full md:w-1/3 space-y-2">
                        <Label htmlFor="date_filter">Tanggal Absensi</Label>
                        <Input id="date_filter" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                    </div>
                    <div className="w-full md:w-1/3 space-y-2">
                        <Label htmlFor="class_filter">Pilih Kelas</Label>
                        <select id="class_filter" value={classroomId} onChange={e => setClassroomId(e.target.value)} className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800" required>
                            <option value="">-- Pilih Kelas --</option>
                            {classrooms.map((cls: any) => (
                                <option key={cls.id} value={cls.id}>{cls.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full md:w-auto">
                        <Button type="submit">Tampilkan Data Siswa</Button>
                    </div>
                </form>
            </div>

            {/* Attendance Form Section */}
            {students && students.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 dark:bg-slate-950 dark:border-slate-800">
                    <div className="mb-4 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Formulir Pengisian Kehadiran</h2>
                        <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                            {students.length} Siswa
                        </span>
                    </div>

                    {flash?.message && (
                        <div className="mb-4 p-4 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">
                            {flash.message}
                        </div>
                    )}

                    <form onSubmit={submitAttendances}>
                        <div className="border rounded-lg overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead className="w-12 text-center">No</TableHead>
                                        <TableHead>Nama Siswa</TableHead>
                                        <TableHead>NIS</TableHead>
                                        <TableHead className="w-96 text-center">Kehadiran</TableHead>
                                        <TableHead>Keterangan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students.map((student: any, index: number) => {
                                        // Cari state saat ini untuk siswa ini
                                        const currentAtt = data.attendances.find((a:any) => a.student_id === student.id) || { status: 'hadir', note: '' };
                                        
                                        return (
                                            <TableRow key={student.id}>
                                                <TableCell className="text-center">{index + 1}</TableCell>
                                                <TableCell className="font-bold">{student.name}</TableCell>
                                                <TableCell className="text-slate-500">{student.nis || '-'}</TableCell>
                                                <TableCell>
                                                    <div className="flex justify-center gap-2">
                                                        {['hadir', 'izin', 'sakit', 'alpa'].map(status => (
                                                            <label key={status} className={`flex items-center gap-1.5 px-3 py-1.5 rounded cursor-pointer border text-sm transition-colors ${
                                                                currentAtt.status === status 
                                                                    ? (status === 'hadir' ? 'bg-emerald-100 border-emerald-500 text-emerald-800' : 
                                                                       status === 'izin' ? 'bg-blue-100 border-blue-500 text-blue-800' :
                                                                       status === 'sakit' ? 'bg-amber-100 border-amber-500 text-amber-800' :
                                                                       'bg-red-100 border-red-500 text-red-800')
                                                                    : 'bg-white border-slate-200 hover:bg-slate-50'
                                                            }`}>
                                                                <input 
                                                                    type="radio" 
                                                                    className="hidden"
                                                                    name={`status_${student.id}`} 
                                                                    value={status} 
                                                                    checked={currentAtt.status === status}
                                                                    onChange={() => handleAttendanceChange(student.id, 'status', status)}
                                                                />
                                                                <span className="capitalize font-medium">{status}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Input 
                                                        placeholder="Catatan..." 
                                                        className="h-8 text-sm"
                                                        value={currentAtt.note}
                                                        onChange={(e) => handleAttendanceChange(student.id, 'note', e.target.value)}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button type="submit" size="lg" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Semua Data Absensi'}
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                filters.classroom_id && (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
                        <p className="text-slate-500">Tidak ada siswa yang ditemukan di kelas ini.</p>
                    </div>
                )
            )}
        </AuthenticatedLayout>
    );
}