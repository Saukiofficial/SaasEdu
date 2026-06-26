import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

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
        } else {
            alert('Kode promo tidak valid atau sudah kedaluwarsa.');
            setAppliedPromo(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#EDEAE2] font-body text-[#0B1120] selection:bg-[#2D5F4C] selection:text-white p-0">
            <Head title={selectedPackage ? "Selesaikan Langganan" : "Daftar Free Trial"} />
            
            {/* --- CUSTOM CSS TOKENS (Sama dengan Landing Page) --- */}
            <style dangerouslySetInnerHTML={{__html: `
                :root {
                    --ink: #0B1120; --ink-soft: #141d33; --paper: #F7F5F0; --paper-dim: #EDEAE2;
                    --moss: #2D5F4C; --moss-light: #3f7d65; --amber: #E8A33D; --amber-deep: #c9842a;
                    --slate: #475569; --slate-light: #8b96a8; --line: rgba(11,17,32,0.1); --line-light: rgba(247,245,240,0.14);
                    --font-display: 'Space Grotesk', sans-serif; --font-body: 'Inter', sans-serif; --font-mono: 'JetBrains Mono', monospace;
                }
                body { font-family: var(--font-body); }
                .font-display { font-family: var(--font-display); }
                .font-mono { font-family: var(--font-mono); }
                
                .field-input { border: 1.5px solid var(--line); border-radius: 9px; padding: 11px 13px; font-size: 14.5px; background: var(--paper); color: var(--ink); width: 100%; transition: all .2s; }
                .field-input:focus { border-color: var(--moss); background: #fff; outline: none; }
                
                .btn-amber { background: var(--amber); color: var(--ink); font-weight: 600; padding: 15px; border-radius: 9px; width: 100%; transition: all .2s; }
                .btn-amber:hover:not(:disabled) { background: #f0b454; transform: translateY(-1.5px); box-shadow: 0 10px 24px -8px rgba(232,163,61,0.5); }
                .btn-amber:disabled { opacity: 0.7; cursor: not-allowed; }
                
                .pay-method { border: 1.5px solid var(--line); border-radius: 10px; padding: 13px 10px; display: flex; flex-direction: column; align-items: center; gap: 7px; font-size: 12px; font-weight: 600; color: var(--slate); cursor: pointer; transition: all .2s; }
                .pay-method.selected { border-color: var(--moss); background: rgba(45,95,76,0.06); color: var(--moss); }
            `}} />

            {/* --- TOPBAR --- */}
            <div className="h-[72px] flex items-center justify-between border-b border-[var(--line)] bg-[var(--paper)]">
                <div className="max-w-[1100px] mx-auto px-7 w-full flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-[14px] font-semibold text-[var(--slate)] hover:text-[var(--ink)] transition-colors">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                        Kembali
                    </Link>
                    <div className="flex items-center gap-2 font-display font-bold text-[16px]">
                        <div className="w-6 h-6 rounded-md bg-[var(--ink)] flex items-center justify-center shrink-0">
                            <div className="w-[8px] h-[8px] border-[1.5px] border-[var(--amber)] border-r-transparent border-b-transparent rounded-sm rotate-45"></div>
                        </div>
                        AkademiaOS
                    </div>
                    <div className="hidden md:flex items-center gap-2 font-mono text-[12.5px] text-[var(--slate-light)]">
                        <span className="text-[var(--moss)] font-semibold">01 Paket</span> <span>&rarr;</span>
                        <span className="text-[var(--moss)] font-semibold">02 Checkout</span> <span>&rarr;</span>
                        <span>03 Selesai</span>
                    </div>
                </div>
            </div>

            {/* --- CHECKOUT BODY --- */}
            <div className="max-w-[1100px] mx-auto px-7 pt-14 pb-[100px] grid lg:grid-cols-[1.3fr_1fr] gap-12 items-start">
                
                {/* --- BAGIAN KIRI (FORM) --- */}
                <div>
                    <div className="mb-9">
                        <span className="font-mono text-[12.5px] font-semibold text-[var(--amber-deep)] uppercase tracking-[0.06em] mb-2.5 block">Checkout</span>
                        <h1 className="font-display font-bold text-[30px] tracking-tight mb-2">
                            {selectedPackage ? 'Selesaikan langganan Anda' : 'Buat akun Free Trial'}
                        </h1>
                        <p className="text-[14.5px] text-[var(--slate)]">
                            {selectedPackage ? 'Isi data di bawah untuk mengaktifkan paket. Anda bisa membatalkan kapan saja.' : 'Nikmati akses penuh selama 14 hari tanpa biaya tersembunyi.'}
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        
                        {errors.error && (
                            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-[13.5px] font-semibold">
                                {errors.error}
                            </div>
                        )}

                        {/* BLOCK 1: Data Akun */}
                        <div className="bg-white border border-[var(--line)] rounded-2xl p-7">
                            <h3 className="font-display font-semibold text-[16px] flex items-center gap-2 mb-5">
                                <span className="w-5 h-5 rounded-full bg-[var(--ink)] text-white font-mono text-[11px] flex items-center justify-center">1</span> Data Institusi & Admin
                            </h3>
                            
                            <div className="space-y-3.5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="school_name" className="text-[12.5px] font-semibold text-[var(--slate)]">Nama institusi / usaha</label>
                                        <input type="text" id="school_name" className="field-input" placeholder="Contoh: Universitas Nusantara" value={data.school_name} onChange={e => setData('school_name', e.target.value)} />
                                        {errors.school_name && <span className="text-[11px] text-red-500">{errors.school_name}</span>}
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="name" className="text-[12.5px] font-semibold text-[var(--slate)]">Nama pengelola</label>
                                        <input type="text" id="name" className="field-input" placeholder="Nama Lengkap" value={data.name} onChange={e => setData('name', e.target.value)} />
                                        {errors.name && <span className="text-[11px] text-red-500">{errors.name}</span>}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="email" className="text-[12.5px] font-semibold text-[var(--slate)]">Email aktif</label>
                                    <input type="email" id="email" className="field-input" placeholder="admin@institusi.ac.id" value={data.email} onChange={e => setData('email', e.target.value)} />
                                    {errors.email && <span className="text-[11px] text-red-500">{errors.email}</span>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="password" className="text-[12.5px] font-semibold text-[var(--slate)]">Kata Sandi</label>
                                        <input type="password" id="password" className="field-input" placeholder="Min. 8 karakter" value={data.password} onChange={e => setData('password', e.target.value)} />
                                        {errors.password && <span className="text-[11px] text-red-500">{errors.password}</span>}
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="password_confirmation" className="text-[12.5px] font-semibold text-[var(--slate)]">Ulangi Sandi</label>
                                        <input type="password" id="password_confirmation" className="field-input" placeholder="Ketik ulang sandi" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BLOCK 2 & 3: Pembayaran & Promo (Hanya jika Berbayar) */}
                        {selectedPackage && priceNum > 0 && (
                            <>
                                <div className="bg-white border border-[var(--line)] rounded-2xl p-7">
                                    <h3 className="font-display font-semibold text-[16px] flex items-center gap-2 mb-5">
                                        <span className="w-5 h-5 rounded-full bg-[var(--ink)] text-white font-mono text-[11px] flex items-center justify-center">2</span> Metode Pembayaran
                                    </h3>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 mb-4">
                                        <label className={`pay-method ${data.payment_method === 'bank_transfer' ? 'selected' : ''}`}>
                                            <input type="radio" name="payment" value="bank_transfer" className="hidden" checked={data.payment_method === 'bank_transfer'} onChange={e => setData('payment_method', e.target.value)} />
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10h18M7 15h.01M11 15h2"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg>
                                            Transfer VA
                                        </label>
                                        <label className={`pay-method ${data.payment_method === 'e_wallet' ? 'selected' : ''}`}>
                                            <input type="radio" name="payment" value="e_wallet" className="hidden" checked={data.payment_method === 'e_wallet'} onChange={e => setData('payment_method', e.target.value)} />
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>
                                            E-Wallet/QRIS
                                        </label>
                                        <label className={`pay-method ${data.payment_method === 'credit_card' ? 'selected' : ''}`}>
                                            <input type="radio" name="payment" value="credit_card" className="hidden" checked={data.payment_method === 'credit_card'} onChange={e => setData('payment_method', e.target.value)} />
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
                                            Kartu Kredit
                                        </label>
                                    </div>
                                    <p className="text-[11.5px] text-[var(--slate-light)]">Instruksi pembayaran akan dikirimkan ke email Anda setelah mendaftar.</p>
                                </div>

                                <div className="bg-white border border-[var(--line)] rounded-2xl p-7">
                                    <h3 className="font-display font-semibold text-[16px] flex items-center gap-2 mb-4">
                                        <span className="w-5 h-5 rounded-full bg-[var(--ink)] text-white font-mono text-[11px] flex items-center justify-center">3</span> Kode Promo
                                    </h3>
                                    
                                    <div className="flex gap-2.5">
                                        <input type="text" className="field-input uppercase flex-grow" placeholder="Masukkan kode promo..." value={data.promo_code} onChange={e => setData('promo_code', e.target.value)} disabled={appliedPromo !== null} />
                                        <button type="button" onClick={handleApplyPromo} className="bg-[var(--ink)] text-white px-5 rounded-lg text-[13.5px] font-semibold hover:bg-[var(--ink-soft)] transition-colors shrink-0 disabled:opacity-50" disabled={!data.promo_code || appliedPromo !== null}>
                                            Terapkan
                                        </button>
                                    </div>
                                    {appliedPromo && (
                                        <div className="flex items-center gap-1.5 mt-3 text-[12.5px] font-semibold text-[var(--moss)]">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                                            Kode promo {appliedPromo.code} berhasil diterapkan!
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2.5 text-[12.5px] text-[var(--slate-light)] pt-4 mt-4 border-t border-[var(--line-light)]">
                                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-[15px] h-[15px] stroke-[var(--moss)] shrink-0"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>
                                        Pendaftaran dienkripsi end-to-end dengan aman.
                                    </div>
                                </div>
                            </>
                        )}
                        
                        {/* Tombol Register Mobile (Akan disembunyikan di Desktop dan pindah ke Summary Card) */}
                        <div className="lg:hidden mt-6">
                            <button type="submit" disabled={processing} className="btn-amber">
                                {processing ? 'Memproses...' : (selectedPackage && priceNum > 0 ? 'Mulai Langganan' : 'Daftar & Mulai Trial')}
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- BAGIAN KANAN (SUMMARY CARD) --- */}
                <div className="bg-[var(--ink)] text-[var(--paper)] rounded-[18px] p-8 lg:sticky lg:top-[96px] shadow-[0_30px_60px_-24px_rgba(11,17,32,0.4)]">
                    
                    {selectedPackage ? (
                        <>
                            <div className="flex justify-between items-start pb-5 border-b border-white/10 mb-5">
                                <div>
                                    <div className="font-display font-semibold text-[18px] mb-1">{selectedPackage.name}</div>
                                    <div className="text-[12.5px] text-[var(--slate-light)] max-w-[200px] leading-[1.5]">{selectedPackage.description}</div>
                                </div>
                                <span className="font-mono text-[10.5px] bg-[var(--amber)] text-[var(--ink)] px-[9px] py-[3px] rounded-full font-bold uppercase shrink-0">
                                    {selectedPackage.billing_cycle === 'yearly' ? 'TAHUNAN' : 'BULANAN'}
                                </span>
                            </div>

                            <div className="flex justify-between items-center text-[14px] text-[var(--slate-light)] py-2">
                                <span>Subtotal</span>
                                <span className="font-mono text-[var(--paper)]">{formatRupiah(priceNum)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[14px] text-[var(--slate-light)] py-2">
                                <span>Siklus</span>
                                <span className="font-mono text-[var(--paper)]">{selectedPackage.billing_cycle === 'yearly' ? 'Tahunan' : 'Bulanan'}</span>
                            </div>
                            
                            {appliedPromo && (
                                <div className="flex justify-between items-center text-[14px] text-[var(--amber)] py-2 font-medium">
                                    <span>Diskon ({appliedPromo.code})</span>
                                    <span className="font-mono">-{formatRupiah(appliedPromo.discount)}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-baseline pt-4 mt-2 border-t border-white/10">
                                <span className="text-[14px] font-semibold">Total tagihan</span>
                                <span className="font-mono text-[26px] font-bold tracking-tight">
                                    {formatRupiah(totalAmount)}
                                    <span className="text-[12px] text-[var(--slate-light)] font-sans ml-1 font-normal">/{selectedPackage.billing_cycle === 'yearly' ? 'thn' : 'bln'}</span>
                                </span>
                            </div>

                            <button onClick={submit} disabled={processing} className="btn-amber mt-7 hidden lg:block">
                                {processing ? 'Memproses Data...' : 'Mulai Langganan'}
                            </button>

                            <ul className="mt-6 pt-5 border-t border-white/10 space-y-3">
                                <li className="flex items-start gap-2.5 text-[13px] text-[var(--slate-light)]">
                                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" className="w-[14px] h-[14px] stroke-[var(--amber)] shrink-0 mt-0.5"><path d="M20 6L9 17l-5-5"/></svg>
                                    Maks {selectedPackage.max_students} Siswa
                                </li>
                                {selectedPackage.features?.map((feat: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2.5 text-[13px] text-[var(--slate-light)]">
                                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" className="w-[14px] h-[14px] stroke-[var(--amber)] shrink-0 mt-0.5"><path d="M20 6L9 17l-5-5"/></svg>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <>
                            <div className="pb-5 border-b border-white/10 mb-5 text-center">
                                <div className="font-display font-semibold text-[22px] mb-2 text-[var(--amber)]">Free Trial 14 Hari</div>
                                <div className="text-[13.5px] text-[var(--slate-light)] leading-[1.6]">Coba semua fitur unggulan secara gratis tanpa komitmen.</div>
                            </div>
                            
                            <div className="flex justify-between items-baseline pt-2">
                                <span className="text-[14px] font-semibold">Total tagihan</span>
                                <span className="font-mono text-[26px] font-bold tracking-tight text-[var(--moss-light)]">Rp0</span>
                            </div>

                            <button onClick={submit} disabled={processing} className="btn-amber mt-7 hidden lg:block">
                                {processing ? 'Memproses...' : 'Daftar Sekarang'}
                            </button>

                            <ul className="mt-6 pt-5 border-t border-white/10 space-y-3">
                                <li className="flex items-start gap-2.5 text-[13px] text-[var(--slate-light)]">
                                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" className="w-[14px] h-[14px] stroke-[var(--moss-light)] shrink-0 mt-0.5"><path d="M20 6L9 17l-5-5"/></svg>
                                    Akses Penuh Semua Modul
                                </li>
                                <li className="flex items-start gap-2.5 text-[13px] text-[var(--slate-light)]">
                                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" className="w-[14px] h-[14px] stroke-[var(--moss-light)] shrink-0 mt-0.5"><path d="M20 6L9 17l-5-5"/></svg>
                                    Tanpa Kartu Kredit
                                </li>
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
