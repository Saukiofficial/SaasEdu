import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';

export default function PackageIndex({ packages, flash }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState('');

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        description: '',
        price: 0,
        duration_days: 30,
        max_students: '' as string | number,
        max_users: '' as string | number,
        features: '', // akan kita input sebagai teks pisah koma
        is_active: true,
    });

    const openCreateModal = () => {
        reset();
        setIsEdit(false);
        setIsOpen(true);
    };

    const openEditModal = (pkg: any) => {
        setData({
            name: pkg.name,
            description: pkg.description || '',
            price: pkg.price,
            duration_days: pkg.duration_days,
            max_students: pkg.max_students || '',
            max_users: pkg.max_users || '',
            features: pkg.features ? pkg.features.join(', ') : '',
            is_active: pkg.is_active,
        });
        setEditId(pkg.id);
        setIsEdit(true);
        setIsOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Bersihkan data kosong agar jadi null
        const payload = { ...data };
        if (payload.max_students === '') payload.max_students = null as any;
        if (payload.max_users === '') payload.max_users = null as any;

        if (isEdit) {
            router.put(`/super-admin/packages/${editId}`, payload, { onSuccess: () => setIsOpen(false) });
        } else {
            router.post('/super-admin/packages', payload, { onSuccess: () => setIsOpen(false) });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Yakin ingin menghapus paket ini?')) {
            destroy(`/super-admin/packages/${id}`);
        }
    };

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    };

    return (
        <AuthenticatedLayout header="Manajemen Paket Langganan">
            <Head title="SaaS - Manajemen Paket" />
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 dark:bg-slate-950 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6 border-b pb-4 dark:border-slate-800">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Daftar Paket SaaS</h2>
                        <p className="text-sm text-slate-500 mt-1">Buat opsi berlangganan, harga, dan batasan limit untuk klien Anda.</p>
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreateModal}>+ Tambah Paket</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{isEdit ? 'Edit Paket' : 'Buat Paket Baru'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={submit} className="space-y-4 pt-4 px-1">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nama Paket (Contoh: Basic, Pro)</Label>
                                        <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Harga (Rp)</Label>
                                        <Input id="price" type="number" min="0" value={data.price} onChange={e => setData('price', parseFloat(e.target.value))} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Deskripsi Singkat</Label>
                                    <Input id="description" value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Paket ideal untuk sekolah rintisan" />
                                </div>
                                
                                <div className="grid grid-cols-3 gap-4 border-t pt-4 mt-2 dark:border-slate-800">
                                    <div className="space-y-2">
                                        <Label htmlFor="duration_days">Durasi (Hari)</Label>
                                        <Input id="duration_days" type="number" min="1" value={data.duration_days} onChange={e => setData('duration_days', parseInt(e.target.value))} required />
                                        <p className="text-xs text-slate-400">Contoh: 30 untuk bulanan</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="max_students">Maks Siswa</Label>
                                        <Input id="max_students" type="number" min="1" value={data.max_students} onChange={e => setData('max_students', e.target.value)} placeholder="Kosong = Unlimited" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="max_users">Maks Admin/Guru</Label>
                                        <Input id="max_users" type="number" min="1" value={data.max_users} onChange={e => setData('max_users', e.target.value)} placeholder="Kosong = Unlimited" />
                                    </div>
                                </div>

                                <div className="space-y-2 border-t pt-4 mt-2 dark:border-slate-800">
                                    <Label htmlFor="features">Daftar Fitur (Pisahkan dengan koma)</Label>
                                    <textarea 
                                        id="features" 
                                        rows={3}
                                        value={data.features} 
                                        onChange={e => setData('features', e.target.value)}
                                        className="flex w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm dark:border-slate-800"
                                        placeholder="Manajemen Siswa, E-Rapor, Ujian CBT, Dukungan 24/7"
                                    />
                                </div>

                                <div className="flex items-center space-x-2 pt-2">
                                    <input type="checkbox" id="is_active" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="rounded border-gray-300 text-blue-600 shadow-sm" />
                                    <Label htmlFor="is_active">Aktifkan Paket Ini</Label>
                                </div>

                                <Button type="submit" className="w-full mt-6" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Paket SaaS'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {flash?.message && (
                    <div className="mb-6 p-4 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">
                        {flash.message}
                    </div>
                )}

                <div className="border rounded-lg overflow-hidden dark:border-slate-800">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                            <TableRow>
                                <TableHead>Nama Paket</TableHead>
                                <TableHead>Harga</TableHead>
                                <TableHead>Limitasi</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {packages.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">Belum ada paket SaaS yang dibuat.</TableCell>
                                </TableRow>
                            ) : (
                                packages.data.map((pkg: any) => (
                                    <TableRow key={pkg.id}>
                                        <TableCell>
                                            <div className="font-bold text-blue-700 dark:text-blue-400">{pkg.name}</div>
                                            <div className="text-xs text-slate-500 mt-1">{pkg.duration_days} Hari</div>
                                        </TableCell>
                                        <TableCell className="font-bold">{formatRupiah(pkg.price)}</TableCell>
                                        <TableCell>
                                            <div className="text-xs space-y-1">
                                                <div>Siswa: <span className="font-semibold">{pkg.max_students ? pkg.max_students : 'Unlimited'}</span></div>
                                                <div>Admin/Guru: <span className="font-semibold">{pkg.max_users ? pkg.max_users : 'Unlimited'}</span></div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {pkg.is_active ? (
                                                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-bold">Aktif</span>
                                            ) : (
                                                <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-md text-xs font-bold">Draft/Non-Aktif</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => openEditModal(pkg)}>Edit</Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(pkg.id)}>Hapus</Button>
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
