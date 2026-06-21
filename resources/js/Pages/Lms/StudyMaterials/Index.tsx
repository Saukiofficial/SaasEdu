import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';

export default function StudyMaterialIndex({ materials, classrooms, subjects, teachers, filters, flash }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState('');

    const [filterClass, setFilterClass] = useState(filters.classroom_id || '');
    const [filterType, setFilterType] = useState(filters.type || '');

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        classroom_id: '',
        subject_id: '',
        teacher_id: '',
        title: '',
        type: 'material',
        description: '',
        file_url: '',
        due_date: '',
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
            teacher_id: item.teacher_id,
            title: item.title,
            type: item.type,
            description: item.description || '',
            file_url: item.file_url || '',
            due_date: item.due_date ? item.due_date.substring(0, 16) : '', // Format datetime-local
        });
        setEditId(item.id);
        setIsEdit(true);
        setIsOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/study-materials/${editId}`, { onSuccess: () => setIsOpen(false) });
        } else {
            post('/study-materials', { onSuccess: () => setIsOpen(false) });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Yakin ingin menghapus data LMS ini?')) {
            destroy(`/study-materials/${id}`);
        }
    };

    const applyFilters = () => {
        router.get('/study-materials', { classroom_id: filterClass, type: filterType }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout header="LMS: Materi & Tugas">
            <Head title="LMS - EduERP" />

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
                        <div className="w-1/2 md:w-48 space-y-2">
                            <Label>Filter Jenis</Label>
                            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800">
                                <option value="">Semua Jenis</option>
                                <option value="material">Materi Pelajaran</option>
                                <option value="assignment">Tugas Mandiri</option>
                            </select>
                        </div>
                        <div className="pb-0.5">
                            <Button variant="secondary" onClick={applyFilters}>Terapkan</Button>
                        </div>
                    </div>

                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreateModal}>+ Tambah Baru</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>{isEdit ? 'Edit Materi/Tugas' : 'Tambah Materi/Tugas Baru'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={submit} className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto px-1">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Jenis Konten</Label>
                                        <select value={data.type} onChange={e => setData('type', e.target.value)} className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800" required>
                                            <option value="material">Materi Pelajaran</option>
                                            <option value="assignment">Tugas Mandiri</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Judul {data.type === 'material' ? 'Materi' : 'Tugas'}</Label>
                                        <Input placeholder="Misal: Bab 1 - Pengenalan Sel" value={data.title} onChange={e => setData('title', e.target.value)} required />
                                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
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
                                    <div className="space-y-2">
                                        <Label>Guru Pengajar</Label>
                                        <select value={data.teacher_id} onChange={e => setData('teacher_id', e.target.value)} className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800" required>
                                            <option value="">-- Guru --</option>
                                            {teachers.map((tea: any) => <option key={tea.id} value={tea.id}>{tea.name}</option>)}
                                        </select>
                                        {errors.teacher_id && <p className="text-sm text-red-500">{errors.teacher_id}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Deskripsi / Instruksi Tambahan</Label>
                                    <textarea 
                                        rows={3}
                                        value={data.description} 
                                        onChange={e => setData('description', e.target.value)}
                                        className="flex w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm dark:border-slate-800"
                                        placeholder="Tuliskan instruksi tugas atau ringkasan materi..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Link File / Video (Opsional)</Label>
                                    <Input type="url" placeholder="[https://drive.google.com/](https://drive.google.com/)..." value={data.file_url} onChange={e => setData('file_url', e.target.value)} />
                                    {errors.file_url && <p className="text-sm text-red-500">{errors.file_url}</p>}
                                </div>

                                {data.type === 'assignment' && (
                                    <div className="space-y-2 border-t pt-4 mt-4 dark:border-slate-800">
                                        <Label className="text-red-600 dark:text-red-400">Batas Waktu Pengumpulan (Due Date)</Label>
                                        <Input type="datetime-local" value={data.due_date} onChange={e => setData('due_date', e.target.value)} required={data.type === 'assignment'} />
                                        {errors.due_date && <p className="text-sm text-red-500">{errors.due_date}</p>}
                                    </div>
                                )}

                                <Button type="submit" className="w-full mt-4" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Konten'}
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
                            <TableHead>Jenis Konten</TableHead>
                            <TableHead>Judul & Mapel</TableHead>
                            <TableHead>Kelas & Pengajar</TableHead>
                            <TableHead>Batas Waktu (Tugas)</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {materials.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-slate-500">Belum ada data materi atau tugas.</TableCell>
                            </TableRow>
                        ) : (
                            materials.data.map((item: any) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        {item.type === 'material' ? (
                                            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold">Materi</span>
                                        ) : (
                                            <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-bold">Tugas Mandiri</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-bold text-slate-900">{item.title}</div>
                                        <div className="text-xs text-slate-500 mt-1">{item.subject?.name}</div>
                                        {item.file_url && (
                                            <a href={item.file_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Lihat Lampiran</a>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{item.classroom?.name}</div>
                                        <div className="text-xs text-slate-500">{item.teacher?.name}</div>
                                    </TableCell>
                                    <TableCell>
                                        {item.type === 'assignment' && item.due_date ? (
                                            <div className="text-sm font-medium text-red-600">{new Date(item.due_date).toLocaleString('id-ID')}</div>
                                        ) : (
                                            <span className="text-slate-400">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => openEditModal(item)}>Edit</Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>Hapus</Button>
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
