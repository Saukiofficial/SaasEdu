import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';

export default function ScheduleIndex({ schedules, academicYears, classrooms, subjects, teachers, flash }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState('');

    const defaultAcademicYear = academicYears.length > 0 ? academicYears[0].id : '';

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        academic_year_id: defaultAcademicYear,
        classroom_id: '',
        subject_id: '',
        teacher_id: '',
        day: 'Senin',
        start_time: '',
        end_time: '',
    });

    const openCreateModal = () => {
        reset();
        setData('academic_year_id', defaultAcademicYear);
        setIsEdit(false);
        setIsOpen(true);
    };

    const openEditModal = (schedule: any) => {
        setData({
            academic_year_id: schedule.academic_year_id,
            classroom_id: schedule.classroom_id,
            subject_id: schedule.subject_id,
            teacher_id: schedule.teacher_id,
            day: schedule.day,
            start_time: schedule.start_time.substring(0, 5), // Ambil format HH:mm
            end_time: schedule.end_time.substring(0, 5),     // Ambil format HH:mm
        });
        setEditId(schedule.id);
        setIsEdit(true);
        setIsOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/schedules/${editId}`, { onSuccess: () => setIsOpen(false) });
        } else {
            post('/schedules', { onSuccess: () => setIsOpen(false) });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Yakin ingin menghapus jadwal ini?')) {
            destroy(`/schedules/${id}`);
        }
    };

    return (
        <AuthenticatedLayout header="Penjadwalan Pelajaran">
            <Head title="Jadwal Akademik" />
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 dark:bg-slate-950 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-sm text-slate-500">Kelola jadwal pelajaran untuk setiap kelas.</p>
                        {academicYears.length === 0 && (
                            <p className="text-xs text-red-500 mt-1">Peringatan: Belum ada Tahun Ajaran yang diset aktif.</p>
                        )}
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreateModal} disabled={academicYears.length === 0}>
                                + Tambah Jadwal
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>{isEdit ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={submit} className="space-y-4 pt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="academic_year_id">Tahun Ajaran Aktif</Label>
                                        <select id="academic_year_id" value={data.academic_year_id} onChange={e => setData('academic_year_id', e.target.value)} className="flex h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-sm shadow-sm dark:bg-slate-900 dark:border-slate-800" disabled>
                                            {academicYears.map((ay: any) => (
                                                <option key={ay.id} value={ay.id}>{ay.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="classroom_id">Pilih Kelas</Label>
                                        <select id="classroom_id" value={data.classroom_id} onChange={e => setData('classroom_id', e.target.value)} className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800" required>
                                            <option value="">-- Pilih Kelas --</option>
                                            {classrooms.map((cls: any) => (
                                                <option key={cls.id} value={cls.id}>{cls.name}</option>
                                            ))}
                                        </select>
                                        {errors.classroom_id && <p className="text-sm text-red-500">{errors.classroom_id}</p>}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="subject_id">Mata Pelajaran</Label>
                                        <select id="subject_id" value={data.subject_id} onChange={e => setData('subject_id', e.target.value)} className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800" required>
                                            <option value="">-- Pilih Mapel --</option>
                                            {subjects.map((sub: any) => (
                                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                                            ))}
                                        </select>
                                        {errors.subject_id && <p className="text-sm text-red-500">{errors.subject_id}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="teacher_id">Guru Pengajar</Label>
                                        <select id="teacher_id" value={data.teacher_id} onChange={e => setData('teacher_id', e.target.value)} className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800" required>
                                            <option value="">-- Pilih Guru --</option>
                                            {teachers.map((tea: any) => (
                                                <option key={tea.id} value={tea.id}>{tea.name}</option>
                                            ))}
                                        </select>
                                        {errors.teacher_id && <p className="text-sm text-red-500">{errors.teacher_id}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="day">Hari</Label>
                                        <select id="day" value={data.day} onChange={e => setData('day', e.target.value)} className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800">
                                            {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map(day => (
                                                <option key={day} value={day}>{day}</option>
                                            ))}
                                        </select>
                                        {errors.day && <p className="text-sm text-red-500">{errors.day}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="start_time">Jam Mulai</Label>
                                        <Input id="start_time" type="time" value={data.start_time} onChange={e => setData('start_time', e.target.value)} required />
                                        {errors.start_time && <p className="text-sm text-red-500">{errors.start_time}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="end_time">Jam Selesai</Label>
                                        <Input id="end_time" type="time" value={data.end_time} onChange={e => setData('end_time', e.target.value)} required />
                                        {errors.end_time && <p className="text-sm text-red-500">{errors.end_time}</p>}
                                    </div>
                                </div>

                                <Button type="submit" className="w-full mt-4" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Jadwal'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {flash?.message && (
                    <div className="mb-4 p-4 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">
                        {flash.message}
                    </div>
                )}

                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead>Hari & Waktu</TableHead>
                                <TableHead>Kelas</TableHead>
                                <TableHead>Mata Pelajaran</TableHead>
                                <TableHead>Guru Pengajar</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {schedules.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">Belum ada jadwal yang dibuat.</TableCell>
                                </TableRow>
                            ) : (
                                schedules.data.map((schedule: any) => (
                                    <TableRow key={schedule.id}>
                                        <TableCell>
                                            <div className="font-bold text-slate-900">{schedule.day}</div>
                                            <div className="text-xs text-slate-500">
                                                {schedule.start_time.substring(0, 5)} - {schedule.end_time.substring(0, 5)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium text-blue-700">{schedule.classroom?.name}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{schedule.subject?.name}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">{schedule.teacher?.name}</div>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => openEditModal(schedule)}>Edit</Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(schedule.id)}>Hapus</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}