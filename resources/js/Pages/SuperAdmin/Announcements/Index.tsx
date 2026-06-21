import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Megaphone, Search, Plus, Trash2, Edit, AlertCircle, Info, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';

export default function AnnouncementIndex({ announcements, filters, flash }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState('');
    const [search, setSearch] = useState(filters.search || '');

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        title: '',
        content: '',
        type: 'info',
        is_active: true,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/super-admin/announcements', { search }, { preserveState: true });
    };

    const openCreateModal = () => {
        reset();
        setIsEdit(false);
        setIsOpen(true);
    };

    const openEditModal = (item: any) => {
        setData({
            title: item.title,
            content: item.content,
            type: item.type,
            is_active: item.is_active,
        });
        setEditId(item.id);
        setIsEdit(true);
        setIsOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/super-admin/announcements/${editId}`, { onSuccess: () => setIsOpen(false) });
        } else {
            post('/super-admin/announcements', { onSuccess: () => setIsOpen(false) });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Yakin ingin menghapus pengumuman ini secara permanen?')) {
            destroy(`/super-admin/announcements/${id}`);
        }
    };

    // Fungsi Render Badge Status/Tipe
    const getTypeBadge = (type: string) => {
        switch(type) {
            case 'warning': return <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold border border-red-200"><AlertCircle className="w-3.5 h-3.5" /> Penting</span>;
            case 'success': return <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200"><CheckCircle2 className="w-3.5 h-3.5" /> Update</span>;
            case 'event': return <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold border border-purple-200"><CalendarIcon className="w-3.5 h-3.5" /> Event</span>;
            default: return <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-200"><Info className="w-3.5 h-3.5" /> Informasi</span>;
        }
    };

    return (
        <AuthenticatedLayout header="Pengumuman Global (Broadcast)">
            <Head title="SaaS - Pengumuman Global" />

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 dark:bg-slate-950 dark:border-slate-800 overflow-hidden">
                
                {/* Header & Actions */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <Megaphone className="w-6 h-6 text-blue-600" />
                                Daftar Broadcast
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">Buat dan kelola pengumuman untuk ditampilkan di dashboard seluruh klien.</p>
                        </div>
                        <div className="flex w-full md:w-auto items-center gap-3">
                            <form onSubmit={handleSearch} className="flex-1 md:w-64 relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Cari judul..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full pl-9 bg-white shadow-sm"
                                />
                            </form>
                            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 rounded-xl px-4">
                                        <Plus className="w-4 h-4 mr-2" /> Buat Baru
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl bg-white rounded-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl font-bold text-slate-800">{isEdit ? 'Edit Pengumuman' : 'Buat Pengumuman Global'}</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={submit} className="space-y-5 pt-4 px-1">
                                        <div className="space-y-2">
                                            <Label className="text-slate-700 font-semibold">Judul Pengumuman</Label>
                                            <Input placeholder="Contoh: Jadwal Maintenance Server" value={data.title} onChange={e => setData('title', e.target.value)} className="bg-slate-50 border-slate-200 focus:bg-white" required />
                                            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-700 font-semibold">Kategori Broadcast</Label>
                                            <select 
                                                value={data.type} 
                                                onChange={e => setData('type', e.target.value)} 
                                                className="flex h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            >
                                                <option value="info">Informasi Umum (Biru)</option>
                                                <option value="warning">Penting / Maintenance (Merah)</option>
                                                <option value="success">Update Sistem Baru (Hijau)</option>
                                                <option value="event">Event / Promo (Ungu)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-700 font-semibold">Isi Pesan</Label>
                                            <textarea 
                                                rows={5}
                                                value={data.content} 
                                                onChange={e => setData('content', e.target.value)}
                                                className="flex w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                                placeholder="Tuliskan isi pengumuman secara detail..."
                                                required
                                            />
                                        </div>
                                        <div className="flex items-center space-x-2 pt-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                            <input type="checkbox" id="is_active" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="rounded w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300" />
                                            <Label htmlFor="is_active" className="text-blue-900 cursor-pointer select-none">Tampilkan pengumuman ini sekarang</Label>
                                        </div>

                                        <div className="pt-4 flex justify-end">
                                            <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8 shadow-md">
                                                {processing ? 'Menyimpan...' : 'Publish Broadcast'}
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>

                {/* Table Data */}
                <div className="p-6">
                    {flash?.message && (
                        <div className="mb-6 p-4 text-sm font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 shadow-sm">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">✓</span>
                            {flash.message}
                        </div>
                    )}

                    <div className="border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-semibold text-slate-700 w-1/2">Judul & Isi Pengumuman</TableHead>
                                    <TableHead className="font-semibold text-slate-700">Kategori</TableHead>
                                    <TableHead className="font-semibold text-slate-700">Status Publikasi</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-700">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {announcements.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-12 text-slate-500">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <Megaphone className="w-10 h-10 text-slate-300" />
                                                <p>{search ? 'Pengumuman tidak ditemukan.' : 'Belum ada broadcast yang dibuat.'}</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    announcements.data.map((item: any) => (
                                        <TableRow key={item.id} className="hover:bg-slate-50 transition-colors">
                                            <TableCell>
                                                <div className="font-bold text-slate-900">{item.title}</div>
                                                <div className="text-xs text-slate-500 mt-1 line-clamp-1 pr-8">{item.content}</div>
                                                <div className="text-[10px] text-slate-400 mt-2 font-mono">{new Date(item.created_at).toLocaleString('id-ID')}</div>
                                            </TableCell>
                                            <TableCell>
                                                {getTypeBadge(item.type)}
                                            </TableCell>
                                            <TableCell>
                                                {item.is_active ? (
                                                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-md text-[10px] uppercase tracking-wider font-bold">Terbit</span>
                                                ) : (
                                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-md text-[10px] uppercase tracking-wider font-bold">Draft (Disembunyikan)</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="outline" size="sm" className="rounded-lg shadow-sm" onClick={() => openEditModal(item)}>
                                                    <Edit className="w-4 h-4 mr-1.5 text-slate-500" /> Edit
                                                </Button>
                                                <Button variant="destructive" size="sm" className="rounded-lg shadow-sm bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-none" onClick={() => handleDelete(item.id)}>
                                                    <Trash2 className="w-4 h-4 mr-1.5" /> Hapus
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-6 text-sm text-slate-500 text-center">
                        Menampilkan <span className="font-medium text-slate-900">{announcements.from || 0}</span> - <span className="font-medium text-slate-900">{announcements.to || 0}</span> dari total <span className="font-medium text-slate-900">{announcements.total}</span> pengumuman.
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}