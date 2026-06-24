import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { 
    Building2, User, Mail, Lock, CreditCard, Tag, 
    Check, ShieldCheck, ArrowRight, Wallet, HelpCircle,
    RotateCcw
} from 'lucide-react';

interface Package {
    id: string;
    name: string;
    description: string;
    price: string;
    billing_cycle: string;
    features: string[];
    max_students: number;
    storage_limit_mb: number;
}

interface Props {
    selectedPackage: Package | null;
}

export default function Register({ selectedPackage }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        school_name: '',
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        package_id: selectedPackage?.id || '',
        payment_method: 'bank_transfer',
        promo_code: '',
        error: '', 
    });

    const [appliedPromo, setAppliedPromo] = useState<{code: string, discount: number} | null>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
    };

    const priceNum = selectedPackage ? Number(selectedPackage.price) : 0;
    const discountAmount = appliedPromo ? appliedPromo.discount : 0;
    const totalAmount = Math.max(0, priceNum - discountAmount);

    const handleApplyPromo = () => {
        if (!data.promo_code) return;
        if (data.promo_code.toUpperCase() === 'DISKON50') {
            setAppliedPromo({ code: 'DISKON50', discount: 50000 });
            alert('Kode promo berhasil diterapkan!');
        } else {
            alert('Kode promo tidak valid atau sudah kedaluwarsa.');
            setAppliedPromo(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100">
            <Head title={selectedPackage ? "Checkout Berlangganan - AkademiaOS" : "Daftar Free Trial - AkademiaOS"} />

            {/* --- TOP NAVBAR --- */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                        A
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-900">AkademiaOS</span>
                </Link>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    Secure checkout
                </div>
            </header>

            {/* --- MAIN CONTENT GRID --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
                    
                    {/* --- KOLOM KIRI: VALUE PROPOSITION & ORDER SUMMARY --- */}
                    <div className="lg:col-span-5 flex flex-col pt-2">
                        
                        <div className="mb-8">
                            <p className="text-blue-600 font-semibold text-sm mb-3">Langkah 1 dari 1</p>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                                {selectedPackage 
                                    ? "Selangkah lagi untuk membuka fitur premium" 
                                    : "Mulai perjalanan digital sekolah Anda"}
                            </h1>
                            <p className="text-slate-500 text-base leading-relaxed">
                                {selectedPackage 
                                    ? "Selesaikan pendaftaran dan nikmati kemudahan manajemen akademik terpadu."
                                    : "Coba semua fitur unggulan secara gratis selama 14 hari tanpa komitmen."}
                            </p>
                        </div>

                        {/* Package Info Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 relative overflow-hidden mb-6">
                            {/* Decorative background blur */}
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

                            {selectedPackage && selectedPackage.price > '0' && (
                                <div className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
                                    Paket Terpilih
                                </div>
                            )}

                            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                {selectedPackage ? selectedPackage.name : 'Free Trial 14 Hari'}
                            </h2>
                            
                            <div className="flex items-end gap-1 mb-2">
                                <span className="text-3xl font-extrabold text-blue-600">
                                    {selectedPackage ? formatRupiah(priceNum) : 'Rp 0'}
                                </span>
                                {selectedPackage && (
                                    <span className="text-slate-500 font-medium mb-1">
                                        / {selectedPackage.billing_cycle === 'yearly' ? 'tahun' : selectedPackage.billing_cycle === 'monthly' ? 'bulan' : 'sekali'}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-slate-500 mb-6 pb-6 border-b border-slate-100">
                                {selectedPackage 
                                    ? selectedPackage.description 
                                    : "Akses penuh ke seluruh modul sistem informasi akademik."}
                            </p>

                            <div className="space-y-4">
                                {/* Base Features */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 bg-blue-100 text-blue-600 rounded-full p-0.5 shrink-0">
                                        <Check className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-sm text-slate-700 font-medium">
                                        {selectedPackage ? `Maksimal ${selectedPackage.max_students} Siswa` : 'Kapasitas Tidak Terbatas'}
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 bg-blue-100 text-blue-600 rounded-full p-0.5 shrink-0">
                                        <Check className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-sm text-slate-700 font-medium">
                                        {selectedPackage ? `Penyimpanan ${(selectedPackage.storage_limit_mb / 1024).toFixed(1)} GB` : 'Penyimpanan Cukup untuk Percobaan'}
                                    </span>
                                </div>
                                {/* Dynamic Features */}
                                {selectedPackage?.features && Array.isArray(selectedPackage.features) && selectedPackage.features.map((feat: string, idx: number) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className="mt-0.5 bg-blue-100 text-blue-600 rounded-full p-0.5 shrink-0">
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-sm text-slate-700 font-medium">{feat}</span>
                                    </div>
                                ))}
                                {!selectedPackage && (
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 bg-blue-100 text-blue-600 rounded-full p-0.5 shrink-0">
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-sm text-slate-700 font-medium">Tanpa Kartu Kredit</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Custom / Contact Sales Banner */}
                        <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200 p-6 flex items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="bg-white p-2 rounded-full border border-slate-200 shrink-0">
                                    <HelpCircle className="w-5 h-5 text-slate-600" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 mb-1">Butuh kustomisasi?</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Kami menyediakan solusi khusus (On-Premise) untuk instansi besar.
                                    </p>
                                </div>
                            </div>
                            <Link href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap hidden sm:block">
                                Hubungi Sales &rarr;
                            </Link>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-8 flex items-center justify-between sm:justify-start sm:gap-10 border-t border-slate-200 pt-6">
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                <RotateCcw className="w-4 h-4 text-slate-400" /> Garansi 30-hari
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                <ShieldCheck className="w-4 h-4 text-slate-400" /> Enkripsi Aman
                            </div>
                        </div>

                    </div>

                    {/* --- KOLOM KANAN: FORM PENDAFTARAN & CHECKOUT --- */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                            <div className="px-6 py-8 sm:p-10">
                                
                                <h2 className="text-xl font-bold text-slate-900 mb-2">Checkout Pendaftaran</h2>
                                <p className="text-sm text-slate-500 mb-8">Masukkan detail institusi dan selesaikan pengaturan.</p>

                                <form onSubmit={submit} className="space-y-8">
                                    
                                    {errors.error && (
                                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-medium flex items-center gap-2">
                                            <ShieldCheck className="w-5 h-5" /> {errors.error}
                                        </div>
                                    )}

                                    {/* --- INFORMASI INSTITUSI --- */}
                                    <div className="space-y-5">
                                        <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">1. Data Institusi</h3>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="school_name" className="text-slate-700">Nama Institusi</Label>
                                            <div className="relative">
                                                <Building2 className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <Input 
                                                    id="school_name" 
                                                    placeholder="Contoh: SMA Negeri 1 Bangsa"
                                                    value={data.school_name}
                                                    onChange={(e) => setData('school_name', e.target.value)}
                                                    className="pl-10 h-11 bg-slate-50/50 focus:bg-white transition-colors"
                                                />
                                            </div>
                                            {errors.school_name && <p className="text-xs text-red-500">{errors.school_name}</p>}
                                        </div>
                                    </div>

                                    {/* --- INFORMASI ADMIN --- */}
                                    <div className="space-y-5">
                                        <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">2. Akun Administrator</h3>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-slate-700">Nama Lengkap</Label>
                                                <div className="relative">
                                                    <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                    <Input 
                                                        id="name" 
                                                        placeholder="Nama pengelola"
                                                        value={data.name}
                                                        onChange={(e) => setData('name', e.target.value)}
                                                        className="pl-10 h-11 bg-slate-50/50 focus:bg-white transition-colors"
                                                    />
                                                </div>
                                                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-slate-700">Alamat Email</Label>
                                                <div className="relative">
                                                    <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                    <Input 
                                                        id="email" 
                                                        type="email" 
                                                        placeholder="email@institusi.com"
                                                        value={data.email}
                                                        onChange={(e) => setData('email', e.target.value)}
                                                        className="pl-10 h-11 bg-slate-50/50 focus:bg-white transition-colors"
                                                    />
                                                </div>
                                                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="password" className="text-slate-700">Password</Label>
                                                <div className="relative">
                                                    <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                    <Input 
                                                        id="password" 
                                                        type="password" 
                                                        placeholder="Minimal 8 karakter"
                                                        value={data.password}
                                                        onChange={(e) => setData('password', e.target.value)}
                                                        className="pl-10 h-11 bg-slate-50/50 focus:bg-white transition-colors"
                                                    />
                                                </div>
                                                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="password_confirmation" className="text-slate-700">Konfirmasi Password</Label>
                                                <div className="relative">
                                                    <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                    <Input 
                                                        id="password_confirmation" 
                                                        type="password" 
                                                        placeholder="Ulangi password"
                                                        value={data.password_confirmation}
                                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                                        className="pl-10 h-11 bg-slate-50/50 focus:bg-white transition-colors"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- PEMBAYARAN (HANYA JIKA BERBAYAR) --- */}
                                    {selectedPackage && priceNum > 0 && (
                                        <div className="space-y-5 pt-2">
                                            <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">3. Metode Pembayaran</h3>
                                            
                                            {/* Selector Pembayaran mirip Tabs */}
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <label className={`flex-1 cursor-pointer flex items-center justify-center gap-2 p-3 border rounded-lg transition-all ${data.payment_method === 'bank_transfer' ? 'border-blue-600 bg-blue-50/30 text-blue-700 shadow-[0_0_0_1px_#2563eb]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                                    <input type="radio" name="payment_method" value="bank_transfer" className="sr-only" checked={data.payment_method === 'bank_transfer'} onChange={(e) => setData('payment_method', e.target.value)} />
                                                    <CreditCard className="w-5 h-5" />
                                                    <span className="font-semibold text-sm">Transfer / VA</span>
                                                </label>
                                                <label className={`flex-1 cursor-pointer flex items-center justify-center gap-2 p-3 border rounded-lg transition-all ${data.payment_method === 'e_wallet' ? 'border-blue-600 bg-blue-50/30 text-blue-700 shadow-[0_0_0_1px_#2563eb]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                                    <input type="radio" name="payment_method" value="e_wallet" className="sr-only" checked={data.payment_method === 'e_wallet'} onChange={(e) => setData('payment_method', e.target.value)} />
                                                    <Wallet className="w-5 h-5" />
                                                    <span className="font-semibold text-sm">QRIS / E-Wallet</span>
                                                </label>
                                            </div>

                                            {/* Mock Kode Promo */}
                                            <div className="space-y-2 mt-4">
                                                <Label htmlFor="promo" className="text-slate-700">Kode Promo (Opsional)</Label>
                                                <div className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <Tag className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                        <Input 
                                                            id="promo" 
                                                            placeholder="Masukkan kode..."
                                                            value={data.promo_code}
                                                            onChange={(e) => setData('promo_code', e.target.value)}
                                                            className="pl-10 h-11 uppercase bg-slate-50/50 focus:bg-white"
                                                            disabled={appliedPromo !== null}
                                                        />
                                                    </div>
                                                    <Button type="button" variant="outline" onClick={handleApplyPromo} disabled={!data.promo_code || appliedPromo !== null} className="h-11 px-6">
                                                        Terapkan
                                                    </Button>
                                                </div>
                                                {appliedPromo && (
                                                    <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
                                                        <Check className="w-4 h-4 bg-emerald-100 text-emerald-600 rounded-full p-0.5" /> 
                                                        Promo diterapkan (- {formatRupiah(appliedPromo.discount)})
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* --- BILLING SUMMARY & SUBMIT --- */}
                                    <div className="mt-8 pt-6 border-t border-slate-200">
                                        {selectedPackage ? (
                                            <div className="space-y-3 mb-6">
                                                <div className="flex justify-between text-sm text-slate-600">
                                                    <span>Paket {selectedPackage.name}</span>
                                                    <span>{formatRupiah(priceNum)}</span>
                                                </div>
                                                {appliedPromo && (
                                                    <div className="flex justify-between text-sm text-emerald-600">
                                                        <span>Diskon Promo</span>
                                                        <span>- {formatRupiah(appliedPromo.discount)}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-center text-lg font-bold text-slate-900 pt-3 border-t border-slate-100">
                                                    <span>Total Pembayaran</span>
                                                    <div className="flex flex-col items-end">
                                                        <span>{formatRupiah(totalAmount)} <span className="text-sm font-normal text-slate-500 uppercase tracking-wide">IDR</span></span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-center text-lg font-bold text-slate-900 pt-2 mb-6">
                                                <span>Total Biaya</span>
                                                <span className="text-emerald-600">Gratis (Rp 0)</span>
                                            </div>
                                        )}

                                        <Button className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-md transition-all" type="submit" disabled={processing}>
                                            <Lock className="w-4 h-4 mr-2" />
                                            {processing 
                                                ? 'Memproses...' 
                                                : (selectedPackage && priceNum > 0 ? 'Selesaikan Pembayaran' : 'Mulai Free Trial')} 
                                        </Button>
                                        
                                        <p className="text-center text-xs text-slate-500 mt-5 leading-relaxed">
                                            Dengan mendaftar, Anda menyetujui <a href="#" className="text-blue-600 hover:underline">Ketentuan Layanan</a> dan <a href="#" className="text-blue-600 hover:underline">Kebijakan Privasi</a> kami.
                                        </p>
                                    </div>

                                </form>
                            </div>
                            
                            {/* Form Footer */}
                            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 text-center text-sm text-slate-600">
                                Sudah punya akun?{' '}
                                <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                                    Masuk ke Dashboard
                                </Link>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
