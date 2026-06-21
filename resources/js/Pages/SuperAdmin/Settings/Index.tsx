import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Settings, Shield, Link as LinkIcon, Server, Save, CreditCard } from 'lucide-react';

export default function SettingIndex({ settings, flash }: any) {
    const [activeTab, setActiveTab] = useState('general');

    const { data, setData, post, processing } = useForm({
        app_name: settings.app_name || '',
        support_email: settings.support_email || '',
        company_address: settings.company_address || '',
        currency: settings.currency || 'IDR',
        midtrans_client_key: settings.midtrans_client_key || '',
        maintenance_mode: settings.maintenance_mode || false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/super-admin/settings', { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout header="Pengaturan Sistem">
            <Head title="SaaS - Pengaturan Sistem" />

            <div className="flex flex-col lg:flex-row gap-6">
                
                {/* --- SIDEBAR TABS --- */}
                <div className="w-full lg:w-64 shrink-0 space-y-1">
                    <button 
                        onClick={() => setActiveTab('general')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'general' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800'}`}
                    >
                        <Settings className="w-5 h-5" /> Pengaturan Umum
                    </button>
                    <button 
                        onClick={() => setActiveTab('integration')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'integration' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800'}`}
                    >
                        <LinkIcon className="w-5 h-5" /> Integrasi Pihak ke-3
                    </button>
                    <button 
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'security' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800'}`}
                    >
                        <Shield className="w-5 h-5" /> Keamanan & Server
                    </button>
                </div>

                {/* --- MAIN CONTENT AREA --- */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200/60 dark:bg-slate-950 dark:border-slate-800 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                            {activeTab === 'general' && 'Konfigurasi Utama SaaS'}
                            {activeTab === 'integration' && 'API & Integrasi Eksternal'}
                            {activeTab === 'security' && 'Akses, Keamanan & Pemeliharaan'}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">Perubahan pada pengaturan ini akan berdampak pada seluruh tenant Anda.</p>
                    </div>

                    <div className="p-6">
                        {flash?.message && (
                            <div className="mb-6 p-4 text-sm font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 shadow-sm">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">✓</span>
                                {flash.message}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            
                            {/* TAB: GENERAL */}
                            {activeTab === 'general' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="space-y-2 max-w-xl">
                                        <Label className="text-slate-700 font-semibold">Nama Aplikasi (Platform Name)</Label>
                                        <Input value={data.app_name} onChange={e => setData('app_name', e.target.value)} className="bg-slate-50 border-slate-200 focus:bg-white" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                                        <div className="space-y-2">
                                            <Label className="text-slate-700 font-semibold">Email Bantuan (Support Email)</Label>
                                            <Input type="email" value={data.support_email} onChange={e => setData('support_email', e.target.value)} className="bg-slate-50 border-slate-200 focus:bg-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-700 font-semibold">Mata Uang Default</Label>
                                            <select value={data.currency} onChange={e => setData('currency', e.target.value)} className="flex h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                                                <option value="IDR">IDR - Rupiah Indonesia</option>
                                                <option value="USD">USD - US Dollar</option>
                                                <option value="MYR">MYR - Malaysian Ringgit</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2 max-w-2xl">
                                        <Label className="text-slate-700 font-semibold">Alamat Perusahaan (Company Address)</Label>
                                        <textarea 
                                            rows={3}
                                            value={data.company_address} 
                                            onChange={e => setData('company_address', e.target.value)}
                                            className="flex w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* TAB: INTEGRATION */}
                            {activeTab === 'integration' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800">
                                        Konfigurasikan kunci API pihak ketiga untuk mengaktifkan fitur pembayaran otomatis, notifikasi SMS/WhatsApp, atau layanan email massal.
                                    </div>
                                    <div className="space-y-4 max-w-2xl border p-5 rounded-xl border-slate-200">
                                        <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-3">
                                            <div className="w-8 h-8 bg-indigo-100 rounded flex items-center justify-center text-indigo-600"><CreditCard className="w-4 h-4"/></div>
                                            <h3 className="font-bold text-slate-800">Midtrans Payment Gateway</h3>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-700 font-semibold">Client Key</Label>
                                            <Input type="password" value={data.midtrans_client_key} onChange={e => setData('midtrans_client_key', e.target.value)} className="bg-slate-50 font-mono text-sm" placeholder="Midtrans Client Key..." />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: SECURITY & MAINTENANCE */}
                            {activeTab === 'security' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="space-y-4 max-w-2xl border border-red-100 bg-red-50/30 p-5 rounded-xl">
                                        <div className="flex items-center gap-3 border-b border-red-100 pb-3 mb-3">
                                            <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center text-red-600"><Server className="w-4 h-4"/></div>
                                            <h3 className="font-bold text-red-800">Maintenance Mode</h3>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-4">
                                            Mengaktifkan mode ini akan mencegah semua pengguna tenant (Klien) mengakses aplikasi. Hanya Super Admin yang tetap dapat melakukan login. Gunakan ini saat Anda melakukan update server atau database.
                                        </p>
                                        <div className="flex items-center space-x-3 p-4 bg-white border border-red-200 rounded-lg shadow-sm">
                                            <input 
                                                type="checkbox" 
                                                id="maintenance_mode" 
                                                checked={data.maintenance_mode} 
                                                onChange={e => setData('maintenance_mode', e.target.checked)} 
                                                className="rounded w-5 h-5 text-red-600 focus:ring-red-500 border-slate-300 cursor-pointer" 
                                            />
                                            <Label htmlFor="maintenance_mode" className="text-red-900 font-bold cursor-pointer select-none text-base">Aktifkan Maintenance Mode</Label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 mt-6 border-t border-slate-200">
                                <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8 shadow-md h-11 text-sm font-bold">
                                    <Save className="w-4 h-4 mr-2" />
                                    {processing ? 'Menyimpan Perubahan...' : 'Simpan Pengaturan'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}