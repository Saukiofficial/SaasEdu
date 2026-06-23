import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Palette, Image as ImageIcon, Layout, PaintBucket, Save } from 'lucide-react';

interface Branding {
    id: string;
    app_name: string;
    primary_color: string;
    logo_url: string | null;
    favicon_url: string | null;
    login_bg_url: string | null;
}

interface Props {
    branding: Branding;
}

export default function BrandingIndex({ branding }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'post', // Menggunakan post untuk form multi-part/upload file
        app_name: branding.app_name || '',
        primary_color: branding.primary_color || '#B8935F',
        logo: null as File | null,
        favicon: null as File | null,
        login_bg: null as File | null,
    });

    const [previewImages, setPreviewImages] = useState({
        logo: branding.logo_url || null,
        favicon: branding.favicon_url || null,
        login_bg: branding.login_bg_url || null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'favicon' | 'login_bg') => {
        const file = e.target.files?.[0];
        if (file) {
            setData(field, file);
            // Setup local preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImages(prev => ({ ...prev, [field]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/super-admin/branding', {
            preserveScroll: true,
            onSuccess: () => {
                alert('Pengaturan Branding berhasil disimpan!');
            }
        });
    };

    return (
        <AuthenticatedLayout header="System Settings">
            <Head title="Branding Settings - Super Admin" />

            <div className="max-w-4xl">
                <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] overflow-hidden">
                    <div className="p-6 border-b border-[#E2DDD0] flex items-center gap-3 bg-[#FAF8F3]">
                        <div className="w-10 h-10 rounded-lg bg-white border border-[#E2DDD0] flex items-center justify-center">
                            <Palette className="w-5 h-5 text-[#B8935F]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-serif font-semibold text-[#1C2333]">Branding & Tampilan Global</h2>
                            <p className="text-xs text-[#8B93A8]">Sesuaikan identitas visual AkademiaOS</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-8">
                        {/* Identitas Dasar Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-[#1C2333] border-b border-[#E2DDD0] pb-2 flex items-center gap-2">
                                <Layout className="w-4 h-4 text-[#8B93A8]" /> Identitas Dasar
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-[#1C2333] mb-1">Nama Aplikasi</label>
                                    <input
                                        type="text"
                                        value={data.app_name}
                                        onChange={(e) => setData('app_name', e.target.value)}
                                        className="w-full rounded-md border-[#E2DDD0] shadow-sm focus:border-[#B8935F] focus:ring-[#B8935F] text-sm"
                                        required
                                    />
                                    {errors.app_name && <span className="text-xs text-red-500 mt-1">{errors.app_name}</span>}
                                    <p className="text-[11px] text-[#8B93A8] mt-1">Akan ditampilkan pada Tab Browser dan Footer.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#1C2333] mb-1">Warna Utama (Primary Color)</label>
                                    <div className="flex gap-3">
                                        <input
                                            type="color"
                                            value={data.primary_color}
                                            onChange={(e) => setData('primary_color', e.target.value)}
                                            className="h-10 w-14 rounded-md border border-[#E2DDD0] cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={data.primary_color}
                                            onChange={(e) => setData('primary_color', e.target.value)}
                                            className="flex-1 rounded-md border-[#E2DDD0] shadow-sm focus:border-[#B8935F] focus:ring-[#B8935F] text-sm font-mono uppercase"
                                            pattern="^#[0-9A-Fa-f]{6}$"
                                        />
                                    </div>
                                    {errors.primary_color && <span className="text-xs text-red-500 mt-1">{errors.primary_color}</span>}
                                    <p className="text-[11px] text-[#8B93A8] mt-1">Digunakan untuk tombol utama dan aksen desain.</p>
                                </div>
                            </div>
                        </div>

                        {/* Aset Gambar Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-[#1C2333] border-b border-[#E2DDD0] pb-2 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-[#8B93A8]" /> Aset Gambar
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Upload Logo */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#1C2333]">Logo Utama</label>
                                    <div className="flex items-start gap-4">
                                        <div className="w-20 h-20 rounded-lg bg-gray-50 border border-[#E2DDD0] flex items-center justify-center overflow-hidden shrink-0">
                                            {previewImages.logo ? (
                                                <img src={previewImages.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                                            ) : (
                                                <ImageIcon className="w-6 h-6 text-gray-300" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/png, image/jpeg, image/svg+xml, image/webp"
                                                onChange={(e) => handleFileChange(e, 'logo')}
                                                className="w-full text-xs text-[#5B5648] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#FAF8F3] file:text-[#1C2333] hover:file:bg-[#E2DDD0] cursor-pointer"
                                            />
                                            {errors.logo && <span className="text-xs text-red-500 mt-1 block">{errors.logo}</span>}
                                            <p className="text-[10px] text-[#8B93A8] mt-1.5 leading-relaxed">Format: PNG, JPG, SVG, WEBP. Maks 2MB. Disarankan ukuran proporsional (landscape).</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Upload Favicon */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#1C2333]">Favicon (Ikon Tab)</label>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-gray-50 border border-[#E2DDD0] flex items-center justify-center overflow-hidden shrink-0">
                                            {previewImages.favicon ? (
                                                <img src={previewImages.favicon} alt="Favicon" className="w-full h-full object-cover p-1" />
                                            ) : (
                                                <ImageIcon className="w-4 h-4 text-gray-300" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/png, image/jpeg, image/x-icon"
                                                onChange={(e) => handleFileChange(e, 'favicon')}
                                                className="w-full text-xs text-[#5B5648] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#FAF8F3] file:text-[#1C2333] hover:file:bg-[#E2DDD0] cursor-pointer"
                                            />
                                            {errors.favicon && <span className="text-xs text-red-500 mt-1 block">{errors.favicon}</span>}
                                            <p className="text-[10px] text-[#8B93A8] mt-1.5 leading-relaxed">Format: ICO, PNG. Maks 1MB. Ukuran presisi 32x32 px.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Upload Background Login */}
                                <div className="space-y-2 md:col-span-2 pt-4">
                                    <label className="block text-sm font-medium text-[#1C2333]">Gambar Latar Belakang Login</label>
                                    <div className="flex flex-col sm:flex-row items-start gap-4">
                                        <div className="w-full sm:w-48 h-28 rounded-lg bg-gray-50 border border-[#E2DDD0] flex items-center justify-center overflow-hidden shrink-0">
                                            {previewImages.login_bg ? (
                                                <img src={previewImages.login_bg} alt="Login Background" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="w-8 h-8 text-gray-300" />
                                            )}
                                        </div>
                                        <div className="flex-1 w-full">
                                            <input
                                                type="file"
                                                accept="image/png, image/jpeg, image/webp"
                                                onChange={(e) => handleFileChange(e, 'login_bg')}
                                                className="w-full text-xs text-[#5B5648] file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#FAF8F3] file:text-[#1C2333] hover:file:bg-[#E2DDD0] cursor-pointer"
                                            />
                                            {errors.login_bg && <span className="text-xs text-red-500 mt-1 block">{errors.login_bg}</span>}
                                            <p className="text-[10px] text-[#8B93A8] mt-2 leading-relaxed max-w-sm">Gambar yang akan ditampilkan pada sisi halaman login (Khusus pengguna desktop). Format: JPG, PNG, WEBP. Maks 4MB. Disarankan ukuran 1920x1080px.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-[#E2DDD0] flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-[#1C2333] hover:bg-[#2A344A] text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}