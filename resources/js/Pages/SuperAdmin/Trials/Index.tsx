import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Clock, Building2, User, Mail, MoreVertical, 
    Plus, Search, CheckCircle2, AlertTriangle, XCircle, X
} from 'lucide-react';

interface Trial {
    id: string;
    school_name: string;
    contact_person: string;
    email: string;
    phone: string | null;
    start_date: string;
    end_date: string;
    status: 'active' | 'expired' | 'converted' | 'canceled';
}

export default function TrialsIndex({ trials }: { trials: any }) {
    const trialList: Trial[] = trials?.data || [];
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Inertia form state management
    const { data, setData, post, processing, errors, reset } = useForm({
        school_name: '',
        contact_person: '',
        email: '',
        phone: '',
        start_date: '',
        end_date: '',
        notes: '',
    });

    const statusConfig = {
        active: { label: 'Aktif', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock },
        expired: { label: 'Kedaluwarsa', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertTriangle },
        converted: { label: 'Berlangganan', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
        canceled: { label: 'Dibatalkan', color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
    };

    // Helper untuk menghitung sisa hari
    const getDaysRemaining = (endDate: string) => {
        const end = new Date(endDate);
        const now = new Date();
        const diffTime = end.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    // Handler submit form
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/super-admin/trials', {
            onSuccess: () => {
                setIsModalOpen(false);
                reset(); // Bersihkan form setelah berhasil
            },
        });
    };

    // Handler tutup modal
    const closeModal = () => {
        setIsModalOpen(false);
        reset(); // Bersihkan form ketika dibatalkan
    };

    return (
        <AuthenticatedLayout header="Subscription & Trial">
            <Head title="Manajemen Trial - AkademiaOS" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-serif font-semibold text-[#0F1729] flex items-center gap-2">
                            <Clock className="w-6 h-6 text-[#B8935F]" />
                            Manajemen Masa Percobaan (Trial)
                        </h1>
                        <p className="text-sm text-[#8B93A8] mt-1">
                            Pantau institusi yang sedang dalam masa percobaan dan sisa waktu mereka.
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-[#0F1729] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#1B2742] transition-colors shadow-sm ring-1 ring-[#0F1729]/10"
                    >
                        <Plus className="w-4 h-4 text-[#D4AF7A]" />
                        Tambah Trial Baru
                    </button>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 rounded-xl border border-[#E2DDD0] shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A296]" />
                        <input
                            type="text"
                            placeholder="Cari institusi atau email..."
                            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-md text-sm text-[#0F1729] focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select className="bg-[#FAF8F3] border border-[#E2DDD0] text-[#0F1729] text-sm rounded-md px-3 py-2 outline-none focus:border-[#B8935F] w-full sm:w-auto">
                        <option value="">Semua Status</option>
                        <option value="active">Aktif</option>
                        <option value="expired">Kedaluwarsa</option>
                        <option value="converted">Telah Berlangganan</option>
                    </select>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl border border-[#E2DDD0] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#FAF8F3] border-b border-[#E2DDD0] text-[11px] uppercase tracking-wider text-[#8B93A8] font-semibold">
                                    <th className="px-6 py-4">Institusi & ID</th>
                                    <th className="px-6 py-4">Kontak Person</th>
                                    <th className="px-6 py-4">Masa Berlaku</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2DDD0]/60">
                                {trialList.length > 0 ? (
                                    trialList.map((trial: Trial) => {
                                        const StatusIcon = statusConfig[trial.status].icon;
                                        const daysLeft = getDaysRemaining(trial.end_date);
                                        
                                        return (
                                            <tr key={trial.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-[#0F1729]/5 border border-[#E2DDD0] flex items-center justify-center shrink-0">
                                                            <Building2 className="w-4 h-4 text-[#B8935F]" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-[#0F1729]">{trial.school_name}</p>
                                                            <p className="text-xs text-[#8B93A8] mt-0.5">{trial.id.substring(0, 8)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-medium text-[#0F1729] flex items-center gap-1.5">
                                                        <User className="w-3.5 h-3.5 text-[#A8A296]" />
                                                        {trial.contact_person}
                                                    </p>
                                                    <p className="text-[11px] text-[#8B93A8] flex items-center gap-1 mt-1.5">
                                                        <Mail className="w-3 h-3" /> {trial.email}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-medium text-[#0F1729]">
                                                        {new Date(trial.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(trial.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </p>
                                                    {trial.status === 'active' && (
                                                        <p className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${daysLeft <= 3 ? 'text-red-500' : 'text-emerald-600'}`}>
                                                            <Clock className="w-3 h-3" /> Sisa {daysLeft} Hari
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${statusConfig[trial.status].color}`}>
                                                        <StatusIcon className="w-3 h-3" />
                                                        {statusConfig[trial.status].label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button className="p-1.5 text-[#8B93A8] hover:text-[#0F1729] hover:bg-[#E2DDD0] rounded-md transition-colors" title="Opsi">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <Clock className="w-8 h-8 text-[#E2DDD0] mx-auto mb-3" />
                                            <p className="text-[#8B93A8] text-sm">Belum ada data masa percobaan (trial).</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- MODAL TAMBAH TRIAL BARU --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-[#0F1729]/60 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative z-10 flex flex-col max-h-[90vh]">
                        
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2DDD0]">
                            <h2 className="text-lg font-serif font-semibold text-[#0F1729]">Tambah Masa Percobaan (Trial) Baru</h2>
                            <button onClick={closeModal} className="text-[#8B93A8] hover:text-[#0F1729] transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body & Form */}
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form onSubmit={submit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[#0F1729]">Nama Institusi <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={data.school_name}
                                            onChange={e => setData('school_name', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                            placeholder="Contoh: SMA Negeri 1 Jakarta"
                                        />
                                        {errors.school_name && <p className="text-xs text-red-500">{errors.school_name}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[#0F1729]">Kontak Person <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={data.contact_person}
                                            onChange={e => setData('contact_person', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                            placeholder="Nama penanggung jawab"
                                        />
                                        {errors.contact_person && <p className="text-xs text-red-500">{errors.contact_person}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[#0F1729]">Email <span className="text-red-500">*</span></label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                            placeholder="email@sekolah.sch.id"
                                        />
                                        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[#0F1729]">Nomor Telepon/WA</label>
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                            placeholder="0812xxxxxx"
                                        />
                                        {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[#0F1729]">Tanggal Mulai <span className="text-red-500">*</span></label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={e => setData('start_date', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                        />
                                        {errors.start_date && <p className="text-xs text-red-500">{errors.start_date}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[#0F1729]">Tanggal Berakhir <span className="text-red-500">*</span></label>
                                        <input
                                            type="date"
                                            value={data.end_date}
                                            onChange={e => setData('end_date', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                        />
                                        {errors.end_date && <p className="text-xs text-red-500">{errors.end_date}</p>}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[#0F1729]">Catatan Tambahan</label>
                                    <textarea
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none resize-none transition-colors"
                                        placeholder="Catatan opsional mengenai trial ini..."
                                    ></textarea>
                                    {errors.notes && <p className="text-xs text-red-500">{errors.notes}</p>}
                                </div>

                                {/* Modal Footer / Actions */}
                                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E2DDD0]">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 text-sm font-medium text-[#8B93A8] hover:text-[#0F1729] transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-[#0F1729] text-white rounded-md text-sm font-medium hover:bg-[#1B2742] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Trial'}
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
