import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Target, Building2, User, Phone, Mail, MoreVertical, 
    Plus, CheckCircle2, XCircle, Search, X
} from 'lucide-react';

interface Lead {
    id: string;
    school_name: string;
    contact_person: string;
    email: string | null;
    phone: string | null;
    status: 'new' | 'contacted' | 'demo_scheduled' | 'negotiation' | 'converted' | 'lost';
    created_at: string;
}

export default function LeadsIndex({ leads }: { leads: any }) {
    const leadList: Lead[] = leads?.data || [];
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Inertia form state
    const { data, setData, post, processing, errors, reset } = useForm({
        school_name: '',
        contact_person: '',
        email: '',
        phone: '',
        notes: '',
    });

    const statusConfig = {
        new: { label: 'Baru', color: 'bg-blue-50 text-blue-700 border-blue-200' },
        contacted: { label: 'Dihubungi', color: 'bg-amber-50 text-amber-700 border-amber-200' },
        demo_scheduled: { label: 'Jadwal Demo', color: 'bg-purple-50 text-purple-700 border-purple-200' },
        negotiation: { label: 'Negosiasi', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
        converted: { label: 'Berhasil', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        lost: { label: 'Gagal', color: 'bg-red-50 text-red-700 border-red-200' },
    };

    // Fungsi ganti status langsung dari tabel (Opsional)
    const updateStatus = (id: string, newStatus: string) => {
        router.put(`/super-admin/leads/${id}/status`, { status: newStatus }, {
            preserveScroll: true
        });
    };

    const openCreateModal = () => {
        reset();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/super-admin/leads', {
            onSuccess: () => closeModal()
        });
    };

    return (
        <AuthenticatedLayout header="CRM & Leads Management">
            <Head title="Leads - AkademiaOS" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-serif font-semibold text-[#0F1729] flex items-center gap-2">
                            <Target className="w-6 h-6 text-[#B8935F]" />
                            Prospek Klien (Leads)
                        </h1>
                        <p className="text-sm text-[#8B93A8] mt-1">
                            Kelola calon institusi dan lacak status konversi ke AkademiaOS.
                        </p>
                    </div>
                    <button 
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-[#0F1729] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#1B2742] transition-colors shadow-sm ring-1 ring-[#0F1729]/10"
                    >
                        <Plus className="w-4 h-4 text-[#D4AF7A]" />
                        Tambah Lead
                    </button>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 rounded-xl border border-[#E2DDD0] shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A296]" />
                        <input
                            type="text"
                            placeholder="Cari nama sekolah atau kontak..."
                            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-md text-sm text-[#0F1729] focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <select className="bg-[#FAF8F3] border border-[#E2DDD0] text-[#0F1729] text-sm rounded-md px-3 py-2 outline-none focus:border-[#B8935F] w-full sm:w-auto">
                            <option value="">Semua Status</option>
                            <option value="new">Baru</option>
                            <option value="contacted">Dihubungi</option>
                            <option value="demo_scheduled">Jadwal Demo</option>
                            <option value="negotiation">Negosiasi</option>
                            <option value="converted">Berhasil (Konversi)</option>
                            <option value="lost">Gagal</option>
                        </select>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl border border-[#E2DDD0] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#FAF8F3] border-b border-[#E2DDD0] text-[11px] uppercase tracking-wider text-[#8B93A8] font-semibold">
                                    <th className="px-6 py-4">Institusi & ID</th>
                                    <th className="px-6 py-4">Kontak Person</th>
                                    <th className="px-6 py-4">Status Prospek</th>
                                    <th className="px-6 py-4">Tanggal Masuk</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2DDD0]/60">
                                {leadList.length > 0 ? (
                                    leadList.map((lead: Lead) => (
                                        <tr key={lead.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-[#0F1729]/5 border border-[#E2DDD0] flex items-center justify-center shrink-0">
                                                        <Building2 className="w-4 h-4 text-[#B8935F]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-[#0F1729]">{lead.school_name}</p>
                                                        <p className="text-xs text-[#8B93A8] mt-0.5">{lead.id.substring(0, 8)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-[#0F1729] flex items-center gap-1.5">
                                                    <User className="w-3.5 h-3.5 text-[#A8A296]" />
                                                    {lead.contact_person}
                                                </p>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    {lead.phone && (
                                                        <span className="text-[11px] text-[#8B93A8] flex items-center gap-1">
                                                            <Phone className="w-3 h-3" /> {lead.phone}
                                                        </span>
                                                    )}
                                                    {lead.email && (
                                                        <span className="text-[11px] text-[#8B93A8] flex items-center gap-1">
                                                            <Mail className="w-3 h-3" /> {lead.email}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select 
                                                    value={lead.status}
                                                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                                                    className={`text-[11px] font-semibold rounded-md border pl-2 pr-6 py-1 outline-none appearance-none cursor-pointer ${statusConfig[lead.status].color}`}
                                                >
                                                    <option value="new">Baru</option>
                                                    <option value="contacted">Dihubungi</option>
                                                    <option value="demo_scheduled">Jadwal Demo</option>
                                                    <option value="negotiation">Negosiasi</option>
                                                    <option value="converted">Berhasil (Konversi)</option>
                                                    <option value="lost">Gagal</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[#8B93A8]">
                                                {new Date(lead.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button 
                                                    onClick={() => {
                                                        if(confirm('Hapus prospek ini?')) router.delete(`/super-admin/leads/${lead.id}`);
                                                    }}
                                                    className="p-1.5 text-[#8B93A8] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Hapus"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <Target className="w-8 h-8 text-[#E2DDD0] mx-auto mb-3" />
                                            <p className="text-[#8B93A8] text-sm">Belum ada data prospek ditemukan.</p>
                                            <p className="text-xs text-[#8B93A8]/70 mt-1">Gunakan tombol "Tambah Lead" di atas untuk memasukkan data baru.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- MODAL FORM TAMBAH LEAD --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-[#0F1729]/60 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative z-10 flex flex-col max-h-[90vh]">
                        
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2DDD0] bg-[#FAF8F3] rounded-t-2xl">
                            <div>
                                <h2 className="text-lg font-serif font-semibold text-[#0F1729]">Tambah Prospek (Lead) Baru</h2>
                                <p className="text-xs text-[#8B93A8] mt-0.5">Masukkan data institusi yang tertarik dengan layanan Anda.</p>
                            </div>
                            <button onClick={closeModal} className="text-[#8B93A8] hover:text-[#0F1729] transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form onSubmit={submit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-sm font-medium text-[#0F1729]">Nama Institusi / Sekolah <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={data.school_name}
                                            onChange={e => setData('school_name', e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                            placeholder="Contoh: SMA Negeri 1 Nusantara"
                                        />
                                        {errors.school_name && <p className="text-xs text-red-500">{errors.school_name}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[#0F1729]">Kontak Person <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={data.contact_person}
                                            onChange={e => setData('contact_person', e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                            placeholder="Nama penanggung jawab"
                                        />
                                        {errors.contact_person && <p className="text-xs text-red-500">{errors.contact_person}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[#0F1729]">Alamat Email</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                            placeholder="email@sekolah.sch.id"
                                        />
                                        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-sm font-medium text-[#0F1729]">Nomor Telepon/WA</label>
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                            placeholder="0812xxxxxx"
                                        />
                                        {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                                    </div>

                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-sm font-medium text-[#0F1729]">Catatan Tambahan (Opsional)</label>
                                        <textarea
                                            value={data.notes}
                                            onChange={e => setData('notes', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors resize-none"
                                            placeholder="Tulis informasi tambahan atau hasil diskusi di sini..."
                                        ></textarea>
                                        {errors.notes && <p className="text-xs text-red-500">{errors.notes}</p>}
                                    </div>
                                </div>

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
                                        className="px-4 py-2 bg-[#0F1729] text-white rounded-md text-sm font-medium hover:bg-[#1B2742] transition-colors shadow-sm disabled:opacity-70"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Data Lead'}
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