import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';

export default function TeacherIndex({ teachers, flash }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState('');

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        nip: '',
        name: '',
        gender: 'L',
        birth_place: '',
        birth_date: '',
        phone: '',
        address: '',
        status: 'active',
    });

    const openCreateModal = () => {
        reset();
        setIsEdit(false);
        setIsOpen(true);
    };

    const openEditModal = (teacher: any) => {
        setData({
            nip: teacher.nip || '',
            name: teacher.name,
            gender: teacher.gender,
            birth_place: teacher.birth_place || '',
            birth_date: teacher.birth_date ? teacher.birth_date.split('T')[0] : '',
            phone: teacher.phone || '',
            address: teacher.address || '',
            status: teacher.status,
        });
        setEditId(teacher.id);
        setIsEdit(true);
        setIsOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/teachers/${editId}`, { onSuccess: () => setIsOpen(false) });
        } else {
            post('/teachers', { onSuccess: () => setIsOpen(false) });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Yakin ingin menghapus data guru ini?')) {
            destroy(`/teachers/${id}`);
        }
    };

    return (
        <AuthenticatedLayout header="Data Guru">
            <Head title="Manajemen Guru" />
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 dark:bg-slate-950 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-sm text-slate-500">Kelola daftar pengajar dan staf akademik di sekolah Anda.</p>
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreateModal}>+ Tambah Guru</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>{isEdit ? 'Edit Data Guru' : 'Tambah Guru Baru'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={submit} className="space-y-4 pt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nip">NIP (Nomor Induk Pegawai)</Label>
                                        <Input id="nip" value={data.nip} onChange={e => setData('nip', e.target.value)} placeholder="Opsional" />
                                        {errors.nip && <p className="text-sm text-red-500">{errors.nip}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status Pegawai</Label>
                                        <select id="status" value={data.status} onChange={e => setData('status', e.target.value)} className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800">
                                            <option value="active">Aktif</option>
                                            <option value="inactive">Non-Aktif / Cuti</option>
                                            <option value="retired">Pensiun / Berhenti</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Lengkap & Gelar</Label>
                                    <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="gender">Jenis Kelamin</Label>
                                        <select id="gender" value={data.gender} onChange={e => setData('gender', e.target.value)} className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800">
                                            <option value="L">Laki-laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="birth_place">Tempat Lahir</Label>
                                        <Input id="birth_place" value={data.birth_place} onChange={e => setData('birth_place', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="birth_date">Tanggal Lahir</Label>
                                        <Input id="birth_date" type="date" value={data.birth_date} onChange={e => setData('birth_date', e.target.value)} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Nomor Telepon/WA</Label>
                                        <Input id="phone" value={data.phone} onChange={e => setData('phone', e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Alamat Lengkap</Label>
                                    <textarea 
                                        id="address" 
                                        rows={2}
                                        value={data.address} 
                                        onChange={e => setData('address', e.target.value)}
                                        className="flex w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm dark:border-slate-800"
                                    />
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
                                <TableHead>NIP</TableHead>
                                <TableHead>Nama Guru</TableHead>
                                <TableHead>Kontak</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teachers.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">Belum ada data guru.</TableCell>
                                </TableRow>
                            ) : (
                                teachers.data.map((teacher: any) => (
                                    <TableRow key={teacher.id}>
                                        <TableCell>
                                            <div className="font-medium text-slate-900">{teacher.nip || '-'}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-bold">{teacher.name}</div>
                                            <div className="text-xs text-slate-500">{teacher.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">{teacher.phone || '-'}</div>
                                        </TableCell>
                                        <TableCell>
                                            {teacher.status === 'active' && <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold border border-emerald-200">Aktif</span>}
                                            {teacher.status === 'inactive' && <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold border border-amber-200">Non-Aktif</span>}
                                            {teacher.status === 'retired' && <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold border border-slate-200">Pensiun</span>}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => openEditModal(teacher)}>Edit</Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(teacher.id)}>Hapus</Button>
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