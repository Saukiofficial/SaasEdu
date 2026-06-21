import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';

export default function ClassroomIndex({ classrooms, flash }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState('');

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        level: '',
        capacity: 30,
    });

    const openCreateModal = () => {
        reset();
        setIsEdit(false);
        setIsOpen(true);
    };

    const openEditModal = (classroom: any) => {
        setData({
            name: classroom.name,
            level: classroom.level || '',
            capacity: classroom.capacity,
        });
        setEditId(classroom.id);
        setIsEdit(true);
        setIsOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/master-data/classrooms/${editId}`, { onSuccess: () => setIsOpen(false) });
        } else {
            post('/master-data/classrooms', { onSuccess: () => setIsOpen(false) });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Yakin ingin menghapus kelas ini?')) {
            destroy(`/master-data/classrooms/${id}`);
        }
    };

    return (
        <AuthenticatedLayout header="Kelas & Ruangan">
            <Head title="Master Data - Kelas" />
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 dark:bg-slate-950 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-sm text-slate-500">Kelola daftar kelas dan kapasitas ruangan belajar di sekolah Anda.</p>
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreateModal}>+ Tambah Kelas</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{isEdit ? 'Edit Kelas' : 'Tambah Kelas Baru'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={submit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Kelas / Ruangan</Label>
                                    <Input id="name" placeholder="Misal: X MIPA 1 atau Ruang A" value={data.name} onChange={e => setData('name', e.target.value)} />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="level">Tingkat / Level (Opsional)</Label>
                                        <Input id="level" placeholder="Misal: 10 atau VII" value={data.level} onChange={e => setData('level', e.target.value)} />
                                        {errors.level && <p className="text-sm text-red-500">{errors.level}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="capacity">Kapasitas Siswa</Label>
                                        <Input id="capacity" type="number" min="1" value={data.capacity} onChange={e => setData('capacity', parseInt(e.target.value))} />
                                        {errors.capacity && <p className="text-sm text-red-500">{errors.capacity}</p>}
                                    </div>
                                </div>
                                <Button type="submit" className="w-full mt-4" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Data'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {flash?.message && (
                    <div className="mb-4 p-4 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
                        {flash.message}
                    </div>
                )}

                <div className="border rounded-lg overflow-hidden dark:border-slate-800">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                            <TableRow>
                                <TableHead>Nama Kelas</TableHead>
                                <TableHead>Tingkat / Level</TableHead>
                                <TableHead>Kapasitas</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {classrooms.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-slate-500">Belum ada data Kelas.</TableCell>
                                </TableRow>
                            ) : (
                                classrooms.map((classroom: any) => (
                                    <TableRow key={classroom.id}>
                                        <TableCell className="font-bold">{classroom.name}</TableCell>
                                        <TableCell>{classroom.level || '-'}</TableCell>
                                        <TableCell>{classroom.capacity} Siswa</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => openEditModal(classroom)}>Edit</Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(classroom.id)}>Hapus</Button>
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
