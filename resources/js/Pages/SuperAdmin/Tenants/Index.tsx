import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';

export default function TenantIndex({ tenants }: any) {
    return (
        <AuthenticatedLayout header="Manajemen Tenant Klien">
            <Head title="SaaS - Daftar Klien" />
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 dark:bg-slate-950 dark:border-slate-800">
                <div className="mb-6 border-b pb-4 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Daftar Sekolah Terdaftar</h2>
                    <p className="text-sm text-slate-500 mt-1">Berikut adalah daftar seluruh institusi yang menggunakan aplikasi EduERP Anda.</p>
                </div>

                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                            <TableRow>
                                <TableHead>ID Tenant</TableHead>
                                <TableHead>Nama Sekolah</TableHead>
                                <TableHead>Kontak/Email</TableHead>
                                <TableHead className="text-center">Total Akun</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi SaaS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tenants.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">Belum ada klien yang mendaftar.</TableCell>
                                </TableRow>
                            ) : (
                                tenants.data.map((school: any) => (
                                    <TableRow key={school.id}>
                                        <TableCell className="font-mono text-xs text-slate-500">{school.id.substring(0,8)}...</TableCell>
                                        <TableCell className="font-bold text-blue-700 dark:text-blue-400">{school.name}</TableCell>
                                        <TableCell>{school.email || '-'}</TableCell>
                                        <TableCell className="text-center font-medium">{school.users_count} User</TableCell>
                                        <TableCell>
                                            {school.status === 'active' ? (
                                                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-bold">Aktif</span>
                                            ) : (
                                                <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold">Suspend</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="sm">Ubah Paket</Button>
                                            <Button variant="destructive" size="sm">Suspend</Button>
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
