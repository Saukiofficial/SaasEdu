import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Package, Plus, Edit, Trash2, X, CheckCircle2, 
    Star, Users, Database, Banknote, ShieldCheck 
} from 'lucide-react';

interface SubPackage {
    id: string;
    name: string;
    description: string | null;
    price: number;
    billing_cycle: 'monthly' | 'yearly' | 'one-time';
    max_students: number;
    storage_limit_mb: number;
    features: string[];
    is_active: boolean;
    is_popular: boolean;
}

// Konstanta daftar fitur lengkap berdasarkan modul AkademiaOS
const AVAILABLE_FEATURES = [
    "Dashboard Utama",
    "PPDB (Pendaftar, Verifikasi, Pengumuman)",
    "Master Data (Profil, Jurusan, Kelas, Mapel)",
    "Siswa (Data, Orang Tua, Mutasi, Alumni)",
    "Guru & Pegawai (Data, Absensi)",
    "Akademik (Jadwal, Ujian, Nilai, Rapor)",
    "E-Learning (LMS) Terintegrasi",
    "Kesiswaan (BK, Prestasi, Pelanggaran, Ekskul)",
    "Keuangan (SPP, Tagihan, Pembayaran, Laporan)",
    "Perpustakaan (Katalog & Peminjaman)",
    "Sarpras (Inventaris & Peminjaman)",
    "Komunikasi (Pesan & Pengumuman)",
    "Laporan Lengkap & Rekapitulasi",
    "Pengaturan Tingkat Lanjut"
];

