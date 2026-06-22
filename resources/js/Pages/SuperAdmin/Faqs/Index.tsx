import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    HelpCircle, Plus, Search, MessageCircleQuestion, 
    MoreVertical, X, Edit, Trash2, CheckCircle2, XCircle
} from 'lucide-react';

interface Faq {
    id: string;
    question: string;
    answer: string;
    category: string;
    order_num: number;
    is_active: boolean;
}

export default function FaqsIndex({ faqs }: { faqs: any }) {
    const faqList: Faq[] = faqs?.data || [];
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form setup menggunakan Inertia
    const { data, setData, post, put, processing, errors, reset } = useForm({
        question: '',
        answer: '',
        category: 'General',
        order_num: 0,
        is_active: true,
    });

    const openCreateModal = () => {
        setEditingId(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (faq: Faq) => {
        setEditingId(faq.id);
        setData({
            question: faq.question,
            answer: faq.answer,
            category: faq.category,
            order_num: faq.order_num,
            is_active: faq.is_active,
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
            put(`/super-admin/faqs/${editingId}`, { onSuccess: () => closeModal() });
        } else {
            post('/super-admin/faqs', { onSuccess: () => closeModal() });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus FAQ ini?')) {
            router.delete(`/super-admin/faqs/${id}`);
        }
    };

    return (
        <AuthenticatedLayout header="Content Management">
            <Head title="Manajemen FAQ - AkademiaOS" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-serif font-semibold text-[#0F1729] flex items-center gap-2">
                            <HelpCircle className="w-6 h-6 text-[#B8935F]" />
                            Frequently Asked Questions (FAQ)
                        </h1>
                        <p className="text-sm text-[#8B93A8] mt-1">
                            Kelola daftar pertanyaan yang sering diajukan beserta solusinya untuk membantu Tenant.
                        </p>
                    </div>
                    <button 
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-[#0F1729] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#1B2742] transition-colors shadow-sm ring-1 ring-[#0F1729]/10"
                    >
                        <Plus className="w-4 h-4 text-[#D4AF7A]" />
                        Tambah FAQ Baru
                    </button>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 rounded-xl border border-[#E2DDD0] shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A296]" />
                        <input
                            type="text"
                            placeholder="Cari pertanyaan..."
                            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-md text-sm text-[#0F1729] focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select className="bg-[#FAF8F3] border border-[#E2DDD0] text-[#0F1729] text-sm rounded-md px-3 py-2 outline-none focus:border-[#B8935F] w-full sm:w-auto">
                        <option value="">Semua Kategori</option>
                        <option value="General">General</option>
                        <option value="Billing">Billing & Pembayaran</option>
                        <option value="Teknis">Kendala Teknis</option>
                        <option value="Akun">Akun & Akses</option>
                    </select>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl border border-[#E2DDD0] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#FAF8F3] border-b border-[#E2DDD0] text-[11px] uppercase tracking-wider text-[#8B93A8] font-semibold">
                                    <th className="px-6 py-4 w-12 text-center">Urutan</th>
                                    <th className="px-6 py-4">Pertanyaan & Jawaban</th>
                                    <th className="px-6 py-4 text-center">Kategori</th>
                                    <th className="px-6 py-4 text-center">Status Tampil</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2DDD0]/60">
                                {faqList.length > 0 ? (
                                    faqList.map((faq: Faq) => (
                                        <tr key={faq.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                                            <td className="px-6 py-4 text-center">
                                                <span className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded text-xs font-semibold text-slate-500 mx-auto">
                                                    {faq.order_num}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-start gap-3">
                                                    <MessageCircleQuestion className="w-4 h-4 text-[#B8935F] mt-0.5 shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-semibold text-[#0F1729] mb-1">{faq.question}</p>
                                                        <p className="text-xs text-[#8B93A8] line-clamp-2 leading-relaxed">{faq.answer}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center px-2 py-1 bg-white border border-[#E2DDD0] text-[#0F1729] text-[11px] font-semibold rounded-md">
                                                    {faq.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {faq.is_active ? (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-md">
                                                        <CheckCircle2 className="w-3 h-3" /> Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md">
                                                        <XCircle className="w-3 h-3" /> Sembunyi
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button 
                                                        onClick={() => openEditModal(faq)}
                                                        className="p-1.5 text-[#8B93A8] hover:text-[#0F1729] hover:bg-[#E2DDD0] rounded-md transition-colors" title="Edit FAQ"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(faq.id)}
                                                        className="p-1.5 text-[#8B93A8] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Hapus FAQ"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <HelpCircle className="w-8 h-8 text-[#E2DDD0] mx-auto mb-3" />
                                            <p className="text-[#8B93A8] text-sm">Belum ada data FAQ yang ditambahkan.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- MODAL FORM FAQ --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-[#0F1729]/60 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative z-10 flex flex-col max-h-[90vh]">
                        
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2DDD0] bg-[#FAF8F3] rounded-t-2xl">
                            <h2 className="text-lg font-serif font-semibold text-[#0F1729]">
                                {editingId ? 'Edit Pertanyaan (FAQ)' : 'Tambah Pertanyaan (FAQ) Baru'}
                            </h2>
                            <button onClick={closeModal} className="text-[#8B93A8] hover:text-[#0F1729] transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form onSubmit={submit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[#0F1729]">Pertanyaan <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={data.question}
                                        onChange={e => setData('question', e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                        placeholder="Contoh: Bagaimana cara reset password admin?"
                                    />
                                    {errors.question && <p className="text-xs text-red-500">{errors.question}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[#0F1729]">Jawaban & Solusi <span className="text-red-500">*</span></label>
                                    <textarea
                                        value={data.answer}
                                        onChange={e => setData('answer', e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors resize-none"
                                        placeholder="Tulis jawaban lengkap di sini..."
                                    ></textarea>
                                    {errors.answer && <p className="text-xs text-red-500">{errors.answer}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[#0F1729]">Kategori <span className="text-red-500">*</span></label>
                                        <select
                                            value={data.category}
                                            onChange={e => setData('category', e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                        >
                                            <option value="General">General / Umum</option>
                                            <option value="Billing">Billing & Pembayaran</option>
                                            <option value="Teknis">Kendala Teknis Server</option>
                                            <option value="Akun">Akun & Akses Pengguna</option>
                                            <option value="Fitur">Panduan Fitur Baru</option>
                                        </select>
                                        {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[#0F1729]">Urutan Tampil (Order)</label>
                                        <input
                                            type="number"
                                            value={data.order_num}
                                            onChange={e => setData('order_num', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                            placeholder="0"
                                        />
                                        <p className="text-[10px] text-[#8B93A8]">Angka lebih kecil akan tampil lebih dulu di atas.</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16a34a]"></div>
                                        <span className="ml-3 text-sm font-medium text-[#0F1729]">Tampilkan FAQ ini untuk Tenant</span>
                                    </label>
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
                                        {processing ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Tambah FAQ')}
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
