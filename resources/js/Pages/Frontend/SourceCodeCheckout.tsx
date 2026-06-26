import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import CheckoutLayout from '@/Layouts/CheckoutLayout';

interface SourceCode {
    id: string;
    title: string;
    slug: string;
    description: string;
    price: string;
    thumbnail: string | null;
    features: string[];
}

interface Props {
    sourceCode: SourceCode;
}

export default function SourceCodeCheckout({ sourceCode }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        payment_method: 'bank_transfer',
        promo_code: '',
        error: '',
    });

    const [appliedPromo, setAppliedPromo] = useState<{code: string, discount: number} | null>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/product/${sourceCode.slug}/checkout`);
    };

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(amount));
    };

    const priceNum = sourceCode ? Number(sourceCode.price) : 0;
    const discountAmount = appliedPromo ? appliedPromo.discount : 0;
    const totalAmount = Math.max(0, priceNum - discountAmount);

    const handleApplyPromo = () => {
        if (!data.promo_code) return;
        if (data.promo_code.toUpperCase() === 'DISKON50') {
            setAppliedPromo({ code: 'DISKON50', discount: 50000 });
        } else {
            alert('Kode promo tidak valid atau sudah kedaluwarsa.');
            setAppliedPromo(null);
        }
    };

    return (
        <CheckoutLayout 
            title={`Checkout - ${sourceCode.title}`} 
            backUrl={`/product/${sourceCode.slug}`}
        >
            <div className="grid lg:grid-cols-[1.3fr_1fr] gap-12 items-start">
                
                {/* --- Kiri: Form --- */}
                <div>
                    <div className="mb-9">
                        <span className="text-[12.5px] font-semibold text-[var(--amber)] uppercase tracking-wider mb-2.5 block">One-Time Purchase</span>
                        <h1 className="text-[30px] font-bold tracking-tight mb-2">Buat Akun & Selesaikan Pesanan</h1>
                        <p className="text-[14.5px] text-[var(--slate)]">File source code dan panduan instalasi akan tersedia di dasbor Anda setelah pembayaran berhasil diverifikasi.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        
                        {errors.error && (
                            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold">{errors.error}</div>
                        )}

                        <div className="bg-white border border-[var(--line)] rounded-2xl p-7">
                            <h3 className="font-bold text-[16px] mb-5 border-b border-gray-100 pb-3">Informasi Akun Anda</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[12.5px] font-semibold text-[var(--slate)] mb-1 block">Nama Lengkap</label>
                                    <input type="text" className="field-input" placeholder="Masukkan nama Anda" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                    {errors.name && <span className="text-[11px] text-red-500">{errors.name}</span>}
                                </div>
                                <div>
                                    <label className="text-[12.5px] font-semibold text-[var(--slate)] mb-1 block">Email Aktif</label>
                                    <input type="email" className="field-input" placeholder="nama@email.com" value={data.email} onChange={e => setData('email', e.target.value)} required />
                                    {errors.email && <span className="text-[11px] text-red-500">{errors.email}</span>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[12.5px] font-semibold text-[var(--slate)] mb-1 block">Kata Sandi</label>
                                        <input type="password" className="field-input" placeholder="Min. 8 Karakter" value={data.password} onChange={e => setData('password', e.target.value)} required />
                                        {errors.password && <span className="text-[11px] text-red-500">{errors.password}</span>}
                                    </div>
                                    <div>
                                        <label className="text-[12.5px] font-semibold text-[var(--slate)] mb-1 block">Ulangi Sandi</label>
                                        <input type="password" className="field-input" placeholder="Ketik ulang" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} required />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-[var(--line)] rounded-2xl p-7">
                            <h3 className="font-bold text-[16px] mb-5 border-b border-gray-100 pb-3">Metode Pembayaran</h3>
                            <div className="grid grid-cols-2 gap-3 mb-2">
                                <label className={`pay-method ${data.payment_method === 'bank_transfer' ? 'selected' : ''}`}>
                                    <input type="radio" className="hidden" checked={data.payment_method === 'bank_transfer'} onChange={e => setData('payment_method', e.target.value)} value="bank_transfer" />
                                    Transfer Bank / VA
                                </label>
                                <label className={`pay-method ${data.payment_method === 'e_wallet' ? 'selected' : ''}`}>
                                    <input type="radio" className="hidden" checked={data.payment_method === 'e_wallet'} onChange={e => setData('payment_method', e.target.value)} value="e_wallet" />
                                    E-Wallet / QRIS
                                </label>
                            </div>
                        </div>
                        
                        <div className="lg:hidden">
                            <button type="submit" disabled={processing} className="w-full bg-[#E8A33D] text-[#0B1120] font-bold py-4 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
                                {processing ? 'Memproses...' : 'Beli & Selesaikan Pembayaran'} <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- Kanan: Summary --- */}
                <div className="bg-[#0B1120] text-white rounded-3xl p-8 lg:sticky lg:top-[96px] shadow-2xl">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">Ringkasan Pesanan</h3>
                    
                    <div className="flex gap-4 items-center pb-6 border-b border-white/10 mb-6">
                        {sourceCode.thumbnail ? (
                            <img src={sourceCode.thumbnail} alt={sourceCode.title} className="w-20 h-20 rounded-xl object-cover bg-gray-800" />
                        ) : (
                            <div className="w-20 h-20 rounded-xl bg-gray-800 flex items-center justify-center"><CheckCircle2 className="text-gray-500" /></div>
                        )}
                        <div>
                            <h4 className="text-lg font-bold mb-1 line-clamp-2">{sourceCode.title}</h4>
                            <span className="text-[10px] bg-[#E8A33D] text-[#0B1120] px-2 py-1 rounded font-bold uppercase">Digital Download</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-baseline mb-6">
                        <span className="text-sm text-gray-300">Total Pembayaran</span>
                        <span className="text-3xl font-bold font-mono tracking-tight text-[#E8A33D]">{formatCurrency(sourceCode.price)}</span>
                    </div>

                    <button onClick={submit} disabled={processing} className="w-full hidden lg:flex bg-[#E8A33D] hover:bg-[#d8932b] text-[#0B1120] font-bold py-4 rounded-xl items-center justify-center gap-2 transition-all disabled:opacity-50">
                        {processing ? 'Memproses...' : 'Beli Source Code'} <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="mt-8 space-y-3">
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-4">Yang Akan Anda Dapatkan:</p>
                        <div className="flex items-start gap-2.5 text-sm text-gray-300">
                            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                            Full Source Code (Akses Penuh)
                        </div>
                        <div className="flex items-start gap-2.5 text-sm text-gray-300">
                            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                            Dokumentasi & Cara Instalasi
                        </div>
                        {sourceCode.features?.slice(0, 3).map((feat, i) => (
                            <div key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" /> {feat}
                            </div>
                        ))}
                    </div>
                </div>
                
            </div>
        </CheckoutLayout>
    );
}