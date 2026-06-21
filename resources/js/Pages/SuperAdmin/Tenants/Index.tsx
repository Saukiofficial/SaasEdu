import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/Components/ui/dialog';
import { Building2, Mail, Phone, MapPin, Users, CreditCard } from 'lucide-react';

export default function TenantIndex({ tenants, flash }: any) {
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState<any>(null);

    // Fungsi Buka Modal Detail
    const openDetailModal = (tenant: any) => {
        setSelectedTenant(tenant);
        setIsDetailOpen(true);
    };

    // Fungsi Ubah Status (Suspend / Aktifkan)
    const toggleStatus = (tenantId: string, currentStatus: string, tenantName: string) => {
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
        const actionText = newStatus === 'active' ? 'mengaktifkan kembali' : 'men-suspend (membekukan)';
        
        if (confirm(`Yakin ingin ${actionText} akses untuk tenant: ${tenantName}?`)) {
            router.put(`/super-admin/tenants/${tenantId}/status`, { status: newStatus }, {
                preserveScroll: true,
                onSuccess: () => {
                    // Update state lokal jika modal sedang terbuka
                    if (selectedTenant && selectedTenant.id === tenantId) {
                        setSelectedTenant({ ...selectedTenant, status: newStatus });
                    }
                }
            });
        }
    };

    // Fungsi Navigasi Ubah Paket (Akan berfungsi setelah modul Manajemen Paket selesai)
    const handleUbahPaket = () => {
        alert("Fitur ini akan segera diaktifkan setelah modul 'Manajemen Paket' selesai dibangun.");
    };

    return (
        <AuthenticatedLayout header="Manajemen Tenant Klien">
            <Head title="SaaS - Daftar Klien" />
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 dark:bg-slate-950 dark:border-slate-800">
                <div className="mb-6 border-b pb-4 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Daftar Sekolah Terdaftar</h2>
                    <p className="text-sm text-slate-500 mt-1">Kelola seluruh institusi yang menggunakan aplikasi EduERP Anda di sini.</p>
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
                                                <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold">Suspended</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="secondary" size="sm" onClick={() => openDetailModal(school)}>Detail</Button>
                                            <Button variant="outline" size="sm" onClick={handleUbahPaket}>Ubah Paket</Button>
                                            {school.status === 'active' ? (
                                                <Button variant="destructive" size="sm" onClick={() => toggleStatus(school.id, school.status, school.name)}>Suspend</Button>
                                            ) : (
                                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" size="sm" onClick={() => toggleStatus(school.id, school.status, school.name)}>Aktifkan</Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Modal Detail Tenant */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Detail Tenant (Sekolah)</DialogTitle>
                        <DialogDescription>
                            Informasi lengkap klien SaaS Anda.
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedTenant && (
                        <div className="space-y-6 py-4">
                            <div className="flex items-center space-x-4 border-b pb-4 dark:border-slate-800">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedTenant.name}</h3>
                                    <p className="text-sm text-slate-500 font-mono">ID: {selectedTenant.id}</p>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center">
                                    <Mail className="w-4 h-4 text-slate-400 mr-3" />
                                    <span className="font-medium w-24">Email:</span>
                                    <span className="text-slate-600 dark:text-slate-300">{selectedTenant.email || 'Belum diatur'}</span>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="w-4 h-4 text-slate-400 mr-3" />
                                    <span className="font-medium w-24">Telepon:</span>
                                    <span className="text-slate-600 dark:text-slate-300">{selectedTenant.phone || 'Belum diatur'}</span>
                                </div>
                                <div className="flex items-start">
                                    <MapPin className="w-4 h-4 text-slate-400 mr-3 mt-0.5" />
                                    <span className="font-medium w-24">Alamat:</span>
                                    <span className="text-slate-600 dark:text-slate-300 flex-1">{selectedTenant.address || 'Belum diatur'}</span>
                                </div>
                                <div className="flex items-center pt-2">
                                    <Users className="w-4 h-4 text-slate-400 mr-3" />
                                    <span className="font-medium w-24">Total User:</span>
                                    <span className="text-slate-600 dark:text-slate-300">{selectedTenant.users_count} Akun Terdaftar</span>
                                </div>
                                <div className="flex items-center pt-2">
                                    <CreditCard className="w-4 h-4 text-slate-400 mr-3" />
                                    <span className="font-medium w-24">Paket Aktif:</span>
                                    <span className="text-emerald-600 font-bold dark:text-emerald-400">
                                        {selectedTenant.latest_subscription ? selectedTenant.latest_subscription.plan_name : 'Tidak Ada Paket'}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-2 justify-end border-t dark:border-slate-800">
                                {selectedTenant.status === 'active' ? (
                                    <Button variant="destructive" onClick={() => toggleStatus(selectedTenant.id, selectedTenant.status, selectedTenant.name)}>
                                        Suspend Akses Tenant
                                    </Button>
                                ) : (
                                    <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => toggleStatus(selectedTenant.id, selectedTenant.status, selectedTenant.name)}>
                                        Aktifkan Akses Tenant
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

        </AuthenticatedLayout>
    );
}