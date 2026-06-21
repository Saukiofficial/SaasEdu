import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';

export default function StudentIndex({ students, classrooms, flash }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState('');

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        nis: '',
        nisn: '',
        name: '',
        gender: 'L',
        classroom_id: '',
        parent_name: '',
        parent_phone: '',
        status: 'active',
    });

    const openCreateModal = () => {
        reset();
        setIsEdit(false);
        setIsOpen(true);
    };

    const openEditModal = (student: any) => {
        setData({
            nis: student.nis || '',
            nisn: student.nisn || '',
            name: student.name,
            gender: student.gender,
            classroom_id: student.classroom_id || '',
            parent_name: student.parent_name || '',
            parent_phone: student.parent_phone || '',
            status: student.status,
        });
        setEditId(student.id);
        setIsEdit(true);
        setIsOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/students/${editId}`, { onSuccess: () => setIsOpen(false) });
        } else {
            post('/students', { onSuccess: () => setIsOpen(false) });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Yakin ingin menghapus data siswa ini?')) {
            destroy(`/students/${id}`);
        }
    };

    return (
        <AuthenticatedLayout header="Data Siswa">
            <Head title="Manajemen Siswa" />
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 dark:bg-slate-950 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-sm text-slate-500">Kelola daftar siswa dan penempatan kelas mereka.</p>
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreateModal}>+ Tambah Siswa</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>{isEdit ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={submit} className="space-y-4 pt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nis">NIS (Nomor Induk Siswa)</Label>
                                        <Input id="nis" value={data.nis} onChange={e => setData('nis', e.target.value)} />
                                        {errors.nis && <p className="text-sm text-red-500">{errors.nis}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nisn">NISN</Label>
                                        <Input id="nisn" value={data.nisn} onChange={e => setData('nisn', e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Lengkap Siswa</Label>
                                    <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="gender">Jenis Kelamin</Label>
                                        <select id="gender" value={data.gender} onChange={e => setData('gender', e.target.value)} className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800">
                                            <option value="L">Laki-laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="classroom_id">Penempatan Kelas</Label>
                                        <select id="classroom_id" value={data.classroom_id} onChange={e => setData('classroom_id', e.target.value)} className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800">
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
                                        <Label htmlFor="parent_name">Nama Orang Tua/Wali</Label>
                                        <Input id="parent_name" value={data.parent_name} onChange={e => setData('parent_name', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="parent_phone">No. HP Orang Tua</Label>
                                        <Input id="parent_phone" value={data.parent_phone} onChange={e => setData('parent_phone', e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status Siswa</Label>
                                    <select id="status" value={data.status} onChange={e => setData('status', e.target.value)} className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800">
                                        <option value="active">Aktif</option>
                                        <option value="graduated">Lulus</option>
                                        <option value="dropped_out">Keluar / Pindah</option>
                                    </select>
                                </div>
                                <Button type="submit" className="w-full mt-4" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Data'}
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
                                <TableHead>NIS/NISN</TableHead>
                                <TableHead>Nama Siswa</TableHead>
                                <TableHead>Kelas</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">Belum ada data siswa.</TableCell>
                                </TableRow>
                            ) : (
                                students.data.map((student: any) => (
                                    <TableRow key={student.id}>
                                        <TableCell>
                                            <div className="font-medium text-slate-900">{student.nis || '-'}</div>
                                            <div className="text-xs text-slate-500">{student.nisn || '-'}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-bold">{student.name}</div>
                                            <div className="text-xs text-slate-500">{student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</div>
                                        </TableCell>
                                        <TableCell>
                                            {student.classroom ? (
                                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold border border-blue-200">{student.classroom.name}</span>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">Belum ada kelas</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {student.status === 'active' && <span className="text-emerald-600 font-medium text-sm">Aktif</span>}
                                            {student.status === 'graduated' && <span className="text-blue-600 font-medium text-sm">Lulus</span>}
                                            {student.status === 'dropped_out' && <span className="text-red-600 font-medium text-sm">Keluar</span>}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => openEditModal(student)}>Edit</Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(student.id)}>Hapus</Button>
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