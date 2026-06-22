import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Settings as SettingsIcon, Globe, Palette, Mail, ShieldAlert,
    Save, Monitor, Smartphone, Building
} from 'lucide-react';

export default function SettingsIndex({ settings }: { settings: any }) {
    const [activeTab, setActiveTab] = useState('general');

    // Menggunakan Inertia useForm dan mengisinya dengan prop settings dari Controller
    const { data, setData, post, processing, errors } = useForm({
        app_name: settings.app_name,
        app_description: settings.app_description,
        maintenance_mode: settings.maintenance_mode,
        contact_email: settings.contact_email,
        contact_phone: settings.contact_phone,
        contact_address: settings.contact_address,
        brand_primary_color: settings.brand_primary_color,
        brand_secondary_color: settings.brand_secondary_color,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Menggunakan POST karena Route kita menggunakan POST untuk update setting
        post('/super-admin/settings');
    };

    return (
        <AuthenticatedLayout header="System Settings">
            <Head title="Pengaturan Sistem - AkademiaOS" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-serif font-semibold text-[#0F1729] flex items-center gap-2">
                            <SettingsIcon className="w-6 h-6 text-[#B8935F]" />
                            Pengaturan Sistem Global
                        </h1>
                        <p className="text-sm text-[#8B93A8] mt-1">
                            Konfigurasi aplikasi, branding, dan kontak yang akan diterapkan ke seluruh platform.
                        </p>
                    </div>
                    <button 
                        onClick={submit}
                        disabled={processing}
                        className="flex items-center gap-2 bg-[#0F1729] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#1B2742] transition-colors shadow-sm disabled:opacity-70"
                    >
                        <Save className="w-4 h-4 text-[#D4AF7A]" />
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-64 shrink-0 space-y-1">
                        <button 
                            onClick={() => setActiveTab('general')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'general' ? 'bg-white text-[#0F1729] shadow-sm border border-[#E2DDD0]' : 'text-[#8B93A8] hover:bg-white/50 hover:text-[#0F1729]'}`}
                        >
                            <Globe className={`w-4 h-4 ${activeTab === 'general' ? 'text-[#B8935F]' : ''}`} /> Umum & Konfigurasi
                        </button>
                        <button 
                            onClick={() => setActiveTab('branding')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'branding' ? 'bg-white text-[#0F1729] shadow-sm border border-[#E2DDD0]' : 'text-[#8B93A8] hover:bg-white/50 hover:text-[#0F1729]'}`}
                        >
                            <Palette className={`w-4 h-4 ${activeTab === 'branding' ? 'text-[#B8935F]' : ''}`} /> Branding & Visual
                        </button>
                        <button 
                            onClick={() => setActiveTab('contact')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'contact' ? 'bg-white text-[#0F1729] shadow-sm border border-[#E2DDD0]' : 'text-[#8B93A8] hover:bg-white/50 hover:text-[#0F1729]'}`}
                        >
                            <Mail className={`w-4 h-4 ${activeTab === 'contact' ? 'text-[#B8935F]' : ''}`} /> Kontak & Dukungan
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 bg-white rounded-2xl border border-[#E2DDD0] shadow-sm overflow-hidden">
                        
                        {/* TAB 1: PENGATURAN UMUM */}
                        {activeTab === 'general' && (
                            <div className="p-6 sm:p-8 animate-in fade-in duration-300">
                                <h3 className="text-lg font-bold text-[#0F1729] mb-6">Pengaturan Umum Platform</h3>
                                
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-[#0F1729]">Nama Aplikasi (Brand Name)</label>
                                            <input
                                                type="text"
                                                value={data.app_name}
                                                onChange={e => setData('app_name', e.target.value)}
                                                className="w-full px-3 py-2.5 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                            />
                                            {errors.app_name && <p className="text-xs text-red-500">{errors.app_name}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[#0F1729]">Deskripsi Aplikasi</label>
                                        <textarea
                                            value={data.app_description}
                                            onChange={e => setData('app_description', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2.5 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors resize-none"
                                        ></textarea>
                                        <p className="text-[10px] text-[#8B93A8]">Deskripsi ini akan digunakan pada tag meta SEO (Search Engine Optimization).</p>
                                    </div>

                                    <div className="pt-6 border-t border-[#E2DDD0]">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                                                <ShieldAlert className="w-5 h-5 text-red-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold text-[#0F1729] mb-1">Mode Maintenance (Pemeliharaan Sistem)</h4>
                                                <p className="text-xs text-[#8B93A8] leading-relaxed mb-4">
                                                    Mengaktifkan mode ini akan memblokir semua akses Tenant (Sekolah) dan menampilkan halaman perbaikan. Hanya Super Admin yang tetap bisa mengakses sistem.
                                                </p>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only peer"
                                                        checked={data.maintenance_mode === '1'}
                                                        onChange={(e) => setData('maintenance_mode', e.target.checked ? '1' : '0')}
                                                    />
                                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                                    <span className="ml-3 text-sm font-medium text-[#0F1729]">Aktifkan Mode Maintenance</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: BRANDING */}
                        {activeTab === 'branding' && (
                            <div className="p-6 sm:p-8 animate-in fade-in duration-300">
                                <h3 className="text-lg font-bold text-[#0F1729] mb-6">Warna & Identitas Visual</h3>
                                
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Primary Color Picker */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-[#0F1729]">Warna Utama (Primary Color)</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={data.brand_primary_color}
                                                    onChange={e => setData('brand_primary_color', e.target.value)}
                                                    className="w-12 h-12 p-1 bg-white border border-[#E2DDD0] rounded cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={data.brand_primary_color}
                                                    onChange={e => setData('brand_primary_color', e.target.value)}
                                                    className="flex-1 px-3 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm font-mono focus:border-[#B8935F] outline-none uppercase"
                                                />
                                            </div>
                                            <p className="text-[10px] text-[#8B93A8]">Warna dasar untuk Sidebar, Header, dan elemen solid.</p>
                                        </div>

                                        {/* Secondary Color Picker */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-[#0F1729]">Warna Aksen (Secondary Color)</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={data.brand_secondary_color}
                                                    onChange={e => setData('brand_secondary_color', e.target.value)}
                                                    className="w-12 h-12 p-1 bg-white border border-[#E2DDD0] rounded cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={data.brand_secondary_color}
                                                    onChange={e => setData('brand_secondary_color', e.target.value)}
                                                    className="flex-1 px-3 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm font-mono focus:border-[#B8935F] outline-none uppercase"
                                                />
                                            </div>
                                            <p className="text-[10px] text-[#8B93A8]">Warna untuk tombol hover, icon aktif, dan elemen interaktif.</p>
                                        </div>
                                    </div>

                                    {/* Logo Placeholder */}
                                    <div className="pt-6 border-t border-[#E2DDD0]">
                                        <label className="text-sm font-medium text-[#0F1729] block mb-3">Logo Platform</label>
                                        <div className="border-2 border-dashed border-[#E2DDD0] bg-[#FAF8F3] rounded-xl p-8 text-center hover:bg-white hover:border-[#B8935F] transition-all cursor-pointer">
                                            <Monitor className="w-10 h-10 text-[#A8A296] mx-auto mb-3" />
                                            <p className="text-sm font-semibold text-[#0F1729]">Klik untuk mengunggah logo baru</p>
                                            <p className="text-xs text-[#8B93A8] mt-1">PNG atau SVG, rasio 1:1, maksimal 2MB.</p>
                                        </div>
                                        <p className="text-[10px] text-[#8B93A8] mt-2 italic">*Fitur unggah gambar ini disimulasikan untuk saat ini.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: CONTACT */}
                        {activeTab === 'contact' && (
                            <div className="p-6 sm:p-8 animate-in fade-in duration-300">
                                <h3 className="text-lg font-bold text-[#0F1729] mb-6">Informasi Kontak Dukungan</h3>
                                
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-[#0F1729]">Email Support</label>
                                            <input
                                                type="email"
                                                value={data.contact_email}
                                                onChange={e => setData('contact_email', e.target.value)}
                                                className="w-full px-3 py-2.5 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-[#0F1729]">Nomor Telepon (WhatsApp)</label>
                                            <input
                                                type="text"
                                                value={data.contact_phone}
                                                onChange={e => setData('contact_phone', e.target.value)}
                                                className="w-full px-3 py-2.5 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[#0F1729]">Alamat Kantor Utama</label>
                                        <textarea
                                            value={data.contact_address}
                                            onChange={e => setData('contact_address', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2.5 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none resize-none"
                                        ></textarea>
                                        <p className="text-[10px] text-[#8B93A8]">Alamat ini akan ditampilkan di halaman depan (Landing Page) dan email Invoice.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}