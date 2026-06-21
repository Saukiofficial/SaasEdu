import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';

export default function ExamIndex({ exams, classrooms, subjects, filters, flash }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState('');
    const [filterClass, setFilterClass] = useState(filters.classroom_id || '');

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        classroom_id: '',
        subject_id: '',
        title: '',
        start_time: '',
        end_time: '',
        duration_minutes: 60,
        description: '',
    });

    const openCreateModal = () => {
        reset();
        setIsEdit(false);
        setIsOpen(true);
    };

    const openEditModal = (item: any) => {
        setData({
            classroom_id: item.classroom_id,
            subject_id: item.subject_id,
            title: item.title,
            start_time: item.start_time ? item.start_time.substring(0, 16) : '',
            end_time: item.end_time ? item.end_time.substring(0, 16) : '',
            duration_minutes: item.duration_minutes,
            description: item.description || '',
        });
        setEditId(item.id);
        setIsEdit(true);
        setIsOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/exams/${editId}`, { onSuccess: () => setIsOpen(false) });
        } else {
            post('/exams', { onSuccess: () => setIsOpen(false) });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Yakin ingin menghapus jadwal ujian ini? Semua data terkait soal juga bisa terhapus.')) {
            destroy(`/exams/${id}`);
        }
    };

    const applyFilters = () => {
        router.get('/exams', { classroom_id: filterClass }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout header="LMS: Ujian Online (CBT)">
            <Head title="CBT - Ujian Online" />

            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div className="flex w-full md:w-auto gap-4 flex-1">
                        <div className="w-1/2 md:w-48 space-y-2">
                            <Label>Filter Kelas</Label>
                            <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800">
                                <option value="">Semua Kelas</option>
                                {classrooms.map((cls: any) => (
                                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="pb-0.5">
                            <Button variant="secondary" onClick={applyFilters}>Terapkan</Button>
                        </div>
                    </div>

                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreateModal}>+ Jadwal Ujian Baru</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>{isEdit ? 'Edit Ujian' : 'Buat Ujian Baru'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={submit} className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto px-1">
                                <div className="space-y-2">
                                    <Label>Judul Ujian</Label>
                                    <Input placeholder="Misal: Ujian Akhir Semester" value={data.title} onChange={e => setData('title', e.target.value)} required />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Kelas Tujuan</Label>
                                        <select value={data.classroom_id} onChange={e => setData('classroom_id', e.target.value)} className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800" required>
                                            <option value="">-- Kelas --</option>
                                            {classrooms.map((cls: any) => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
                                        </select>
                                        {errors.classroom_id && <p className="text-sm text-red-500">{errors.classroom_id}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Mata Pelajaran</Label>
                                        <select value={data.subject_id} onChange={e => setData('subject_id', e.target.value)} className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800" required>
                                            <option value="">-- Mapel --</option>
                                            {subjects.map((sub: any) => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                                        </select>
                                        {errors.subject_id && <p className="text-sm text-red-500">{errors.subject_id}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Waktu Mulai</Label>
                                        <Input type="datetime-local" value={data.start_time} onChange={e => setData('start_time', e.target.value)} required />
                                        {errors.start_time && <p className="text-sm text-red-500">{errors.start_time}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Waktu Ditutup</Label>
                                        <Input type="datetime-local" value={data.end_time} onChange={e => setData('end_time', e.target.value)} required />
                                        {errors.end_time && <p className="text-sm text-red-500">{errors.end_time}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Durasi (Menit)</Label>
                                        <Input type="number" min="1" value={data.duration_minutes} onChange={e => setData('duration_minutes', parseInt(e.target.value))} required />
                                        {errors.duration_minutes && <p className="text-sm text-red-500">{errors.duration_minutes}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Instruksi / Peraturan Ujian</Label>
                                    <textarea 
                                        rows={3}
                                        value={data.description} 
                                        onChange={e => setData('description', e.target.value)}
                                        className="flex w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm dark:border-slate-800"
                                        placeholder="Misal: Dilarang mencontek, gunakan kalkulator jika perlu..."
                                    />
                                </div>

                                <Button type="submit" className="w-full mt-4" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Jadwal Ujian'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {flash?.message && (
                    <div className="mt-6 p-4 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">
                        {flash.message}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 dark:bg-slate-950 dark:border-slate-800 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Ujian & Mapel</TableHead>
                            <TableHead>Kelas Tujuan</TableHead>
                            <TableHead>Waktu Pelaksanaan</TableHead>
                            <TableHead>Durasi</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {exams.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-slate-500">Belum ada data ujian yang dijadwalkan.</TableCell>
                            </TableRow>
                        ) : (
                            exams.data.map((exam: any) => (
                                <TableRow key={exam.id}>
                                    <TableCell>
                                        <div className="font-bold text-slate-900">{exam.title}</div>
                                        <div className="text-xs text-slate-500 mt-1">{exam.subject?.name}</div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded text-xs border border-blue-200">
                                            {exam.classroom?.name}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm font-medium text-emerald-600">Mulai: {new Date(exam.start_time).toLocaleString('id-ID')}</div>
                                        <div className="text-xs text-red-500 mt-1">Tutup: {new Date(exam.end_time).toLocaleString('id-ID')}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm font-semibold">{exam.duration_minutes} Menit</div>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => openEditModal(exam)}>Edit</Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(exam.id)}>Hapus</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </AuthenticatedLayout>
    );
}