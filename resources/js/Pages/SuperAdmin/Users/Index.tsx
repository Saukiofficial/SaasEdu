import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Search, Trash2, ShieldAlert, UserCog } from 'lucide-react';

export default function UserIndex({ users, filters, flash, errors }: any) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/super-admin/users', { search }, { preserveState: true });
    };

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Peringatan: Yakin ingin menghapus user "${name}" secara permanen dari sistem?`)) {
            router.delete(`/super-admin/users/${id}`);
        }
    };

    return (
        <AuthenticatedLayout header="Manajemen User (Global)">
            <Head title="SaaS - Manajemen User" />

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 dark:bg-slate-950 dark:border-slate-800 overflow-hidden">
                {/* Header Section */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <UserCog className="w-6 h-6 text-blue-600" />
                                Daftar Semua Pengguna
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">Pantau seluruh pengguna dari semua sekolah klien Anda dalam satu tempat.</p>
                        </div>
                        <form onSubmit={handleSearch} className="flex w-full md:w-auto items-center relative">
                            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Cari nama atau email..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full md:w-80 pl-9 bg-white shadow-sm"
                            />
                        </form>
                    </div>
                </div>

                <div className="p-6">
                    {flash?.message && (
                        <div className="mb-6 p-4 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 shadow-sm">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">✓</span>
                            {flash.message}
                        </div>
                    )}
                    {errors?.error && (
                        <div className="mb-6 p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 shadow-sm">
                            <ShieldAlert className="w-5 h-5 text-red-500" />
                            {errors.error}
                        </div>
                    )}

                    <div className="border border-slate-200 rounded-xl overflow-hidden dark:border-slate-800 shadow-sm">
                        <Table>
                            <TableHeader className="bg-slate-100/70 dark:bg-slate-900/50">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-semibold text-slate-700">Info Pengguna</TableHead>
                                    <TableHead className="font-semibold text-slate-700">Role / Jabatan</TableHead>
                                    <TableHead className="font-semibold text-slate-700">Asal Sekolah (Tenant)</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-700">Aksi SaaS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-12 text-slate-500">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <Search className="w-10 h-10 text-slate-300" />
                                                <p>{search ? 'Pengguna tidak ditemukan.' : 'Belum ada data pengguna.'}</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.data.map((u: any) => (
                                        <TableRow key={u.id} className="hover:bg-slate-50 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 shrink-0">
                                                        {u.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                                                        <div className="text-xs text-slate-500">{u.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {u.roles && u.roles.length > 0 ? (
                                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-200 shadow-sm">
                                                        {u.roles[0].name}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">Tanpa Role</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {u.school ? (
                                                    <div className="font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block text-xs shadow-sm">
                                                        {u.school.name}
                                                    </div>
                                                ) : (
                                                    <div className="font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 inline-flex items-center gap-1.5 text-xs shadow-sm">
                                                        <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
                                                        Pusat / SaaS Admin
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="shadow-sm"
                                                    onClick={() => handleDelete(u.id, u.name)}
                                                    disabled={!u.school_id} // Cegah menghapus Super Admin
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Hapus
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-6 flex justify-between items-center text-sm text-slate-500">
                        <p>Menampilkan <span className="font-medium text-slate-900">{users.from || 0}</span> - <span className="font-medium text-slate-900">{users.to || 0}</span> dari total <span className="font-medium text-slate-900">{users.total}</span> pengguna.</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
