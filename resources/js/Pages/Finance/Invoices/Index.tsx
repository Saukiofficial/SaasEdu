import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';

export default function InvoiceIndex({ invoices, classrooms, filters, flash, errors: serverErrors }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

    const [filterClass, setFilterClass] = useState(filters.classroom_id || '');
    const [filterStatus, setFilterStatus] = useState(filters.status || '');

    // Form untuk Generate Tagihan Massal
    const { data: genData, setData: setGenData, post: postGen, processing: genProcessing, reset: resetGen, errors: genErrors } = useForm({
        classroom_id: '',
        title: '',
        amount: '',
        due_date: '',
        notes: '',
    });

    // Form untuk Input Pembayaran
    const { data: payData, setData: setPayData, post: postPay, processing: payProcessing, reset: resetPay, errors: payErrors } = useForm({
        invoice_id: '',
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'cash',
        reference_number: '',
        notes: '',
    });

    const openGenerateModal = () => {
        resetGen();
        setIsOpen(true);
    };

    const openPaymentModal = (invoice: any) => {
        setSelectedInvoice(invoice);
        resetPay();
        setPayData({
            ...payData,
            invoice_id: invoice.id,
            amount: invoice.amount, // Default set ke full payment
            payment_date: new Date().toISOString().split('T')[0],
        });
        setIsPaymentOpen(true);
    };

    const submitGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        postGen('/invoices', { onSuccess: () => setIsOpen(false) });
    };

    const submitPayment = (e: React.FormEvent) => {
        e.preventDefault();
        postPay('/payments', { onSuccess: () => setIsPaymentOpen(false) });
    };

    const handleDelete = (id: string) => {
        if (confirm('Yakin ingin menghapus tagihan ini? Data pembayaran yang terkait juga akan terhapus.')) {
            router.delete(`/invoices/${id}`);
        }
    };

    const applyFilters = () => {
        router.get('/invoices', { classroom_id: filterClass, status: filterStatus }, { preserveState: true });
    };

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    };

    return (
        <AuthenticatedLayout header="Manajemen Tagihan / SPP">
            <Head title="Keuangan - Tagihan" />

            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div className="flex w-full md:w-auto gap-4 flex-1">
                        <div className="w-1/2 md:w-48 space-y-2">
                            <Label>Filter Kelas</Label>
                            <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800">
                                <option value="">Semua Kelas</option>
                                {classrooms.map((cls: any) => (
                                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-1/2 md:w-48 space-y-2">
                            <Label>Status Pembayaran</Label>
                            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800">
                                <option value="">Semua Status</option>
                                <option value="unpaid">Belum Dibayar</option>
                                <option value="partial">Dicicil</option>
                                <option value="paid">Lunas</option>
                            </select>
                        </div>
                        <div className="pb-0.5">
                            <Button variant="secondary" onClick={applyFilters}>Terapkan</Button>
                        </div>
                    </div>

                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openGenerateModal}>+ Generate Tagihan Kelas</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Generate Tagihan Massal</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={submitGenerate} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>Pilih Kelas</Label>
                                    <select value={genData.classroom_id} onChange={e => setGenData('classroom_id', e.target.value)} className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800" required>
                                        <option value="">-- Pilih Kelas --</option>
                                        {classrooms.map((cls: any) => (
                                            <option key={cls.id} value={cls.id}>{cls.name}</option>
                                        ))}
                                    </select>
                                    {genErrors.classroom_id && <p className="text-sm text-red-500">{genErrors.classroom_id}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Judul Tagihan</Label>
                                    <Input placeholder="Contoh: SPP Bulan Agustus 2026" value={genData.title} onChange={e => setGenData('title', e.target.value)} required />
                                    {genErrors.title && <p className="text-sm text-red-500">{genErrors.title}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Nominal (Rp)</Label>
                                        <Input type="number" min="0" value={genData.amount} onChange={e => setGenData('amount', e.target.value)} required />
                                        {genErrors.amount && <p className="text-sm text-red-500">{genErrors.amount}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Jatuh Tempo</Label>
                                        <Input type="date" value={genData.due_date} onChange={e => setGenData('due_date', e.target.value)} required />
                                        {genErrors.due_date && <p className="text-sm text-red-500">{genErrors.due_date}</p>}
                                    </div>
                                </div>
                                <Button type="submit" className="w-full mt-4" disabled={genProcessing}>
                                    {genProcessing ? 'Memproses...' : 'Generate Tagihan'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {flash?.message && (
                    <div className="mt-6 p-4 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">
                        {flash.message}
                    </div>
                )}
                {serverErrors?.error && (
                    <div className="mt-6 p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">
                        {serverErrors.error}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 dark:bg-slate-950 dark:border-slate-800 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>No. Invoice</TableHead>
                            <TableHead>Siswa</TableHead>
                            <TableHead>Rincian Tagihan</TableHead>
                            <TableHead>Jatuh Tempo</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-slate-500">Belum ada data tagihan.</TableCell>
                            </TableRow>
                        ) : (
                            invoices.data.map((invoice: any) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-mono text-xs font-medium text-slate-600">{invoice.invoice_number}</TableCell>
                                    <TableCell>
                                        <div className="font-bold">{invoice.student?.name}</div>
                                        <div className="text-xs text-slate-500">{invoice.student?.classroom?.name || 'Tanpa Kelas'}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-slate-900">{invoice.title}</div>
                                        <div className="font-bold text-slate-700">{formatRupiah(invoice.amount)}</div>
                                    </TableCell>
                                    <TableCell className="text-sm">{new Date(invoice.due_date).toLocaleDateString('id-ID')}</TableCell>
                                    <TableCell>
                                        {invoice.status === 'unpaid' && <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold">Belum Lunas</span>}
                                        {invoice.status === 'partial' && <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-bold">Dicicil</span>}
                                        {invoice.status === 'paid' && <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-bold">Lunas</span>}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {invoice.status !== 'paid' && (
                                            <Button className="bg-emerald-600 hover:bg-emerald-700" size="sm" onClick={() => openPaymentModal(invoice)}>Bayar</Button>
                                        )}
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(invoice.id)}>Hapus</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Modal Pembayaran */}
            <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Input Pembayaran</DialogTitle>
                    </DialogHeader>
                    {selectedInvoice && (
                        <form onSubmit={submitPayment} className="space-y-4 pt-4">
                            <div className="p-3 bg-slate-50 rounded-lg border text-sm text-slate-600 dark:bg-slate-900 dark:border-slate-800">
                                <p><strong>Siswa:</strong> {selectedInvoice.student?.name}</p>
                                <p><strong>Tagihan:</strong> {selectedInvoice.title}</p>
                                <p><strong>Total:</strong> {formatRupiah(selectedInvoice.amount)}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nominal Bayar (Rp)</Label>
                                    <Input type="number" min="1" value={payData.amount} onChange={e => setPayData('amount', e.target.value)} required />
                                    {payErrors.amount && <p className="text-sm text-red-500">{payErrors.amount}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Tanggal Bayar</Label>
                                    <Input type="date" value={payData.payment_date} onChange={e => setPayData('payment_date', e.target.value)} required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Metode Pembayaran</Label>
                                    <select value={payData.payment_method} onChange={e => setPayData('payment_method', e.target.value)} className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800" required>
                                        <option value="cash">Tunai (Cash)</option>
                                        <option value="transfer">Transfer Bank</option>
                                        <option value="qris">QRIS / E-Wallet</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>No. Referensi (Opsional)</Label>
                                    <Input placeholder="Misal: TRF-12345" value={payData.reference_number} onChange={e => setPayData('reference_number', e.target.value)} />
                                </div>
                            </div>
                            <Button type="submit" className="w-full mt-4" disabled={payProcessing}>
                                {payProcessing ? 'Memproses...' : 'Simpan Pembayaran'}
                            </Button>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

        </AuthenticatedLayout>
    );
}
