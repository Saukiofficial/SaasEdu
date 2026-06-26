import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Code, Search, Trash2, Edit, Plus, X, Image as ImageIcon, UploadCloud, Link as LinkIcon, FileArchive, Coins, ShieldAlert } from 'lucide-react';

interface SourceCode {
    id: string;
    title: string;
    slug: string;
    description: string;
    price: string;
    thumbnail: string | null;
    file_path: string | null;
    demo_url: string | null;
    tech_stack: string[];
    features: string[];
    is_active: boolean;
}

interface Props {
    sourceCodes: { data: SourceCode[]; links: any[]; current_page: number; last_page: number; };
    filters: { search?: string; };
}

export default function SourceCodeIndex({ sourceCodes, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const { data, setData, post, delete: destroy, reset, errors, clearErrors, processing } = useForm({
        _method: 'post',
        title: '',
        description: '',
        price: '',
        demo_url: '',
        tech_stack: [] as string[],
        features: [] as string[],
        is_active: true,
        thumbnail: null as File | null,
        file_archive: null as File | null,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/super-admin/source-codes', { search }, { preserveState: true });
    };

    const openCreateModal = () => {
        clearErrors();
        reset();
        setData('_method', 'post');
        setEditingId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (sc: SourceCode) => {
        clearErrors();
        setData({
            _method: 'put',
            title: sc.title,
            description: sc.description || '',
            price: Number(sc.price).toString(),
            demo_url: sc.demo_url || '',
            tech_stack: sc.tech_stack || [],
            features: sc.features || [],
            is_active: sc.is_active,
            thumbnail: null,
            file_archive: null,
        });
        setEditingId(sc.id);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            post(`/super-admin/source-codes/${editingId}`, { preserveScroll: true, onSuccess: () => closeModal() });
        } else {
            post('/super-admin/source-codes', { preserveScroll: true, onSuccess: () => closeModal() });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini? File arsip juga akan terhapus.')) {
            destroy(`/super-admin/source-codes/${id}`, { preserveScroll: true });
        }
    };

    // Array Handlers
    const addTech = () => setData('tech_stack', [...data.tech_stack, '']);
    const updateTech = (i: number, val: string) => { const n = [...data.tech_stack]; n[i] = val; setData('tech_stack', n); };
    const removeTech = (i: number) => setData('tech_stack', data.tech_stack.filter((_, idx) => idx !== i));

    const addFeature = () => setData('features', [...data.features, '']);
    const updateFeature = (i: number, val: string) => { const n = [...data.features]; n[i] = val; setData('features', n); };
    const removeFeature = (i: number) => setData('features', data.features.filter((_, idx) => idx !== i));

    const formatCurrency = (val: string) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits:0 }).format(Number(val));

    return (
        <AuthenticatedLayout header="Digital Products">
            <Head title="Source Codes - Super Admin" />

            <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] overflow-hidden">
                <div className="p-6 border-b border-[#E2DDD0] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#FAF8F3] border border-[#E2DDD0] flex items-center justify-center">
                            <Code className="w-5 h-5 text-[#B8935F]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-serif font-semibold text-[#1C2333]">Katalog Source Code</h2>
                            <p className="text-xs text-[#8B93A8]">Kelola produk digital & source code untuk dijual putus</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                        <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
                            <Search className="h-4 w-4 text-gray-400 absolute inset-y-0 my-auto left-3" />
                            <input type="text" placeholder="Cari nama produk..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 py-2 text-sm border-[#E2DDD0] focus:border-[#B8935F] rounded-md shadow-sm w-full sm:w-56" />
                        </form>
                        <button onClick={openCreateModal} className="bg-[#1C2333] hover:bg-[#2A344A] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Upload Produk
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-[#5B5648] uppercase bg-[#FAF8F3] border-b border-[#E2DDD0]">
                            <tr>
                                <th className="px-6 py-4 font-semibold w-16">Cover</th>
                                <th className="px-6 py-4 font-semibold">Nama Produk</th>
                                <th className="px-6 py-4 font-semibold">Harga</th>
                                <th className="px-6 py-4 font-semibold">Status File</th>
                                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sourceCodes.data.length > 0 ? sourceCodes.data.map((sc) => (
                                <tr key={sc.id} className="border-b border-[#E2DDD0] hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        {sc.thumbnail ? (
                                            <img src={sc.thumbnail} alt={sc.title} className="w-12 h-12 rounded object-cover border border-gray-200" />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                                <ImageIcon className="w-5 h-5 text-gray-400" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-[#1C2333]">{sc.title}</p>
                                        <p className="text-[10px] text-[#8B93A8]">Tech: {sc.tech_stack?.join(', ') || '-'}</p>
                                    </td>
                                    <td className="px-6 py-4 font-mono font-semibold text-green-700">
                                        {formatCurrency(sc.price)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {sc.file_path ? (
                                            <span className="flex items-center gap-1.5 text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded w-max">
                                                <FileArchive className="w-3.5 h-3.5" /> Uploaded
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded w-max">
                                                <ShieldAlert className="w-3.5 h-3.5" /> Belum Upload ZIP
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEditModal(sc)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"><Edit className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(sc.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Belum ada Source Code.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Tambah/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col my-auto">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">{editingId ? 'Edit Katalog Source Code' : 'Tambah Source Code Baru'}</h3>
                                <p className="text-xs text-slate-500">Isi spesifikasi dan unggah file ZIP (Maks 100MB)</p>
                            </div>
                            <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar bg-slate-50/30">
                            <form id="scForm" onSubmit={handleSubmit} className="space-y-6">
                                {Object.keys(errors).length > 0 && (
                                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200">
                                        Periksa kembali form Anda, ada isian yang belum sesuai.
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Kolom Kiri */}
                                    <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200">
                                        <h4 className="font-bold text-sm border-b pb-2">Informasi Produk</h4>
                                        <div>
                                            <label className="block text-xs font-semibold mb-1">Nama Produk</label>
                                            <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className="w-full text-sm rounded-lg border-slate-300" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold mb-1">Deskripsi Singkat</label>
                                            <textarea rows={3} value={data.description} onChange={e => setData('description', e.target.value)} className="w-full text-sm rounded-lg border-slate-300" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold mb-1">Harga Beli Putus (Rp)</label>
                                            <div className="relative">
                                                <Coins className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input type="number" value={data.price} onChange={e => setData('price', e.target.value)} className="w-full pl-9 text-sm rounded-lg border-slate-300 font-mono" required />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold mb-1">URL Demo Aplikasi (Opsional)</label>
                                            <div className="relative">
                                                <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input type="url" value={data.demo_url} onChange={e => setData('demo_url', e.target.value)} className="w-full pl-9 text-sm rounded-lg border-slate-300" placeholder="https://" />
                                            </div>
                                        </div>
                                        <label className="flex items-center gap-2 text-sm pt-2">
                                            <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="rounded text-blue-600" /> 
                                            Produk Aktif & Bisa Dibeli
                                        </label>
                                    </div>

                                    {/* Kolom Kanan */}
                                    <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200">
                                        <h4 className="font-bold text-sm border-b pb-2">Upload Files</h4>
                                        <div>
                                            <label className="block text-xs font-semibold mb-1">Thumbnail/Cover (Public)</label>
                                            <input type="file" accept="image/*" onChange={e => setData('thumbnail', e.target.files?.[0] || null)} className="w-full text-xs file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                            {errors.thumbnail && <span className="text-[10px] text-red-500">{errors.thumbnail}</span>}
                                        </div>
                                        <div className="pt-2">
                                            <label className="block text-xs font-semibold mb-1 text-red-600">File ZIP Source Code (Private)</label>
                                            <input type="file" accept=".zip,.rar,.gz" onChange={e => setData('file_archive', e.target.files?.[0] || null)} className="w-full text-xs file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
                                            <p className="text-[10px] text-gray-500 mt-1">Maks 100MB. Hanya file format archive (.zip, .rar).</p>
                                            {errors.file_archive && <span className="text-[10px] text-red-500">{errors.file_archive}</span>}
                                        </div>

                                        <div className="pt-4 border-t">
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="text-xs font-semibold">Tech Stack (Teknologi)</label>
                                                <button type="button" onClick={addTech} className="text-[10px] bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">+ Tambah</button>
                                            </div>
                                            {data.tech_stack.map((t, i) => (
                                                <div key={i} className="flex gap-2 mb-2">
                                                    <input type="text" value={t} onChange={e => updateTech(i, e.target.value)} className="w-full text-xs rounded border-gray-300 py-1" placeholder="Contoh: Laravel 13" />
                                                    <button type="button" onClick={() => removeTech(i)} className="text-red-500 hover:bg-red-50 px-2 rounded"><X className="w-3 h-3"/></button>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-4 border-t">
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="text-xs font-semibold">Fitur Utama</label>
                                                <button type="button" onClick={addFeature} className="text-[10px] bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">+ Tambah</button>
                                            </div>
                                            {data.features.map((f, i) => (
                                                <div key={i} className="flex gap-2 mb-2">
                                                    <input type="text" value={f} onChange={e => updateFeature(i, e.target.value)} className="w-full text-xs rounded border-gray-300 py-1" placeholder="Contoh: Multi-tenant ready" />
                                                    <button type="button" onClick={() => removeFeature(i)} className="text-red-500 hover:bg-red-50 px-2 rounded"><X className="w-3 h-3"/></button>
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                </div>
                            </form>
                        </div>
                        
                        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-white rounded-b-2xl">
                            <button onClick={closeModal} className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Batal</button>
                            <button form="scForm" type="submit" disabled={processing} className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 disabled:opacity-50">
                                {processing && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                                Simpan Produk & Upload File
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