export default function PackagesIndex({ packages }: { packages: SubPackage[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        description: '',
        price: '',
        billing_cycle: 'monthly',
        max_students: 500,
        storage_limit_mb: 1024,
        features: [] as string[], // Sekarang berbentuk array untuk checkbox
        is_active: true,
        is_popular: false,
    });

    const openCreateModal = () => {
        setEditingId(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (pkg: SubPackage) => {
        setEditingId(pkg.id);
        setData({
            name: pkg.name,
            description: pkg.description || '',
            price: pkg.price.toString(),
            billing_cycle: pkg.billing_cycle,
            max_students: pkg.max_students,
            storage_limit_mb: pkg.storage_limit_mb,
            features: pkg.features || [], // Load existing array
            is_active: pkg.is_active,
            is_popular: pkg.is_popular,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        reset();
    };

    // Fungsi Toggle Feature
    const handleFeatureToggle = (featureName: string) => {
        const currentFeatures = [...data.features];
        if (currentFeatures.includes(featureName)) {
            setData('features', currentFeatures.filter(f => f !== featureName));
        } else {
            setData('features', [...currentFeatures, featureName]);
        }
    };

    // Fungsi Pilih Semua / Hapus Semua Feature
    const handleSelectAllFeatures = () => {
        if (data.features.length === AVAILABLE_FEATURES.length) {
            setData('features', []); // Deselect all
        } else {
            setData('features', [...AVAILABLE_FEATURES]); // Select all
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(`/super-admin/packages/${editingId}`, { onSuccess: () => closeModal() });
        } else {
            post('/super-admin/packages', { onSuccess: () => closeModal() });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Yakin ingin menghapus paket langganan ini? (Hanya hapus jika tidak ada tenant yang sedang menggunakannya)')) {
            router.delete(`/super-admin/packages/${id}`);
        }
    };

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    const cycleLabel = { monthly: '/ bulan', yearly: '/ tahun', 'one-time': ' Sekali Bayar' };

    return (
        <AuthenticatedLayout header="Subscription & Billing">
            <Head title="Manajemen Paket SaaS - AkademiaOS" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-serif font-semibold text-[#0F1729] flex items-center gap-2">
                            <Package className="w-6 h-6 text-[#B8935F]" />
                            Paket Langganan (Pricing Plans)
                        </h1>
                        <p className="text-sm text-[#8B93A8] mt-1">
                            Buat dan kelola paket harga, limit fitur, dan kapasitas untuk ditawarkan ke klien (Tenant).
                        </p>
                    </div>
                    <button 
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-[#0F1729] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#1B2742] transition-colors shadow-sm ring-1 ring-[#0F1729]/10"
                    >
                        <Plus className="w-4 h-4 text-[#D4AF7A]" />
                        Buat Paket Baru
                    </button>
                </div>

                {/* Grid Harga (Pricing Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                    {packages && packages.length > 0 ? (
                        packages.map((pkg) => (
                            <div key={pkg.id} className={`bg-white rounded-2xl flex flex-col relative overflow-hidden transition-all shadow-sm ${pkg.is_popular ? 'border-2 border-[#B8935F] shadow-md transform -translate-y-1' : 'border border-[#E2DDD0]'}`}>
                                
                                {pkg.is_popular && (
                                    <div className="absolute top-0 inset-x-0 h-8 bg-[#B8935F] flex items-center justify-center gap-1.5">
                                        <Star className="w-3.5 h-3.5 text-white fill-white" />
                                        <span className="text-xs font-bold text-white uppercase tracking-widest">Paling Populer</span>
                                    </div>
                                )}
                                {!pkg.is_active && (
                                    <div className="absolute top-4 right-4 bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                        Tidak Aktif
                                    </div>
                                )}

                                <div className={`p-6 sm:p-8 flex-1 flex flex-col ${pkg.is_popular ? 'pt-12' : ''}`}>
                                    <h3 className="text-xl font-bold text-[#0F1729] mb-2">{pkg.name}</h3>
                                    <p className="text-sm text-[#8B93A8] min-h-[40px] leading-relaxed mb-4">{pkg.description}</p>
                                    
                                    <div className="mb-6 flex items-baseline text-[#0F1729]">
                                        <span className="text-3xl font-bold tracking-tight">{formatRupiah(pkg.price)}</span>
                                        <span className="text-sm font-medium text-[#8B93A8] ml-1">{cycleLabel[pkg.billing_cycle]}</span>
                                    </div>

                                    {/* Limits Info */}
                                    <div className="grid grid-cols-2 gap-3 mb-6 p-3 bg-[#FAF8F3] rounded-xl border border-[#E2DDD0]">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-[#8B93A8] uppercase flex items-center gap-1"><Users className="w-3 h-3" /> Max Siswa</span>
                                            <span className="text-sm font-semibold text-[#0F1729]">{pkg.max_students}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-[#8B93A8] uppercase flex items-center gap-1"><Database className="w-3 h-3" /> Storage</span>
                                            <span className="text-sm font-semibold text-[#0F1729]">{pkg.storage_limit_mb >= 1024 ? `${(pkg.storage_limit_mb/1024).toFixed(1)} GB` : `${pkg.storage_limit_mb} MB`}</span>
                                        </div>
                                    </div>

                                    {/* Features List */}
                                    <ul className="space-y-3 flex-1 mb-8">
                                        {pkg.features?.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-[#1C2333]">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                                <span className="leading-tight">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="flex items-center gap-2 pt-5 border-t border-[#E2DDD0]">
                                        <button 
                                            onClick={() => openEditModal(pkg)}
                                            className="flex-1 px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] text-[#0F1729] text-sm font-bold rounded-lg hover:border-[#B8935F] hover:text-[#B8935F] transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Edit className="w-4 h-4" /> Edit Paket
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(pkg.id)}
                                            className="p-2 border border-transparent text-[#8B93A8] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Hapus"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-12 rounded-xl border border-[#E2DDD0] shadow-sm text-center">
                            <Banknote className="w-12 h-12 text-[#E2DDD0] mx-auto mb-4" />
                            <h3 className="text-[#0F1729] font-medium mb-1">Belum Ada Paket Langganan</h3>
                            <p className="text-[#8B93A8] text-sm">Gunakan tombol "Buat Paket Baru" untuk menawarkan layanan SaaS Anda.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODAL FORM --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-[#0F1729]/60 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl relative z-10 flex flex-col max-h-[90vh]">
                        
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2DDD0] bg-[#FAF8F3] rounded-t-2xl shrink-0">
                            <div>
                                <h2 className="text-lg font-serif font-semibold text-[#0F1729]">{editingId ? 'Edit Paket Langganan' : 'Buat Paket Langganan'}</h2>
                                <p className="text-xs text-[#8B93A8] mt-0.5">Konfigurasikan limit dan harga yang akan ditagihkan ke tenant.</p>
                            </div>
                            <button onClick={closeModal} className="text-[#8B93A8] hover:text-[#0F1729] transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-sm font-medium text-[#0F1729]">Nama Paket <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                            placeholder="Contoh: Basic Plan, Enterprise"
                                        />
                                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-sm font-medium text-[#0F1729]">Deskripsi Singkat</label>
                                        <input
                                            type="text"
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                            placeholder="Cocok untuk sekolah kecil di bawah 500 siswa..."
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[#0F1729]">Harga Paket (Rp) <span className="text-red-500">*</span></label>
                                        <input
                                            type="number"
                                            value={data.price}
                                            onChange={e => setData('price', e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                            placeholder="500000"
                                        />
                                        {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[#0F1729]">Siklus Tagihan <span className="text-red-500">*</span></label>
                                        <select
                                            value={data.billing_cycle}
                                            onChange={e => setData('billing_cycle', e.target.value as any)}
                                            className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                        >
                                            <option value="monthly">Bulanan</option>
                                            <option value="yearly">Tahunan</option>
                                            <option value="one-time">Sekali Bayar (Lifetime)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[#0F1729]">Batas Maksimal Siswa <span className="text-red-500">*</span></label>
                                        <input
                                            type="number"
                                            value={data.max_students}
                                            onChange={e => setData('max_students', Number(e.target.value))}
                                            className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[#0F1729]">Batas Penyimpanan (MB) <span className="text-red-500">*</span></label>
                                        <input
                                            type="number"
                                            value={data.storage_limit_mb}
                                            onChange={e => setData('storage_limit_mb', Number(e.target.value))}
                                            className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                        />
                                        <p className="text-[10px] text-[#8B93A8]">Isi 1024 untuk 1GB</p>
                                    </div>
                                </div>

                                {/* CHECKBOX FITUR OTOMATIS */}
                                <div className="pt-4 border-t border-[#E2DDD0]">
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="text-sm font-bold text-[#0F1729] flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-[#B8935F]" /> Pilihan Fitur Modul (Otomatis)
                                        </label>
                                        <button 
                                            type="button" 
                                            onClick={handleSelectAllFeatures}
                                            className="text-xs font-semibold text-[#B8935F] hover:underline"
                                        >
                                            {data.features.length === AVAILABLE_FEATURES.length ? 'Hapus Semua' : 'Pilih Semua'}
                                        </button>
                                    </div>
                                    
                                    <div className="bg-[#FAF8F3] border border-[#E2DDD0] rounded-xl p-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {AVAILABLE_FEATURES.map((featureName, idx) => (
                                                <label key={idx} className="flex items-start gap-3 cursor-pointer group p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-[#E2DDD0]">
                                                    <div className="flex items-center h-5">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={data.features.includes(featureName)}
                                                            onChange={() => handleFeatureToggle(featureName)}
                                                            className="w-4 h-4 text-[#B8935F] rounded border-[#E2DDD0] focus:ring-[#B8935F]"
                                                        />
                                                    </div>
                                                    <span className={`text-sm font-medium transition-colors ${data.features.includes(featureName) ? 'text-[#0F1729]' : 'text-[#8B93A8] group-hover:text-[#0F1729]'}`}>
                                                        {featureName}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    {errors.features && <p className="text-xs text-red-500 mt-2">{errors.features}</p>}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-6 p-4 bg-[#FAF8F3] border border-[#E2DDD0] rounded-xl">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={data.is_popular}
                                            onChange={e => setData('is_popular', e.target.checked)}
                                            className="w-4 h-4 text-[#B8935F] rounded border-[#E2DDD0] focus:ring-[#B8935F]"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-[#0F1729]">Tandai "Paling Populer"</span>
                                            <span className="text-[10px] text-[#8B93A8]">Highlight paket ini di halaman utama.</span>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={data.is_active}
                                            onChange={e => setData('is_active', e.target.checked)}
                                            className="w-4 h-4 text-emerald-600 rounded border-[#E2DDD0] focus:ring-emerald-600"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-[#0F1729]">Status Aktif</span>
                                            <span className="text-[10px] text-[#8B93A8]">Hapus centang untuk menyembunyikan paket.</span>
                                        </div>
                                    </label>
                                </div>

                                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E2DDD0]">
                                    <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-[#8B93A8] hover:text-[#0F1729] transition-colors">Batal</button>
                                    <button type="submit" disabled={processing} className="px-4 py-2 bg-[#0F1729] text-white rounded-md text-sm font-medium hover:bg-[#1B2742] transition-colors shadow-sm disabled:opacity-70">
                                        {processing ? 'Menyimpan...' : 'Simpan Paket Harga'}
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