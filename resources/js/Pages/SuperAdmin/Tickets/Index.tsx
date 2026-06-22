import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    HeadphonesIcon, Search, Building2, Ticket as TicketIcon, 
    MoreVertical, X, Trash2, Clock, CheckCircle2, AlertCircle, PlayCircle
} from 'lucide-react';

interface School {
    id: string;
    name: string;
}

interface Ticket {
    id: string;
    ticket_number: string;
    school_id: string;
    subject: string;
    description: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    created_at: string;
    school?: School;
}

export default function TicketsIndex({ tickets }: { tickets: any }) {
    const ticketList: Ticket[] = tickets?.data || [];
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    const { data, setData, put, processing, reset } = useForm({
        status: 'open',
    });

    const statusConfig = {
        open: { label: 'Menunggu', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
        in_progress: { label: 'Diproses', icon: PlayCircle, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
        resolved: { label: 'Selesai', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
        closed: { label: 'Ditutup', icon: X, color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200' },
    };

    const priorityConfig = {
        low: { label: 'Rendah', color: 'text-slate-500 bg-slate-100' },
        normal: { label: 'Normal', color: 'text-blue-600 bg-blue-50' },
        high: { label: 'Tinggi', color: 'text-amber-600 bg-amber-50' },
        urgent: { label: 'Mendesak', color: 'text-red-600 bg-red-50' },
    };

    const openActionModal = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setData('status', ticket.status);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTicket(null);
        reset();
    };

    const updateStatus = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTicket) return;

        put(`/super-admin/tickets/${selectedTicket.id}`, {
            onSuccess: () => closeModal(),
        });
    };

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus tiket ini? Ini tidak bisa dibatalkan.')) {
            router.delete(`/super-admin/tickets/${id}`);
        }
    };

    return (
        <AuthenticatedLayout header="Support Center">
            <Head title="Manajemen Tiket - AkademiaOS" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-serif font-semibold text-[#0F1729] flex items-center gap-2">
                            <HeadphonesIcon className="w-6 h-6 text-[#B8935F]" />
                            Manajemen Tiket Bantuan (Helpdesk)
                        </h1>
                        <p className="text-sm text-[#8B93A8] mt-1">
                            Tinjau dan tanggapi kendala atau pertanyaan yang diajukan oleh pengguna Tenant.
                        </p>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 rounded-xl border border-[#E2DDD0] shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A296]" />
                        <input
                            type="text"
                            placeholder="Cari subjek atau nomor tiket..."
                            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-md text-sm text-[#0F1729] focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <select className="bg-[#FAF8F3] border border-[#E2DDD0] text-[#0F1729] text-sm rounded-md px-3 py-2 outline-none focus:border-[#B8935F] w-full sm:w-auto">
                            <option value="">Semua Status</option>
                            <option value="open">Menunggu</option>
                            <option value="in_progress">Diproses</option>
                            <option value="resolved">Selesai</option>
                        </select>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl border border-[#E2DDD0] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#FAF8F3] border-b border-[#E2DDD0] text-[11px] uppercase tracking-wider text-[#8B93A8] font-semibold">
                                    <th className="px-6 py-4">Nomor & Subjek</th>
                                    <th className="px-6 py-4">Institusi (Tenant)</th>
                                    <th className="px-6 py-4 text-center">Prioritas</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2DDD0]/60">
                                {ticketList.length > 0 ? (
                                    ticketList.map((ticket: Ticket) => {
                                        const StatCfg = statusConfig[ticket.status];
                                        const StatIcon = StatCfg.icon;
                                        const PrioCfg = priorityConfig[ticket.priority];

                                        return (
                                            <tr key={ticket.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-bold text-[#8B93A8] mb-0.5 flex items-center gap-1">
                                                            <TicketIcon className="w-3 h-3" /> {ticket.ticket_number}
                                                        </span>
                                                        <p className="text-sm font-semibold text-[#0F1729] line-clamp-1 max-w-xs">{ticket.subject}</p>
                                                        <span className="text-[10px] text-[#8B93A8] mt-1 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" /> {new Date(ticket.created_at).toLocaleDateString('id-ID')}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-medium text-[#0F1729] flex items-center gap-1.5">
                                                        <Building2 className="w-3.5 h-3.5 text-[#A8A296]" />
                                                        {ticket.school?.name || 'Tenant Dihapus'}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded ${PrioCfg.color}`}>
                                                        {PrioCfg.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md border ${StatCfg.bg} ${StatCfg.color}`}>
                                                        <StatIcon className="w-3 h-3" /> {StatCfg.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button 
                                                            onClick={() => openActionModal(ticket)}
                                                            className="px-3 py-1.5 bg-white border border-[#E2DDD0] text-[#0F1729] text-xs font-semibold rounded-md hover:border-[#B8935F] hover:text-[#B8935F] transition-colors shadow-sm"
                                                        >
                                                            Tinjau
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(ticket.id)}
                                                            className="p-1.5 text-[#8B93A8] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <HeadphonesIcon className="w-8 h-8 text-[#E2DDD0] mx-auto mb-3" />
                                            <p className="text-[#8B93A8] text-sm">Belum ada tiket bantuan yang diajukan.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- MODAL TINJAU & UPDATE STATUS TIKET --- */}
            {isModalOpen && selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-[#0F1729]/60 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative z-10 flex flex-col max-h-[90vh]">
                        
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2DDD0] bg-[#FAF8F3] rounded-t-2xl">
                            <div>
                                <h2 className="text-lg font-serif font-semibold text-[#0F1729]">Detail Tiket Bantuan</h2>
                                <p className="text-xs font-bold text-[#8B93A8] mt-0.5">{selectedTicket.ticket_number}</p>
                            </div>
                            <button onClick={closeModal} className="text-[#8B93A8] hover:text-[#0F1729] transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <div className="space-y-6">
                                {/* Info Utama */}
                                <div className="bg-[#FAF8F3] border border-[#E2DDD0] p-4 rounded-xl space-y-3">
                                    <div>
                                        <p className="text-xs text-[#8B93A8] font-medium mb-0.5">Pengirim (Tenant)</p>
                                        <p className="text-sm font-semibold text-[#0F1729]">{selectedTicket.school?.name || 'Anonim / Dihapus'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#E2DDD0]">
                                        <div>
                                            <p className="text-xs text-[#8B93A8] font-medium mb-0.5">Tingkat Prioritas</p>
                                            <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded ${priorityConfig[selectedTicket.priority].color}`}>
                                                {priorityConfig[selectedTicket.priority].label}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#8B93A8] font-medium mb-0.5">Tanggal Dibuat</p>
                                            <p className="text-sm font-semibold text-[#0F1729]">
                                                {new Date(selectedTicket.created_at).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Deskripsi Kendala */}
                                <div>
                                    <h3 className="text-sm font-bold text-[#D4AF7A] uppercase tracking-wider mb-2">Subjek: {selectedTicket.subject}</h3>
                                    <div className="bg-white border border-[#E2DDD0] p-4 rounded-xl text-sm text-[#1C2333] whitespace-pre-wrap leading-relaxed">
                                        {selectedTicket.description}
                                    </div>
                                </div>

                                {/* Update Status Form */}
                                <form onSubmit={updateStatus} className="pt-4 border-t border-[#E2DDD0]">
                                    <label className="text-sm font-medium text-[#0F1729] block mb-2">Update Status Tiket</label>
                                    <div className="flex items-center gap-3">
                                        <select
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value)}
                                            className="flex-1 px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                        >
                                            <option value="open">Menunggu (Open)</option>
                                            <option value="in_progress">Sedang Diproses (In Progress)</option>
                                            <option value="resolved">Telah Diselesaikan (Resolved)</option>
                                            <option value="closed">Ditutup (Closed)</option>
                                        </select>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 bg-[#0F1729] text-white rounded-md text-sm font-medium hover:bg-[#1B2742] transition-colors shadow-sm disabled:opacity-70"
                                        >
                                            {processing ? 'Menyimpan...' : 'Update Status'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}