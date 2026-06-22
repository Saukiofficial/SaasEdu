import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    FileText, Search, Plus, Building2, CheckCircle2, 
    XCircle, Clock, AlertCircle, Banknote, Edit, FileDown, X
} from 'lucide-react';

interface School {
    id: string;
    name: string;
}

interface SubscriptionInvoice {
    id: string;
    invoice_number: string;
    school_id: string;
    amount: number;
    description: string;
    status: 'unpaid' | 'paid' | 'canceled';
    due_date: string;
    paid_at: string | null;
    payment_method: string | null;
    created_at: string;
    school?: School;
}

export default function SubscriptionInvoicesIndex({ invoices, schools }: { invoices: any, schools: School[] }) {
    const invoiceList: SubscriptionInvoice[] = invoices?.data || [];
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<SubscriptionInvoice | null>(null);

    // Form setup Create Invoice
    const { data, setData, post, processing, errors, reset } = useForm({
        school_id: '',
        amount: '',
        description: '',
        due_date: '',
    });

    // Form setup Manual Payment
    const { data: payData, setData: setPayData, put: putPay, processing: processingPay, reset: resetPay } = useForm({
        payment_method: 'Transfer Bank Manual',
    });

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    const statusConfig = {
        unpaid: { label: 'Belum Dibayar', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200', icon: AlertCircle },
        paid: { label: 'Lunas', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
        canceled: { label: 'Dibatalkan', color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200', icon: XCircle },
    };

    const openCreateModal = () => {
        reset();
        setIsModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const openPaymentModal = (inv: SubscriptionInvoice) => {
        setSelectedInvoice(inv);
        resetPay();
        setIsPaymentModalOpen(true);
    };

    const closePaymentModal = () => {
        setIsPaymentModalOpen(false);
        setSelectedInvoice(null);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/super-admin/subscription-invoices', {
            onSuccess: () => closeCreateModal()
        });
    };

    const submitPayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInvoice) return;
        
        putPay(`/super-admin/subscription-invoices/${selectedInvoice.id}/pay`, {
            onSuccess: () => closePaymentModal()
        });
    };

    const handleCancelInvoice = (id: string) => {
        if (confirm('Apakah Anda yakin ingin membatalkan tagihan ini?')) {
            router.put(`/super-admin/subscription-invoices/${id}/cancel`);
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Hapus permanen invoice ini dari riwayat sistem?')) {
            router.delete(`/super-admin/subscription-invoices/${id}`);
        }
    };

    return (
        <AuthenticatedLayout header="Subscription & Billing">
            <Head title="Manajemen Invoice SaaS - AkademiaOS" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-serif font-semibold text-[#0F1729] flex items-center gap-2">
                            <FileText className="w-6 h-6 text-[#B8935F]" />
                            Manajemen Tagihan SaaS
                        </h1>
                        <p className="text-sm text-[#8B93A8] mt-1">
                            Kelola tagihan pembayaran biaya berlangganan Tenant dan pantau jatuh temponya.
                        </p>
                    </div>
                    <button 
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-[#0F1729] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#1B2742] transition-colors shadow-sm ring-1 ring-[#0F1729]/10"
                    >
                        <Plus className="w-4 h-4 text-[#D4AF7A]" />
                        Buat Tagihan Manual
                    </button>
                </div>

                {/* Filter & Search */}
                <div className="bg-white p-4 rounded-xl border border-[#E2DDD0] shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A296]" />
                        <input
                            type="text"
                            placeholder="Cari No. Invoice atau nama institusi..."
                            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-md text-sm text-[#0F1729] focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <select className="bg-[#FAF8F3] border border-[#E2DDD0] text-[#0F1729] text-sm rounded-md px-3 py-2 outline-none focus:border-[#B8935F] w-full sm:w-auto">
                            <option value="">Semua Status</option>
                            <option value="unpaid">Belum Dibayar (Unpaid)</option>
                            <option value="paid">Lunas (Paid)</option>
                            <option value="canceled">Dibatalkan (Canceled)</option>
                        </select>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl border border-[#E2DDD0] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#FAF8F3] border-b border-[#E2DDD0] text-[11px] uppercase tracking-wider text-[#8B93A8] font-semibold">
                                    <th className="px-6 py-4">No. Tagihan & Keterangan</th>
                                    <th className="px-6 py-4">Institusi (Tenant)</th>
                                    <th className="px-6 py-4 text-right">Total Tagihan</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2DDD0]/60">
                                {invoiceList.length > 0 ? (
                                    invoiceList.map((inv: SubscriptionInvoice) => {
                                        const StatCfg = statusConfig[inv.status];
                                        const StatIcon = StatCfg.icon;

                                        return (
                                            <tr key={inv.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-[#0F1729]">{inv.invoice_number}</span>
                                                        <p className="text-xs text-[#8B93A8] mt-0.5 max-w-[200px] truncate">{inv.description}</p>
                                                        <span className="text-[10px] text-rose-500 mt-1.5 flex items-center gap-1 font-semibold">
                                                            <Clock className="w-3 h-3" /> Jatuh Tempo: {new Date(inv.due_date).toLocaleDateString('id-ID')}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="w-4 h-4 text-[#A8A296]" />
                                                        <p className="text-sm font-medium text-[#0F1729]">{inv.school?.name || 'Tenant Dihapus'}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <p className="text-base font-bold text-[#0F1729]">{formatRupiah(inv.amount)}</p>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md border ${StatCfg.bg} ${StatCfg.color}`}>
                                                            <StatIcon className="w-3 h-3" /> {StatCfg.label}
                                                        </span>
                                                        {inv.status === 'paid' && (
                                                            <span className="text-[9px] text-[#8B93A8] mt-1">
                                                                {new Date(inv.paid_at || '').toLocaleDateString('id-ID')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {inv.status === 'unpaid' && (
                                                            <>
                                                                <button 
                                                                    onClick={() => openPaymentModal(inv)}
                                                                    className="px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase rounded hover:bg-emerald-100 transition-colors shadow-sm"
                                                                >
                                                                    Terima Dana
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleCancelInvoice(inv.id)}
                                                                    className="p-1.5 text-[#8B93A8] hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                                                    title="Batalkan Tagihan"
                                                                >
                                                                    <XCircle className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                        <button className="p-1.5 text-[#8B93A8] hover:text-[#0F1729] hover:bg-[#E2DDD0] rounded transition-colors" title="Download PDF">
                                                            <FileDown className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <Banknote className="w-8 h-8 text-[#E2DDD0] mx-auto mb-3" />
                                            <p className="text-[#8B93A8] text-sm">Belum ada catatan tagihan atau pembayaran.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- MODAL BUAT INVOICE --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-[#0F1729]/60 backdrop-blur-sm" onClick={closeCreateModal}></div>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 flex flex-col">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2DDD0] bg-[#FAF8F3] rounded-t-2xl">
                            <div>
                                <h2 className="text-lg font-serif font-semibold text-[#0F1729]">Buat Tagihan SaaS</h2>
                                <p className="text-xs text-[#8B93A8] mt-0.5">Kirimkan tagihan secara manual kepada Tenant.</p>
                            </div>
                            <button onClick={closeCreateModal} className="text-[#8B93A8] hover:text-[#0F1729]">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={submitCreate} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[#0F1729]">Pilih Tenant (Sekolah) <span className="text-red-500">*</span></label>
                                    <select
                                        value={data.school_id}
                                        onChange={e => setData('school_id', e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none"
                                    >
                                        <option value="" disabled>-- Pilih Sekolah --</option>
                                        {schools.map(sch => (
                                            <option key={sch.id} value={sch.id}>{sch.name}</option>
                                        ))}
                                    </select>
                                    {errors.school_id && <p className="text-xs text-red-500">{errors.school_id}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[#0F1729]">Keterangan Tagihan <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        placeholder="Contoh: Tagihan Perpanjangan Addon Storage 5GB"
                                        className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none"
                                    />
                                    {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[#0F1729]">Jumlah Tagihan (Rp) <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        value={data.amount}
                                        onChange={e => setData('amount', e.target.value)}
                                        placeholder="150000"
                                        className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none"
                                    />
                                    {errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[#0F1729]">Jatuh Tempo <span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        value={data.due_date}
                                        onChange={e => setData('due_date', e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none"
                                    />
                                    {errors.due_date && <p className="text-xs text-red-500">{errors.due_date}</p>}
                                </div>
                                <div className="pt-4 flex justify-end gap-3 border-t border-[#E2DDD0]">
                                    <button type="button" onClick={closeCreateModal} className="px-4 py-2 text-sm text-[#8B93A8]">Batal</button>
                                    <button type="submit" disabled={processing} className="px-4 py-2 bg-[#0F1729] text-white rounded-md text-sm hover:bg-[#1B2742]">
                                        {processing ? 'Memproses...' : 'Kirim Tagihan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL KONFIRMASI PEMBAYARAN --- */}
            {isPaymentModalOpen && selectedInvoice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-[#0F1729]/60 backdrop-blur-sm" onClick={closePaymentModal}></div>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 flex flex-col">
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Banknote className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h2 className="text-lg font-bold text-[#0F1729] mb-1">Terima Pembayaran Manual</h2>
                            <p className="text-sm text-[#8B93A8] mb-6">Tandai Tagihan SaaS <strong>{selectedInvoice.invoice_number}</strong> sebagai lunas.</p>
                            
                            <form onSubmit={submitPayment} className="text-left space-y-4">
                                <div className="bg-[#FAF8F3] p-3 rounded-lg border border-[#E2DDD0] text-center mb-4">
                                    <p className="text-xs text-[#8B93A8] uppercase tracking-wider mb-1">Total Dibayar</p>
                                    <p className="text-xl font-bold text-[#0F1729]">{formatRupiah(selectedInvoice.amount)}</p>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[#0F1729]">Metode Pembayaran</label>
                                    <input
                                        type="text"
                                        value={payData.payment_method}
                                        onChange={e => setPayData('payment_method', e.target.value)}
                                        placeholder="Misal: Transfer Bank BCA a.n. Sekolah"
                                        className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] outline-none"
                                        required
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={closePaymentModal} className="flex-1 py-2 text-sm text-[#8B93A8] border border-[#E2DDD0] rounded-md hover:bg-slate-50">Batal</button>
                                    <button type="submit" disabled={processingPay} className="flex-1 py-2 bg-emerald-600 text-white rounded-md text-sm font-bold hover:bg-emerald-700">
                                        {processingPay ? 'Memproses...' : 'Konfirmasi Lunas'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}