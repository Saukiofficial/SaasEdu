import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Puzzle, Plus, Edit, Trash2, X, CheckCircle2, 
    Database, Users, Banknote, Sparkles, HeadphonesIcon,
    AlertCircle
} from 'lucide-react';

interface Addon {
    id: string;
    name: string;
    description: string | null;
    price: number;
    billing_cycle: 'monthly' | 'yearly' | 'one-time';
    type: 'storage' | 'student' | 'feature' | 'service';
    value: number | null;
    is_active: boolean;
}

export default function AddonsIndex({ addons }: { addons: Addon[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const { data, setData, post, put, processing, errors, reset, transform } = useForm({
        name: '',
        description: '',
        price: '',
        billing_cycle: 'one-time',
        type: 'feature',
        value: '' as string | number,
        is_active: true,
    });

    const typeConfig = {
        storage: { label: 'Ekstra Storage', icon: Database, color: 'text-blue-600 bg-blue-50 border-blue-200' },
        student: { label: 'Ekstra Kuota Siswa', icon: Users, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
        feature: { label: 'Modul / Fitur Baru', icon: Sparkles, color: 'text-purple-600 bg-purple-50 border-purple-200' },
        service: { label: 'Layanan Tambahan', icon: HeadphonesIcon, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    };

    const cycleLabel = { monthly: '/ bulan', yearly: '/ tahun', 'one-time': ' Sekali Bayar' };

    const openCreateModal = () => {
        setEditingId(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (addon: Addon) => {
        setEditingId(addon.id);
        setData({
            name: addon.name || '',
            description: addon.description || '',
            price: addon.price !== undefined && addon.price !== null ? addon.price.toString() : '',
            billing_cycle: addon.billing_cycle || 'one-time',
            type: addon.type || 'feature',
            value: addon.value !== null ? addon.value : '',
            is_active: addon.is_active !== undefined ? addon.is_active : true,
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
        
        // Transform the form data before it gets sent to the server
        transform((currentData) => ({
            ...currentData,
            value: currentData.value === '' ? null : Number(currentData.value),
        }));

        if (editingId) {
            put(`/super-admin/addons/${editingId}`, { 
                onSuccess: () => closeModal() 
            });
        } else {
            post('/super-admin/addons', { 
                onSuccess: () => closeModal() 
            });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Yakin ingin menghapus addon ini?')) {
            router.delete(`/super-admin/addons/${id}`);
        }
    };

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    return (
        <AuthenticatedLayout header="Subscription & Billing">
            <Head title="Manajemen Addons - AkademiaOS" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-serif font-semibold text-[#0F1729] flex items-center gap-2">
                            <Puzzle className="w-6 h-6 text-[#B8935F]" />
                            Addons & Ekstra Kapasitas
                        </h1>
                        <p className="text-sm text-[#8B93A8] mt-1">
                            Buat penawaran kuota tambahan atau modul ekstra yang bisa dibeli Tenant di luar paket utamanya.
                        </p>
                    </div>
                    <button 
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-[#0F1729] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#1B2742] transition-colors shadow-sm ring-1 ring-[#0F1729]/10"
                    >
                        <Plus className="w-4 h-4 text-[#D4AF7A]" />
                        Buat Addon Baru
                    </button>
                </div>

                {/* Grid Addons (Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 pt-4">
                    {addons && addons.length > 0 ? (
                        addons.map((addon) => {
                            const TConfig = typeConfig[addon.type];
                            const Icon = TConfig.icon;

                            return (
                                <div key={addon.id} className="bg-white rounded-xl border border-[#E2DDD0] shadow-sm flex flex-col relative overflow-hidden group hover:border-[#B8935F] transition-all">
                                    
                                    {!addon.is_active && (
                                        <div className="absolute top-3 right-3 bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                            Nonaktif
                                        </div>
                                    )}

                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${TConfig.color}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-[#0F1729] pr-12">{addon.name}</h3>
                                                <span className="text-[10px] font-semibold text-[#8B93A8] uppercase tracking-wider">{TConfig.label}</span>
                                            </div>
                                        </div>
                                        
                                        <p className="text-sm text-[#8B93A8] mb-4 flex-1 line-clamp-2">{addon.description || 'Tidak ada deskripsi.'}</p>
                                        
                                        {addon.value && (
                                            <div className="bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg p-2.5 mb-4 flex items-center justify-between">
                                                <span className="text-xs text-[#8B93A8] font-medium">Penambahan:</span>
                                                <span className="text-sm font-bold text-[#0F1729]">
                                                    +{addon.type === 'storage' ? `${addon.value} MB` : `${addon.value} Kuota`}
                                                </span>
                                            </div>
                                        )}
                                        
                                        <div className="flex items-baseline text-[#0F1729] pt-2 border-t border-[#E2DDD0]">
                                            <span className="text-xl font-bold tracking-tight">{formatRupiah(addon.price)}</span>
                                            <span className="text-xs font-medium text-[#8B93A8] ml-1">{cycleLabel[addon.billing_cycle]}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Hover Actions */}
                                    <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditModal(addon)} className="p-1.5 bg-white border border-[#E2DDD0] rounded text-[#8B93A8] hover:text-[#0F1729] shadow-sm">
                                            <Edit className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => handleDelete(addon.id)} className="p-1.5 bg-white border border-[#E2DDD0] rounded text-[#8B93A8] hover:text-red-600 hover:border-red-200 hover:bg-red-50 shadow-sm">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-1 md:col-span-2 xl:col-span-4 bg-white p-12 rounded-xl border border-[#E2DDD0] shadow-sm text-center">
                            <Puzzle className="w-12 h-12 text-[#E2DDD0] mx-auto mb-4" />
                            <h3 className="text-[#0F1729] font-medium mb-1">Belum Ada Addons</h3>
                            <p className="text-[#8B93A8] text-sm">Gunakan tombol "Buat Addon Baru" untuk menambah opsi upselling fitur ke tenant.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODAL FORM ADDON --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-[#0F1729]/60 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative z-10 flex flex-col max-h-[90vh]">
                        
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2DDD0] bg-[#FAF8F3] rounded-t-2xl shrink-0">
                            <div>
                                <h2 className="text-lg font-serif font-semibold text-[#0F1729]">{editingId ? 'Edit Addon' : 'Buat Addon Baru'}</h2>
                                <p className="text-xs text-[#8B93A8] mt-0.5">Konfigurasi fitur ekstra atau kuota tambahan.</p>
                            </div>
                            <button onClick={closeModal} className="text-[#8B93A8] hover:text-[#0F1729] transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-sm font-medium text-[#0F1729]">Nama Addon <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                            placeholder="Contoh: Ekstra 5GB Storage, Modul API WhatsApp"
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
                                            placeholder="Penjelasan fitur atau kapasitas..."
                                        />
                                        {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[#0F1729]">Harga Addon (Rp) <span className="text-red-500">*</span></label>
                                        <input
                                            type="number"
                                            value={data.price}
                                            onChange={e => setData('price', e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                            placeholder="150000"
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
                                            <option value="one-time">Sekali Bayar (Satu Kali)</option>
                                            <option value="monthly">Bulanan Berulang</option>
                                            <option value="yearly">Tahunan Berulang</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5 md:col-span-2 pt-2">
                                        <label className="text-sm font-medium text-[#0F1729] block mb-2">Tipe Addon <span className="text-red-500">*</span></label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {[
                                                { id: 'storage', label: 'Storage', icon: Database },
                                                { id: 'student', label: 'Kuota Siswa', icon: Users },
                                                { id: 'feature', label: 'Modul Fitur', icon: Sparkles },
                                                { id: 'service', label: 'Layanan', icon: HeadphonesIcon },
                                            ].map((t) => (
                                                <div 
                                                    key={t.id}
                                                    onClick={() => setData('type', t.id as any)}
                                                    className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${
                                                        data.type === t.id 
                                                        ? `border-[#B8935F] bg-[#FAF8F3] ring-1 ring-[#B8935F]` 
                                                        : 'border-[#E2DDD0] bg-white hover:bg-[#FAF8F3]'
                                                    }`}
                                                >
                                                    <t.icon className={`w-5 h-5 ${data.type === t.id ? 'text-[#B8935F]' : 'text-[#8B93A8]'}`} />
                                                    <span className={`text-[11px] font-semibold ${data.type === t.id ? 'text-[#0F1729]' : 'text-[#8B93A8]'}`}>
                                                        {t.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Conditional Value Input for Storage and Student */}
                                    {(data.type === 'storage' || data.type === 'student') && (
                                        <div className="space-y-1.5 md:col-span-2 bg-blue-50/50 p-4 border border-blue-100 rounded-lg">
                                            <label className="text-sm font-medium text-blue-900 flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4 text-blue-600" />
                                                Nilai Penambahan (Value) <span className="text-red-500">*</span>
                                            </label>
                                            <p className="text-xs text-blue-700 mb-2">
                                                Tentukan seberapa banyak penambahan yang didapatkan tenant ketika membeli addon ini.
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className="bg-white border border-[#E2DDD0] px-3 py-2 rounded-md text-sm font-bold text-[#0F1729]">
                                                    + 
                                                </span>
                                                <input
                                                    type="number"
                                                    value={data.value}
                                                    onChange={e => setData('value', e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                                    placeholder={data.type === 'storage' ? 'Contoh: 5120 (dalam MB untuk 5GB)' : 'Contoh: 100 (kuota siswa)'}
                                                />
                                                <span className="bg-[#FAF8F3] border border-[#E2DDD0] px-3 py-2 rounded-md text-sm font-bold text-[#8B93A8]">
                                                    {data.type === 'storage' ? 'MB' : 'Siswa'}
                                                </span>
                                            </div>
                                            {errors.value && <p className="text-xs text-red-500 mt-1">{errors.value}</p>}
                                        </div>
                                    )}

                                    <div className="md:col-span-2 pt-2">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={data.is_active}
                                                onChange={e => setData('is_active', e.target.checked)}
                                                className="w-4 h-4 text-emerald-600 rounded border-[#E2DDD0] focus:ring-emerald-600"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-[#0F1729]">Status Aktif</span>
                                                <span className="text-[10px] text-[#8B93A8]">Hapus centang untuk menyembunyikan addon ini dari pilihan tenant.</span>
                                            </div>
                                        </label>
                                    </div>

                                </div>

                                <div className="pt-6 flex items-center justify-end gap-3 border-t border-[#E2DDD0]">
                                    <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-[#8B93A8] hover:text-[#0F1729] transition-colors">Batal</button>
                                    <button type="submit" disabled={processing} className="px-4 py-2 bg-[#0F1729] text-white rounded-md text-sm font-medium hover:bg-[#1B2742] transition-colors shadow-sm disabled:opacity-70">
                                        {processing ? 'Menyimpan...' : 'Simpan Addon'}
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
