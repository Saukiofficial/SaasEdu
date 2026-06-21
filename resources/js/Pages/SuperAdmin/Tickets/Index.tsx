import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/Components/ui/dialog';
import { HeadphonesIcon, Search, AlertCircle, Clock, CheckCircle2, MessageSquare } from 'lucide-react';

export default function TicketIndex({ tickets, filters, flash }: any) {
    const [search, setSearch] = useState(filters.search || '');
    const [filterStatus, setFilterStatus] = useState(filters.status || '');
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);

    const { data, setData, put, processing, reset, errors } = useForm({
        admin_response: '',
        status: '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/super-admin/tickets', { search, status: filterStatus }, { preserveState: true });
    };

    const applyFilters = () => {
        router.get('/super-admin/tickets', { search, status: filterStatus }, { preserveState: true });
    };

    const openReplyModal = (ticket: any) => {
        setSelectedTicket(ticket);
        setData({
            admin_response: ticket.admin_response || '',
            status: ticket.status,
        });
        setIsDetailOpen(true);
    };

    const submitReply = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/super-admin/tickets/${selectedTicket.id}`, {
            onSuccess: () => {
                setIsDetailOpen(false);
                reset();
            }
        });
    };

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'open': return <span className="flex w-fit items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 rounded-md text-[10px] uppercase font-bold border border-red-200"><AlertCircle className="w-3 h-3" /> Baru (Open)</span>;
            case 'in_progress': return <span className="flex w-fit items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md text-[10px] uppercase font-bold border border-amber-200"><Clock className="w-3 h-3" /> Diproses</span>;
            case 'resolved': return <span className="flex w-fit items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[10px] uppercase font-bold border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Selesai</span>;
            case 'closed': return <span className="flex w-fit items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] uppercase font-bold border border-slate-200"><CheckCircle2 className="w-3 h-3" /> Ditutup</span>;
            default: return null;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch(priority) {
            case 'urgent': return <span className="text-xs font-bold text-red-600">🚨 Urgent</span>;
            case 'high': return <span className="text-xs font-bold text-orange-600">High</span>;
            case 'medium': return <span className="text-xs font-medium text-blue-600">Medium</span>;
            case 'low': return <span className="text-xs font-medium text-slate-500">Low</span>;
            default: return null;
        }
    };

    return (
        <AuthenticatedLayout header="Support & Bantuan">
            <Head title="SaaS - Support Tickets" />

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 dark:bg-slate-950 dark:border-slate-800 overflow-hidden mb-6 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b pb-4 border-slate-100 dark:border-slate-800">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <HeadphonesIcon className="w-6 h-6 text-blue-600" />
                            Sistem Tiket Bantuan
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">Respons dan kelola keluhan teknis dari klien SaaS Anda.</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <form onSubmit={handleSearch} className="flex flex-1 items-center relative">
                        <Search className="w-4 h-4 absolute left-3 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Cari nomor tiket atau subjek..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 bg-white shadow-sm"
                        />
                    </form>
                    <div className="flex gap-2 w-full md:w-auto">
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="flex h-10 w-full md:w-48 rounded-lg border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800 outline-none">
                            <option value="">Semua Status</option>
                            <option value="open">Open (Baru)</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                        </select>
                        <Button variant="secondary" onClick={applyFilters}>Filter</Button>
                    </div>
                </div>

                {flash?.message && (
                    <div className="mb-6 p-4 text-sm font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 shadow-sm">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">✓</span>
                        {flash.message}
                    </div>
                )}

                <div className="border border-slate-200/80 rounded-xl overflow-hidden shadow-sm dark:border-slate-800">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-semibold text-slate-700">Info Tiket</TableHead>
                                <TableHead className="font-semibold text-slate-700">Pengirim (Sekolah)</TableHead>
                                <TableHead className="font-semibold text-slate-700">Prioritas</TableHead>
                                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                                <TableHead className="text-right font-semibold text-slate-700">Tindakan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickets.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <HeadphonesIcon className="w-10 h-10 text-slate-300" />
                                            <p>{search ? 'Tiket tidak ditemukan.' : 'Hore! Tidak ada keluhan masuk saat ini.'}</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tickets.data.map((ticket: any) => (
                                    <TableRow key={ticket.id} className="hover:bg-slate-50 transition-colors dark:hover:bg-slate-900/50">
                                        <TableCell>
                                            <div className="font-bold text-slate-900 dark:text-white">{ticket.subject}</div>
                                            <div className="text-xs text-slate-500 font-mono mt-0.5">{ticket.ticket_number} • {new Date(ticket.created_at).toLocaleString('id-ID')}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-bold text-blue-700 text-sm">{ticket.school?.name}</div>
                                            <div className="text-xs text-slate-500">{ticket.user?.name}</div>
                                        </TableCell>
                                        <TableCell>
                                            {getPriorityBadge(ticket.priority)}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(ticket.status)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" variant={ticket.status === 'open' ? 'default' : 'outline'} className={ticket.status === 'open' ? 'bg-blue-600 hover:bg-blue-700' : ''} onClick={() => openReplyModal(ticket)}>
                                                <MessageSquare className="w-4 h-4 mr-2" /> {ticket.status === 'open' ? 'Beri Respon' : 'Detail'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                
                <div className="mt-6 flex justify-between items-center text-sm text-slate-500">
                    <p>Menampilkan <span className="font-medium text-slate-900">{tickets.from || 0}</span> - <span className="font-medium text-slate-900">{tickets.to || 0}</span> dari total <span className="font-medium text-slate-900">{tickets.total}</span> tiket.</p>
                </div>
            </div>

            {/* Modal Detail & Respon Tiket */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl flex items-center gap-2">Detail Tiket Bantuan</DialogTitle>
                    </DialogHeader>
                    {selectedTicket && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            {/* Kiri: Detail Tiket dari Klien */}
                            <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pengirim</h4>
                                    <p className="font-semibold text-slate-800 dark:text-white">{selectedTicket.school?.name}</p>
                                    <p className="text-sm text-slate-600">{selectedTicket.user?.name} ({selectedTicket.user?.email})</p>
                                </div>
                                <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Subjek Masalah</h4>
                                    <p className="font-bold text-slate-800 dark:text-white">{selectedTicket.subject}</p>
                                </div>
                                <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Deskripsi Detail</h4>
                                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-sm text-slate-700 min-h-[100px] whitespace-pre-wrap dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300">
                                        {selectedTicket.description}
                                    </div>
                                </div>
                            </div>

                            {/* Kanan: Form Respon Admin */}
                            <form onSubmit={submitReply} className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-bold">Ubah Status Tiket</Label>
                                    <select value={data.status} onChange={e => setData('status', e.target.value)} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-slate-950 dark:border-slate-800">
                                        <option value="open">Open (Baru)</option>
                                        <option value="in_progress">In Progress (Sedang Ditangani)</option>
                                        <option value="resolved">Resolved (Sudah Diselesaikan)</option>
                                        <option value="closed">Closed (Ditutup)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-bold">Balasan / Solusi Anda</Label>
                                    <textarea 
                                        rows={6}
                                        value={data.admin_response} 
                                        onChange={e => setData('admin_response', e.target.value)}
                                        className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none dark:bg-slate-950 dark:border-slate-800"
                                        placeholder="Tuliskan solusi atau progres penanganan masalah di sini..."
                                        required
                                    />
                                    {errors.admin_response && <p className="text-sm text-red-500">{errors.admin_response}</p>}
                                </div>
                                <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md text-sm font-bold" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Kirim Respon ke Klien'}
                                </Button>
                            </form>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
