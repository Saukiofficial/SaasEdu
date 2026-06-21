import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/Components/ui/dialog';

export default function PPDBAdminIndex({ admissions, flash }: any) {
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedAdmission, setSelectedAdmission] = useState<any>(null);

    const openDetailModal = (admission: any) => {
        setSelectedAdmission(admission);
        setIsDetailOpen(true);
    };

    const updateStatus = (id: string, status: string) => {
        if (confirm(`Yakin ingin mengubah status menjadi ${status}?`)) {
            router.put(`/admin/ppdb/${id}/status`, { status }, {
                preserveScroll: true,
                onSuccess: () => {
                     if(selectedAdmission && selectedAdmission.id === id) {
                         setSelectedAdmission({...selectedAdmission, status: status});
                     }
                }
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved': return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-bold">Diterima</span>;
            case 'rejected': return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold">Ditolak</span>;
            default: return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-bold">Menunggu</span>;
        }
    };

    return (
        <AuthenticatedLayout header="Manajemen PPDB">
            <Head title="Admin PPDB" />
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 dark:bg-slate-950 dark:border-slate-800">
                <div className="mb-6">
                    <p className="text-sm text-slate-500">Daftar calon peserta didik baru yang telah mendaftar.</p>
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
                                <TableHead>No. Registrasi</TableHead>
                                <TableHead>Nama Calon Siswa</TableHead>
                                <TableHead>Asal Sekolah</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {admissions.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">Belum ada pendaftar.</TableCell>
                                </TableRow>
                            ) : (
                                admissions.data.map((admission: any) => (
                                    <TableRow key={admission.id}>
                                        <TableCell className="font-mono text-xs">{admission.registration_number}</TableCell>
                                        <TableCell className="font-bold">{admission.full_name}</TableCell>
                                        <TableCell>{admission.previous_school || '-'}</TableCell>
                                        <TableCell>{getStatusBadge(admission.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" onClick={() => openDetailModal(admission)}>Detail & Aksi</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Modal Detail */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Detail Pendaftar</DialogTitle>
                        <DialogDescription>
                            Review data pendaftaran calon siswa ini.
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedAdmission && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-3 gap-2 border-b pb-2">
                                <span className="text-sm text-slate-500">No. Registrasi</span>
                                <span className="col-span-2 font-mono font-medium">{selectedAdmission.registration_number}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b pb-2">
                                <span className="text-sm text-slate-500">Nama Lengkap</span>
                                <span className="col-span-2 font-bold">{selectedAdmission.full_name}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b pb-2">
                                <span className="text-sm text-slate-500">NISN</span>
                                <span className="col-span-2">{selectedAdmission.nisn || '-'}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b pb-2">
                                <span className="text-sm text-slate-500">Kontak</span>
                                <span className="col-span-2">{selectedAdmission.phone} <br/><span className="text-xs text-slate-400">{selectedAdmission.email}</span></span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b pb-2">
                                <span className="text-sm text-slate-500">Asal Sekolah</span>
                                <span className="col-span-2">{selectedAdmission.previous_school || '-'}</span>
                            </div>
                             <div className="grid grid-cols-3 gap-2 border-b pb-2">
                                <span className="text-sm text-slate-500">Status Saat Ini</span>
                                <span className="col-span-2">{getStatusBadge(selectedAdmission.status)}</span>
                            </div>

                            <div className="pt-4 flex gap-2 justify-end">
                                <Button 
                                    variant="outline" 
                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                    onClick={() => updateStatus(selectedAdmission.id, 'rejected')}
                                    disabled={selectedAdmission.status === 'rejected'}
                                >
                                    Tolak
                                </Button>
                                <Button 
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                    onClick={() => updateStatus(selectedAdmission.id, 'approved')}
                                    disabled={selectedAdmission.status === 'approved'}
                                >
                                    Terima Siswa
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

        </AuthenticatedLayout>
    );
}