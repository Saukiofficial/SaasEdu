import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';

export default function AcademicYearIndex({ academicYears, flash }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState('');

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        start_date: '',
        end_date: '',
        is_active: false,
    });

    const openCreateModal = () => {
        reset();
        setIsEdit(false);
        setIsOpen(true);
    };

    const openEditModal = (year: any) => {
        setData({
            name: year.name,
            start_date: year.start_date ? year.start_date.split('T')[0] : '',
            end_date: year.end_date ? year.end_date.split('T')[0] : '',
            is_active: year.is_active,
        });
        setEditId(year.id);
        setIsEdit(true);
        setIsOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/master-data/academic-years/${editId}`, { onSuccess: () => setIsOpen(false) });
        } else {
            post('/master-data/academic-years', { onSuccess: () => setIsOpen(false) });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Yakin ingin menghapus data ini?')) {
            destroy(`/master-data/academic-years/${id}`);
        }
    };

    return (
        <AuthenticatedLayout header="Manajemen Tahun Ajaran">
            <Head title="Master Data - Tahun Ajaran" />
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 dark:bg-slate-950 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-sm text-slate-500">Kelola data tahun ajaran dan semester yang aktif di sekolah Anda.</p>
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreateModal}>+ Tambah Tahun Ajaran</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{isEdit ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran Baru'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={submit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Tahun Ajaran</Label>
                                    <Input id="name" placeholder="Contoh: 2023/2024 Ganjil" value={data.name} onChange={e => setData('name', e.target.value)} />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="start_date">Tanggal Mulai</Label>
                                        <Input id="start_date" type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="end_date">Tanggal Selesai</Label>
                                        <Input id="end_date" type="date" value={data.end_date} onChange={e => setData('end_date', e.target.value)} />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 mt-4">
                                    <input type="checkbox" id="is_active" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500" />
                                    <Label htmlFor="is_active">Set sebagai Tahun Ajaran Aktif</Label>
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
                                <TableHead>Nama Tahun Ajaran</TableHead>
                                <TableHead>Tanggal Mulai</TableHead>
                                <TableHead>Tanggal Selesai</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {academicYears.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">Belum ada data Tahun Ajaran.</TableCell>
                                </TableRow>
                            ) : (
                                academicYears.map((year: any) => (
                                    <TableRow key={year.id}>
                                        <TableCell className="font-medium">{year.name}</TableCell>
                                        <TableCell>{year.start_date ? new Date(year.start_date).toLocaleDateString('id-ID') : '-'}</TableCell>
                                        <TableCell>{year.end_date ? new Date(year.end_date).toLocaleDateString('id-ID') : '-'}</TableCell>
                                        <TableCell>
                                            {year.is_active ? (
                                                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-bold dark:bg-emerald-900/50 dark:text-emerald-400">Aktif Sekarang</span>
                                            ) : (
                                                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium dark:bg-slate-800 dark:text-slate-400">Non-Aktif</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => openEditModal(year)}>Edit</Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(year.id)}>Hapus</Button>
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