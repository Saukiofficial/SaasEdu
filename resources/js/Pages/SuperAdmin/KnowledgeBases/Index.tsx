import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    BookOpen, Plus, Search, FileText, CheckCircle2, 
    XCircle, Edit, Trash2, X, Eye, EyeOff, LayoutTemplate
} from 'lucide-react';

interface Article {
    id: string;
    title: string;
    slug: string;
    category: string;
    content: string;
    is_published: boolean;
    updated_at: string;
}

export default function KnowledgeBasesIndex({ articles }: { articles: any }) {
    const articleList: Article[] = articles?.data || [];
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form setup menggunakan Inertia
    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: '',
        category: 'General',
        content: '',
        is_published: true,
    });

    const openCreateModal = () => {
        setEditingId(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (article: Article) => {
        setEditingId(article.id);
        setData({
            title: article.title,
            category: article.category,
            content: article.content,
            is_published: article.is_published,
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
            put(`/super-admin/knowledge-bases/${editingId}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post('/super-admin/knowledge-bases', {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus artikel ini secara permanen?')) {
            router.delete(`/super-admin/knowledge-bases/${id}`);
        }
    };

    return (
        <AuthenticatedLayout header="Support Center">
            <Head title="Knowledge Base - AkademiaOS" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-serif font-semibold text-[#0F1729] flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-[#B8935F]" />
                            Pusat Bantuan (Knowledge Base)
                        </h1>
                        <p className="text-sm text-[#8B93A8] mt-1">
                            Kelola panduan, dokumentasi, dan artikel FAQ untuk dibaca oleh klien.
                        </p>
                    </div>
                    <button 
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-[#0F1729] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#1B2742] transition-colors shadow-sm ring-1 ring-[#0F1729]/10"
                    >
                        <Plus className="w-4 h-4 text-[#D4AF7A]" />
                        Tulis Artikel Baru
                    </button>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 rounded-xl border border-[#E2DDD0] shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A296]" />
                        <input
                            type="text"
                            placeholder="Cari judul artikel..."
                            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-md text-sm text-[#0F1729] focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <select className="bg-[#FAF8F3] border border-[#E2DDD0] text-[#0F1729] text-sm rounded-md px-3 py-2 outline-none focus:border-[#B8935F] w-full sm:w-auto">
                            <option value="">Semua Kategori</option>
                            <option value="Sistem">Sistem</option>
                            <option value="Akademik">Akademik</option>
                            <option value="Keuangan">Keuangan</option>
                            <option value="General">General</option>
                        </select>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl border border-[#E2DDD0] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#FAF8F3] border-b border-[#E2DDD0] text-[11px] uppercase tracking-wider text-[#8B93A8] font-semibold">
                                    <th className="px-6 py-4">Judul Artikel</th>
                                    <th className="px-6 py-4 text-center">Kategori</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4">Terakhir Diubah</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2DDD0]/60">
                                {articleList.length > 0 ? (
                                    articleList.map((article: Article) => (
                                        <tr key={article.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-md bg-[#0F1729]/5 border border-[#E2DDD0] flex items-center justify-center shrink-0">
                                                        <FileText className="w-4 h-4 text-[#B8935F]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-[#0F1729]">{article.title}</p>
                                                        <p className="text-xs text-[#8B93A8] mt-0.5 truncate max-w-xs">{article.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center px-2 py-1 bg-white border border-[#E2DDD0] text-[#0F1729] text-[11px] font-semibold rounded-md">
                                                    {article.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {article.is_published ? (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-md">
                                                        <Eye className="w-3 h-3" /> Publik
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-md">
                                                        <EyeOff className="w-3 h-3" /> Draft
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[#8B93A8]">
                                                {new Date(article.updated_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button 
                                                        onClick={() => openEditModal(article)}
                                                        className="p-1.5 text-[#8B93A8] hover:text-[#0F1729] hover:bg-[#E2DDD0] rounded-md transition-colors" title="Edit Artikel"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(article.id)}
                                                        className="p-1.5 text-[#8B93A8] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Hapus Artikel"
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
                                            <LayoutTemplate className="w-8 h-8 text-[#E2DDD0] mx-auto mb-3" />
                                            <p className="text-[#8B93A8] text-sm">Belum ada artikel panduan yang diterbitkan.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- MODAL EDITOR ARTIKEL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-[#0F1729]/60 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl relative z-10 flex flex-col max-h-[90vh]">
                        
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2DDD0] bg-[#FAF8F3] rounded-t-2xl">
                            <h2 className="text-lg font-serif font-semibold text-[#0F1729]">
                                {editingId ? 'Edit Artikel Bantuan' : 'Tulis Artikel Bantuan Baru'}
                            </h2>
                            <button onClick={closeModal} className="text-[#8B93A8] hover:text-[#0F1729] transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form onSubmit={submit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-sm font-medium text-[#0F1729]">Judul Artikel <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={e => setData('title', e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                            placeholder="Masukkan judul artikel panduan..."
                                        />
                                        {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[#0F1729]">Kategori <span className="text-red-500">*</span></label>
                                        <select
                                            value={data.category}
                                            onChange={e => setData('category', e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                        >
                                            <option value="General">General</option>
                                            <option value="Sistem">Sistem & Pengaturan</option>
                                            <option value="Akademik">Modul Akademik & LMS</option>
                                            <option value="Keuangan">Modul Keuangan</option>
                                            <option value="PPDB">Penerimaan Siswa (PPDB)</option>
                                        </select>
                                        {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
                                    </div>

                                    <div className="space-y-1.5 flex flex-col justify-center pt-5">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={data.is_published}
                                                onChange={e => setData('is_published', e.target.checked)}
                                                className="w-4 h-4 text-[#B8935F] rounded border-[#E2DDD0] focus:ring-[#B8935F]"
                                            />
                                            <span className="text-sm font-medium text-[#0F1729]">Publikasikan ke semua Tenant</span>
                                        </label>
                                        <p className="text-[10px] text-[#8B93A8] ml-7">Hapus centang jika ingin menyimpannya sebagai draf sementara.</p>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[#0F1729]">Konten Panduan <span className="text-red-500">*</span></label>
                                    {/* Untuk environment production sungguhan, textarea ini diganti dengan library WYSIWYG seperti Quill.js atau TipTap */}
                                    <textarea
                                        value={data.content}
                                        onChange={e => setData('content', e.target.value)}
                                        rows={12}
                                        className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors resize-none"
                                        placeholder="Tulis instruksi, langkah-langkah, atau penjelasan teknis di sini..."
                                    ></textarea>
                                    {errors.content && <p className="text-xs text-red-500">{errors.content}</p>}
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
                                        {processing ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Terbitkan Artikel')}
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