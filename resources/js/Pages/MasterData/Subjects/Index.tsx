import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';

export default function SubjectIndex({ subjects, flash }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState('');

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        code: '',
        name: '',
        type: 'Wajib',
        is_active: true,
    });

    const openCreateModal = () => {
        reset();
        setIsEdit(false);
        setIsOpen(true);
    };

    const openEditModal = (subject: any) => {
        setData({
            code: subject.code || '',
            name: subject.name,
            type: subject.type,
            is_active: subject.is_active,
        });
        setEditId(subject.id);
        setIsEdit(true);
        setIsOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/master-data/subjects/${editId}`, { onSuccess: () => setIsOpen(false) });
        } else {
            post('/master-data/subjects', { onSuccess: () => setIsOpen(false) });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Yakin ingin menghapus mata pelajaran ini?')) {
            destroy(`/master-data/subjects/${id}`);
        }
    };

    return (
        <AuthenticatedLayout header="Mata Pelajaran">
            <Head title="Master Data - Mata Pelajaran" />
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 dark:bg-slate-950 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-sm text-slate-500">Kelola daftar mata pelajaran yang diajarkan di sekolah Anda.</p>
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreateModal}>+ Tambah Mata Pelajaran</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{isEdit ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={submit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Kode Mata Pelajaran (Opsional)</Label>
                                    <Input id="code" placeholder="Misal: MAT-01" value={data.code} onChange={e => setData('code', e.target.value)} />
                                    {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Mata Pelajaran</Label>
                                    <Input id="name" placeholder="Misal: Matematika Lanjut" value={data.name} onChange={e => setData('name', e.target.value)} />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Jenis Mata Pelajaran</Label>
                                    <select 
                                        id="type" 
                                        value={data.type} 
                                        onChange={e => setData('type', e.target.value)}
                                        className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:focus-visible:ring-slate-300"
                                    >
                                        <option value="Wajib">Wajib</option>
                                        <option value="Peminatan">Peminatan</option>
                                        <option value="Muatan Lokal">Muatan Lokal</option>
                                    </select>
                                    {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                                </div>
                                <div className="flex items-center space-x-2 mt-4">
                                    <input type="checkbox" id="is_active" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="rounded border-gray-300 text-blue-600 shadow-sm" />
                                    <Label htmlFor="is_active">Aktif (Diajarkan saat ini)</Label>
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
                                <TableHead>Kode</TableHead>
                                <TableHead>Mata Pelajaran</TableHead>
                                <TableHead>Jenis</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subjects.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">Belum ada data Mata Pelajaran.</TableCell>
                                </TableRow>
                            ) : (
                                subjects.map((subject: any) => (
                                    <TableRow key={subject.id}>
                                        <TableCell className="font-medium text-slate-500">{subject.code || '-'}</TableCell>
                                        <TableCell className="font-bold">{subject.name}</TableCell>
                                        <TableCell>{subject.type}</TableCell>
                                        <TableCell>
                                            {subject.is_active ? (
                                                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-bold dark:bg-emerald-900/50 dark:text-emerald-400">Aktif</span>
                                            ) : (
                                                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium dark:bg-slate-800 dark:text-slate-400">Non-Aktif</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => openEditModal(subject)}>Edit</Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(subject.id)}>Hapus</Button>
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