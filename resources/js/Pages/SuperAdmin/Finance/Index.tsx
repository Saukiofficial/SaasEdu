import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { CreditCard, Search, CheckCircle2, XCircle, AlertCircle, Calendar, RefreshCcw } from 'lucide-react';

export default function FinanceIndex({ subscriptions, stats, filters, flash }: any) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/super-admin/finance', { search }, { preserveState: true });
    };

    const updateStatus = (id: string, newStatus: string) => {
        if (confirm(`Yakin ingin mengubah status langganan ini menjadi ${newStatus.toUpperCase()}?`)) {
            router.put(`/super-admin/finance/${id}/status`, { status: newStatus }, { preserveScroll: true });
        }
    };

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'active': return <span className="flex items-center w-fit gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[10px] uppercase font-bold border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Aktif</span>;
            case 'expired': return <span className="flex items-center w-fit gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 rounded-md text-[10px] uppercase font-bold border border-red-200"><XCircle className="w-3 h-3" /> Kedaluwarsa</span>;
            case 'cancelled': return <span className="flex items-center w-fit gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] uppercase font-bold border border-slate-200"><AlertCircle className="w-3 h-3" /> Dibatalkan</span>;
            default: return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold uppercase">{status}</span>;
        }
    };

    return (
        <AuthenticatedLayout header="Pembayaran & Keuangan (SaaS)">
            <Head title="SaaS - Keuangan & Langganan" />

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm flex items-center gap-4 dark:bg-slate-950 dark:border-slate-800">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Langganan Aktif</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.active} Tenant</h3>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm flex items-center gap-4 dark:bg-slate-950 dark:border-slate-800">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                        <RefreshCcw className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Free Trial Berjalan</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.trial} Tenant</h3>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm flex items-center gap-4 dark:bg-slate-950 dark:border-slate-800">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">
                        <XCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Langganan Kedaluwarsa</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.expired} Tenant</h3>
                    </div>
                </div>
            </div>

            {/* Main Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 dark:bg-slate-950 dark:border-slate-800 overflow-hidden">
                
                {/* Header & Actions */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <CreditCard className="w-6 h-6 text-blue-600" />
                                Riwayat Langganan Klien
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">Pantau status paket dan masa aktif tenant sekolah Anda.</p>
                        </div>
                        <form onSubmit={handleSearch} className="flex w-full md:w-auto items-center relative">
                            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Cari nama sekolah atau paket..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full md:w-80 pl-9 bg-white shadow-sm"
                            />
                        </form>
                    </div>
                </div>

                <div className="p-6">
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
                                    <TableHead className="font-semibold text-slate-700">Nama Sekolah (Tenant)</TableHead>
                                    <TableHead className="font-semibold text-slate-700">Paket Langganan</TableHead>
                                    <TableHead className="font-semibold text-slate-700">Periode Aktif</TableHead>
                                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-700">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subscriptions.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <CreditCard className="w-10 h-10 text-slate-300" />
                                                <p>{search ? 'Data langganan tidak ditemukan.' : 'Belum ada riwayat langganan.'}</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    subscriptions.data.map((sub: any) => (
                                        <TableRow key={sub.id} className="hover:bg-slate-50 transition-colors dark:hover:bg-slate-900">
                                            <TableCell>
                                                <div className="font-bold text-slate-900 dark:text-white">{sub.school?.name}</div>
                                                <div className="text-xs text-slate-500 font-mono mt-0.5">ID: {sub.school_id.substring(0,8)}...</div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md text-xs border border-blue-200 dark:bg-blue-900/50 dark:text-blue-400">
                                                    {sub.plan_name}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                    {new Date(sub.start_date).toLocaleDateString('id-ID')} - {new Date(sub.end_date).toLocaleDateString('id-ID')}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(sub.status)}
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                {sub.status === 'active' ? (
                                                    <Button variant="outline" size="sm" className="rounded-lg shadow-sm border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => updateStatus(sub.id, 'expired')}>
                                                        Set Expired
                                                    </Button>
                                                ) : (
                                                    <Button variant="outline" size="sm" className="rounded-lg shadow-sm border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => updateStatus(sub.id, 'active')}>
                                                        Set Aktif
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-6 flex justify-between items-center text-sm text-slate-500">
                        <p>Menampilkan <span className="font-medium text-slate-900">{subscriptions.from || 0}</span> - <span className="font-medium text-slate-900">{subscriptions.to || 0}</span> dari total <span className="font-medium text-slate-900">{subscriptions.total}</span> data langganan.</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
