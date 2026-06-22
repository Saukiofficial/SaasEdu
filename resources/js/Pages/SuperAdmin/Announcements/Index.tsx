import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Megaphone, Plus, Search, Info, AlertTriangle, 
    CheckCircle2, Tag, MoreVertical, X, Edit, Trash2,
    Send, Check
} from 'lucide-react';

interface Announcement {
    id: string;
    title: string;
    content: string;
    type: 'info' | 'warning' | 'success' | 'promo';
    is_active: boolean;
    created_at: string;
}

export default function AnnouncementsIndex({ announcements }: { announcements: any }) {
    const announcementList: Announcement[] = announcements?.data || [];
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form setup menggunakan Inertia
    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: '',
        content: '',
        type: 'info',
        is_active: true,
    });

    const typeConfig = {
        info: { label: 'Informasi', icon: Info, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
        warning: { label: 'Penting / Maintenance', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
        success: { label: 'Update Fitur', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
        promo: { label: 'Promosi', icon: Tag, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
    };

    const openCreateModal = () => {
        setEditingId(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (ann: Announcement) => {
        setEditingId(ann.id);
        setData({
            title: ann.title,
            content: ann.content,
            type: ann.type,
            is_active: ann.is_active,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        reset();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(`/super-admin/announcements/${editingId}`, { onSuccess: () => closeModal() });
        } else {
            post('/super-admin/announcements', { onSuccess: () => closeModal() });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
            router.delete(`/super-admin/announcements/${id}`);
        }
    };

    return (
        <AuthenticatedLayout header="Content Management">
            <Head title="Broadcast Pengumuman - AkademiaOS" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-serif font-semibold text-[#0F1729] flex items-center gap-2">
                            <Megaphone className="w-6 h-6 text-[#B8935F]" />
                            Broadcast & Pengumuman
                        </h1>
                        <p className="text-sm text-[#8B93A8] mt-1">
                            Kirimkan notifikasi massal, update fitur, atau info maintenance ke seluruh tenant.
                        </p>
                    </div>
                    <button 
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-[#0F1729] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#1B2742] transition-colors shadow-sm ring-1 ring-[#0F1729]/10"
                    >
                        <Plus className="w-4 h-4 text-[#D4AF7A]" />
                        Buat Broadcast Baru
                    </button>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 rounded-xl border border-[#E2DDD0] shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A296]" />
                        <input
                            type="text"
                            placeholder="Cari judul broadcast..."
                            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-md text-sm text-[#0F1729] focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Data List (Cards Layout) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {announcementList.length > 0 ? (
                        announcementList.map((ann: Announcement) => {
                            const Config = typeConfig[ann.type];
                            const Icon = Config.icon;

                            return (
                                <div key={ann.id} className="bg-white rounded-xl border border-[#E2DDD0] shadow-sm p-5 hover:shadow-md transition-shadow relative overflow-hidden group">
                                    {/* Indicator Line */}
                                    <div className={`absolute top-0 left-0 w-1 h-full ${Config.bg.split(' ')[0]}`}></div>
                                    
                                    <div className="flex justify-between items-start pl-2">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${Config.bg}`}>
                                                <Icon className={`w-5 h-5 ${Config.color}`} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-[#0F1729] text-base">{ann.title}</h3>
                                                    {!ann.is_active && (
                                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md border border-slate-200">
                                                            DRAFT
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-[#8B93A8] flex items-center gap-1.5 mb-3">
                                                    <Send className="w-3.5 h-3.5" /> 
                                                    Dipublikasikan pada: {new Date(ann.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                                <p className="text-sm text-[#1C2333] line-clamp-2 leading-relaxed">
                                                    {ann.content}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Actions */}
                                        <div className="flex flex-col gap-2 shrink-0">
                                            <button 
                                                onClick={() => openEditModal(ann)}
                                                className="p-1.5 text-[#8B93A8] hover:text-[#0F1729] hover:bg-[#FAF8F3] rounded-md transition-colors"
                                                title="Edit Broadcast"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(ann.id)}
                                                className="p-1.5 text-[#8B93A8] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-1 lg:col-span-2 bg-white rounded-xl border border-[#E2DDD0] shadow-sm p-12 text-center">
                            <Megaphone className="w-10 h-10 text-[#E2DDD0] mx-auto mb-3" />
                            <h3 className="text-[#0F1729] font-medium mb-1">Belum Ada Broadcast</h3>
                            <p className="text-[#8B93A8] text-sm">Anda belum pernah membuat pengumuman massal untuk tenant.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODAL FORM BROADCAST --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-[#0F1729]/60 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative z-10 flex flex-col max-h-[90vh]">
                        
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2DDD0] bg-[#FAF8F3] rounded-t-2xl">
                            <h2 className="text-lg font-serif font-semibold text-[#0F1729]">
                                {editingId ? 'Edit Broadcast' : 'Buat Broadcast Baru'}
                            </h2>
                            <button onClick={closeModal} className="text-[#8B93A8] hover:text-[#0F1729] transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form onSubmit={submit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[#0F1729]">Judul Pengumuman <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                        placeholder="Contoh: Maintenance Server Mingguan"
                                    />
                                    {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[#0F1729]">Tipe Broadcast <span className="text-red-500">*</span></label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {[
                                            { id: 'info', label: 'Informasi', icon: Info, c: 'text-blue-600', b: 'border-blue-200 bg-blue-50' },
                                            { id: 'warning', label: 'Penting', icon: AlertTriangle, c: 'text-red-600', b: 'border-red-200 bg-red-50' },
                                            { id: 'success', label: 'Update Fitur', icon: CheckCircle2, c: 'text-emerald-600', b: 'border-emerald-200 bg-emerald-50' },
                                            { id: 'promo', label: 'Promosi', icon: Tag, c: 'text-amber-600', b: 'border-amber-200 bg-amber-50' },
                                        ].map((type) => (
                                            <div 
                                                key={type.id}
                                                onClick={() => setData('type', type.id as any)}
                                                className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${
                                                    data.type === type.id 
                                                    ? `${type.b} ring-1 ring-offset-1 ring-${type.c.split('-')[1]}-500` 
                                                    : 'border-[#E2DDD0] bg-white hover:bg-[#FAF8F3]'
                                                }`}
                                            >
                                                <type.icon className={`w-5 h-5 ${data.type === type.id ? type.c : 'text-[#8B93A8]'}`} />
                                                <span className={`text-xs font-semibold ${data.type === type.id ? type.c : 'text-[#8B93A8]'}`}>
                                                    {type.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.type && <p className="text-xs text-red-500">{errors.type}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[#0F1729]">Isi Pesan <span className="text-red-500">*</span></label>
                                    <textarea
                                        value={data.content}
                                        onChange={e => setData('content', e.target.value)}
                                        rows={5}
                                        className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors resize-none"
                                        placeholder="Tulis detail pengumuman di sini..."
                                    ></textarea>
                                    {errors.content && <p className="text-xs text-red-500">{errors.content}</p>}
                                </div>

                                <div className="p-4 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-[#0F1729]">Publikasikan Sekarang?</p>
                                        <p className="text-xs text-[#8B93A8]">Jika tidak dicentang, akan disimpan sebagai Draf.</p>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setData('is_active', !data.is_active)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${data.is_active ? 'bg-[#16a34a]' : 'bg-[#D1D5DB]'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${data.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
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
                                        className="flex items-center gap-2 px-4 py-2 bg-[#0F1729] text-white rounded-md text-sm font-medium hover:bg-[#1B2742] transition-colors shadow-sm disabled:opacity-70"
                                    >
                                        {processing ? 'Memproses...' : (
                                            <>
                                                {data.is_active ? <Send className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                                                {editingId ? 'Simpan Perubahan' : (data.is_active ? 'Kirim Broadcast' : 'Simpan Draf')}
                                            </>
                                        )}
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