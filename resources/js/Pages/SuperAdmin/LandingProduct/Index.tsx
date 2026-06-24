import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Package, Search, Trash2, Edit, Plus, X, Layers, Image as ImageIcon, UploadCloud, GripVertical, CheckCircle2, ShieldAlert } from 'lucide-react';

interface Feature {
    title: string;
    description: string;
}

interface Product {
    id: string;
    name: string;
    slug: string;
    subtitle: string | null;
    thumbnail_url: string | null;
    screenshots: string[];
    features: Feature[];
    is_active: boolean;
}

interface Props {
    products: { data: Product[]; links: any[]; current_page: number; last_page: number; };
    filters: { search?: string; };
}

export default function LandingProductIndex({ products, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const { data, setData, post, delete: destroy, errors, clearErrors, processing } = useForm({
        _method: 'post',
        name: '',
        subtitle: '',
        thumbnail: null as File | null,
        screenshots: [] as File[],
        features: [] as Feature[],
        is_active: true,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/super-admin/landing-products', { search }, { preserveState: true });
    };

    const openCreateModal = () => {
        clearErrors();
        setData({
            _method: 'post',
            name: '',
            subtitle: '',
            thumbnail: null,
            screenshots: [],
            features: [],
            is_active: true,
        });
        setEditingId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (prod: Product) => {
        clearErrors();
        setData({
            _method: 'put',
            name: prod.name,
            subtitle: prod.subtitle || '',
            thumbnail: null,
            screenshots: [],
            features: prod.features || [],
            is_active: prod.is_active,
        });
        setEditingId(prod.id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            post(`/super-admin/landing-products/${editingId}`, { 
                preserveScroll: true,
                onSuccess: () => closeModal() 
            });
        } else {
            post('/super-admin/landing-products', { 
                preserveScroll: true,
                onSuccess: () => closeModal() 
            });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            destroy(`/super-admin/landing-products/${id}`, { preserveScroll: true });
        }
    };

    const addFeature = () => setData('features', [...data.features, { title: '', description: '' }]);
    const updateFeature = (index: number, field: 'title' | 'description', value: string) => {
        const newFeatures = [...data.features];
        newFeatures[index][field] = value;
        setData('features', newFeatures);
    };
    const removeFeature = (index: number) => {
        setData('features', data.features.filter((_, i) => i !== index));
    };

    return (
        <AuthenticatedLayout header="Manajemen Produk">
            <Head title="Products CMS - Super Admin" />

            <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] overflow-hidden relative">
                <div className="p-6 border-b border-[#E2DDD0] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#FAF8F3] border border-[#E2DDD0] flex items-center justify-center">
                            <Package className="w-5 h-5 text-[#B8935F]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-serif font-semibold text-[#1C2333]">Produk & Solusi</h2>
                            <p className="text-xs text-[#8B93A8]">Kelola portofolio produk pada halaman Landing Page</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                        <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
                            <Search className="h-4 w-4 text-gray-400 absolute inset-y-0 my-auto left-3" />
                            <input type="text" placeholder="Cari produk..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 py-2 text-sm border-[#E2DDD0] focus:border-[#B8935F] focus:ring-[#B8935F] rounded-md shadow-sm w-full sm:w-56" />
                        </form>
                        <button onClick={openCreateModal} className="bg-[#1C2333] hover:bg-[#2A344A] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Tambah Produk
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-[#5B5648] uppercase bg-[#FAF8F3] border-b border-[#E2DDD0]">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Nama & Detail</th>
                                <th className="px-6 py-4 font-semibold">Statistik Konten</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.data.length > 0 ? products.data.map((prod) => (
                                <tr key={prod.id} className="border-b border-[#E2DDD0] hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-[#1C2333]">{prod.name}</p>
                                        <p className="text-xs text-[#8B93A8] line-clamp-1">{prod.subtitle}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 text-xs">
                                            <span className="flex items-center gap-1 text-slate-600"><ImageIcon className="w-3.5 h-3.5 text-blue-500"/> {prod.screenshots?.length || 0} Gambar Mockup</span>
                                            <span className="flex items-center gap-1 text-slate-600"><Layers className="w-3.5 h-3.5 text-indigo-500"/> {prod.features?.length || 0} Fitur Detail</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 w-max ${prod.is_active ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                                            {prod.is_active ? 'Aktif Tampil' : 'Disembunyikan'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEditModal(prod)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md border border-transparent hover:border-blue-200 transition-colors"><Edit className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(prod.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md border border-transparent hover:border-red-200 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">Belum ada produk yang dikonfigurasi.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Tambah/Edit dengan UI Modern */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden relative">
                        
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">{editingId ? 'Edit Solusi Produk' : 'Tambah Produk Baru'}</h3>
                                <p className="text-xs text-slate-500">Lengkapi data produk untuk ditampilkan di halaman utama.</p>
                            </div>
                            <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar bg-slate-50/30">
                            <form id="productForm" onSubmit={handleSubmit} className="space-y-8">
                                
                                {/* ALert Global Error */}
                                {Object.keys(errors).length > 0 && (
                                    <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-start gap-2 mb-6">
                                        <ShieldAlert className="w-5 h-5 shrink-0" /> 
                                        <div>
                                            <strong>Gagal menyimpan!</strong> Terdapat kesalahan pada form Anda. Mohon periksa isian yang berwarna merah atau pastikan format/ukuran gambar sesuai (Maks 2MB).
                                        </div>
                                    </div>
                                )}

                                {/* 1. Informasi Dasar Card */}
                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                                    <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-2">
                                        <div className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">1</div>
                                        <h4 className="font-bold text-slate-800">Informasi Dasar</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Produk / Solusi</label>
                                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full text-sm rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500" placeholder="Contoh: Sistem Informasi Pendidikan" required />
                                            {errors.name && <span className="text-xs text-red-500 mt-1">{errors.name}</span>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Sub Judul (Deskripsi Singkat)</label>
                                            <textarea value={data.subtitle} onChange={e => setData('subtitle', e.target.value)} className="w-full text-sm rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500" rows={2} placeholder="Tuliskan deskripsi singkat yang menarik..." />
                                        </div>
                                        <div className="md:col-span-2 pt-2">
                                            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                                <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-slate-300" /> 
                                                <span className="text-sm font-semibold text-slate-700">Tampilkan produk ini di halaman Landing Page</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Media & Gambar Card */}
                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
                                    <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-2">
                                        <div className="w-6 h-6 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">2</div>
                                        <h4 className="font-bold text-slate-800">Media Visual</h4>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Thumbnail Dropzone */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-2">Thumbnail Gambar (Untuk Card)</label>
                                            <label htmlFor="thumbnail-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors overflow-hidden relative">
                                                {data.thumbnail ? (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-blue-50">
                                                        <CheckCircle2 className="w-8 h-8 text-blue-500 mb-1" />
                                                        <span className="absolute bottom-2 text-xs font-semibold text-blue-700 max-w-[80%] truncate text-center">{data.thumbnail.name}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
                                                        <UploadCloud className="w-8 h-8 mb-2 text-slate-400" />
                                                        <p className="text-xs font-semibold">Klik untuk memilih thumbnail</p>
                                                        <p className="text-[10px] mt-1">SVG, PNG, JPG (Max 2MB)</p>
                                                    </div>
                                                )}
                                                <input id="thumbnail-upload" type="file" accept="image/png, image/jpeg, image/jpg, image/webp" onChange={e => setData('thumbnail', e.target.files ? e.target.files[0] : null)} className="hidden" />
                                            </label>
                                            {editingId && <p className="text-[10px] text-orange-500 mt-2 font-medium">* Biarkan kosong jika tidak ingin mengubah thumbnail lama.</p>}
                                            {errors.thumbnail && <span className="text-xs text-red-500 mt-1 block">{errors.thumbnail}</span>}
                                        </div>

                                        {/* Screenshots Dropzone */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-2">Mockup Laptop (Banyak Gambar)</label>
                                            <label htmlFor="screenshots-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors overflow-hidden relative">
                                                {data.screenshots.length > 0 ? (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-50">
                                                        <Layers className="w-8 h-8 text-indigo-500 mb-1" />
                                                        <span className="text-xs font-bold text-indigo-700">{data.screenshots.length} File Dipilih</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
                                                        <ImageIcon className="w-8 h-8 mb-2 text-slate-400" />
                                                        <p className="text-xs font-semibold">Pilih beberapa file sekaligus</p>
                                                        <p className="text-[10px] mt-1">PNG, JPG, WEBP (Max 2MB/file)</p>
                                                    </div>
                                                )}
                                                <input id="screenshots-upload" type="file" multiple accept="image/png, image/jpeg, image/jpg, image/webp" onChange={e => setData('screenshots', Array.from(e.target.files || []))} className="hidden" />
                                            </label>
                                            <p className="text-[10px] text-slate-500 mt-2 leading-tight">
                                                * Tahan tombol CTRL/CMD saat memilih file.<br/>
                                                {editingId && <span className="text-orange-500 font-medium">* Upload baru akan menimpa seluruh gambar lama.</span>}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Features Repeater */}
                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">3</div>
                                            <h4 className="font-bold text-slate-800">Daftar Fitur Unggulan</h4>
                                        </div>
                                        <button type="button" onClick={addFeature} className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                                            <Plus className="w-3.5 h-3.5" /> Tambah Fitur
                                        </button>
                                    </div>
                                    
                                    {data.features.length === 0 && (
                                        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                                            <p className="text-sm font-medium">Belum ada fitur ditambahkan.</p>
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        {data.features.map((feat, idx) => (
                                            <div key={idx} className="relative flex items-start gap-3 bg-slate-50/50 p-4 rounded-xl border border-slate-200 group hover:border-blue-300 transition-colors">
                                                <div className="mt-2 text-slate-300 cursor-move">
                                                    <GripVertical className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 space-y-3 pr-8">
                                                    <div>
                                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Judul Fitur</label>
                                                        <input type="text" value={feat.title} onChange={e => updateFeature(idx, 'title', e.target.value)} className="w-full text-sm font-semibold rounded-md border-slate-300 focus:border-blue-500 focus:ring-blue-500" placeholder="Contoh: Website Profesional" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Deskripsi Singkat</label>
                                                        <input type="text" value={feat.description} onChange={e => updateFeature(idx, 'description', e.target.value)} className="w-full text-sm text-slate-600 rounded-md border-slate-300 focus:border-blue-500 focus:ring-blue-500" placeholder="Penjelasan singkat mengenai fitur ini..." />
                                                    </div>
                                                </div>
                                                <button type="button" onClick={() => removeFeature(idx)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </form>
                        </div>
                        
                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-white">
                            <button onClick={closeModal} type="button" className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                Batal
                            </button>
                            <button form="productForm" type="submit" disabled={processing} className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-md disabled:opacity-70 flex items-center gap-2">
                                {processing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Memproses...
                                    </>
                                ) : (
                                    'Simpan Data Produk'
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
