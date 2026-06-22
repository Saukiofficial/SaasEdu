import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    LayoutTemplate, Save, Type, LayoutGrid, 
    MonitorPlay, BarChart3, MessageSquareQuote, 
    ChevronDown, ChevronRight, Building, Sparkles, CheckCircle2
} from 'lucide-react';

export default function LandingPageIndex({ landingSettings }: { landingSettings: any }) {
    // Bangun initialState secara dinamis
    const initialState: any = {
        hero_title: landingSettings.hero_title || '',
        hero_subtitle: landingSettings.hero_subtitle || '',
    };
    
    [1, 2, 3, 4, 5].forEach(i => {
        initialState[`partner_${i}_name`] = landingSettings[`partner_${i}_name`] || '';
        initialState[`partner_${i}_logo`] = null; // null untuk input file
    });

    [1, 2, 3, 4, 5, 6].forEach(i => {
        initialState[`feature_${i}_title`] = landingSettings[`feature_${i}_title`] || '';
        initialState[`feature_${i}_desc`] = landingSettings[`feature_${i}_desc`] || '';
    });
    [1, 2, 3, 4].forEach(i => {
        initialState[`stat_${i}_value`] = landingSettings[`stat_${i}_value`] || '';
        initialState[`stat_${i}_label`] = landingSettings[`stat_${i}_label`] || '';
    });
    [1, 2, 3].forEach(i => {
        initialState[`testi_${i}_text`] = landingSettings[`testi_${i}_text`] || '';
        initialState[`testi_${i}_author`] = landingSettings[`testi_${i}_author`] || '';
        initialState[`testi_${i}_role`] = landingSettings[`testi_${i}_role`] || '';
    });

    const { data, setData, post, processing } = useForm(initialState);
    
    // Accordion state
    const [openSection, setOpenSection] = useState<'hero' | 'partners' | 'features' | 'stats' | 'testi'>('hero');

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Inertia otomatis memparsing File/Image ke FormData ketika menggunakan post()
        post('/super-admin/landing-page', {
            forceFormData: true,
        });
    };

    const AccordionHeader = ({ title, icon: Icon, section }: any) => (
        <div 
            onClick={() => setOpenSection(openSection === section ? null : section)}
            className="flex items-center justify-between p-6 bg-white border border-[#E2DDD0] rounded-2xl cursor-pointer hover:border-[#B8935F] transition-colors shadow-sm"
        >
            <h3 className="text-lg font-bold text-[#0F1729] flex items-center gap-3">
                <Icon className="w-5 h-5 text-[#B8935F]" /> {title}
            </h3>
            {openSection === section ? <ChevronDown className="w-5 h-5 text-[#8B93A8]" /> : <ChevronRight className="w-5 h-5 text-[#8B93A8]" />}
        </div>
    );

    return (
        <AuthenticatedLayout header="Content Management">
            <Head title="Pengelola Landing Page - AkademiaOS" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-serif font-semibold text-[#0F1729] flex items-center gap-2">
                            <LayoutTemplate className="w-6 h-6 text-[#B8935F]" />
                            CMS Landing Page Terpadu
                        </h1>
                        <p className="text-sm text-[#8B93A8] mt-1">
                            Semua perubahan teks & gambar di sini akan langsung terhubung ke Website Publik Anda.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <a href="/" target="_blank" className="px-4 py-2.5 bg-white border border-[#E2DDD0] text-[#0F1729] rounded-md text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                            Lihat Website
                        </a>
                        <button 
                            onClick={submit}
                            disabled={processing}
                            className="flex items-center gap-2 bg-[#0F1729] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#1B2742] transition-colors shadow-sm disabled:opacity-70"
                        >
                            <Save className="w-4 h-4 text-[#D4AF7A]" />
                            {processing ? 'Menyimpan...' : 'Simpan Konten'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2 space-y-4">
                        
                        {/* HERO SECTION */}
                        <div className="space-y-4">
                            <AccordionHeader title="Teks Utama (Hero Section)" icon={Type} section="hero" />
                            {openSection === 'hero' && (
                                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2DDD0] shadow-sm animate-in fade-in slide-in-from-top-2">
                                    <div className="space-y-5">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-[#0F1729]">Judul Promosi Utama (H1)</label>
                                            <input
                                                type="text"
                                                value={data.hero_title}
                                                onChange={e => setData('hero_title', e.target.value)}
                                                className="w-full px-3 py-2.5 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none transition-colors font-bold text-[#0F1729]"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-[#0F1729]">Sub-Judul (Deskripsi Penawaran)</label>
                                            <textarea
                                                value={data.hero_subtitle}
                                                onChange={e => setData('hero_subtitle', e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2.5 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none transition-colors resize-none text-[#1C2333]"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* PARTNER SECTION */}
                        <div className="space-y-4">
                            <AccordionHeader title="Logo Partner & Kepercayaan" icon={Building} section="partners" />
                            {openSection === 'partners' && (
                                <div className="bg-white p-6 rounded-2xl border border-[#E2DDD0] shadow-sm animate-in fade-in slide-in-from-top-2">
                                    <p className="text-xs text-[#8B93A8] mb-4">Logo akan ditampilkan dalam animasi berjalan (marquee) di bawah Hero Section. (Direkomendasikan format PNG/SVG transparan).</p>
                                    <div className="space-y-4">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Nama Partner {i}</label>
                                                    <input type="text" value={data[`partner_${i}_name`]} onChange={e => setData(`partner_${i}_name`, e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:border-blue-500 outline-none" placeholder="Contoh: Univ. Indonesia" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center justify-between">
                                                        <span>Upload Logo (Opsional)</span>
                                                        {landingSettings[`partner_${i}_logo`] && (
                                                            <a href={landingSettings[`partner_${i}_logo`]} target="_blank" className="text-blue-500 hover:underline">Lihat Logo Saat Ini</a>
                                                        )}
                                                    </label>
                                                    <input type="file" accept="image/*" onChange={e => setData(`partner_${i}_logo`, e.target.files ? e.target.files[0] : null)} className="w-full text-sm bg-white border border-slate-300 rounded file:mr-4 file:py-2 file:px-4 file:rounded-l file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* STATS SECTION */}
                        <div className="space-y-4">
                            <AccordionHeader title="Angka Statistik Pencapaian" icon={BarChart3} section="stats" />
                            {openSection === 'stats' && (
                                <div className="bg-white p-6 rounded-2xl border border-[#E2DDD0] shadow-sm animate-in fade-in slide-in-from-top-2">
                                    <div className="grid grid-cols-2 gap-6">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Angka Besar {i}</label>
                                                    <input type="text" value={data[`stat_${i}_value`]} onChange={e => setData(`stat_${i}_value`, e.target.value)} className="w-full px-3 py-1.5 text-lg font-bold bg-white border border-slate-300 rounded focus:border-blue-500 outline-none" placeholder="Misal: 500+" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Label Deskripsi {i}</label>
                                                    <input type="text" value={data[`stat_${i}_label`]} onChange={e => setData(`stat_${i}_label`, e.target.value)} className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded focus:border-blue-500 outline-none" placeholder="Misal: Sekolah Bergabung" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* FEATURES SECTION */}
                        <div className="space-y-4">
                            <AccordionHeader title="Keunggulan 6 Modul Fitur" icon={LayoutGrid} section="features" />
                            {openSection === 'features' && (
                                <div className="bg-white p-6 rounded-2xl border border-[#E2DDD0] shadow-sm animate-in fade-in slide-in-from-top-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[1, 2, 3, 4, 5, 6].map(i => (
                                            <div key={i} className="p-4 bg-[#FAF8F3] border border-[#E2DDD0] rounded-xl space-y-3">
                                                <h4 className="text-xs font-bold text-[#D4AF7A] mb-2 border-b border-[#E2DDD0] pb-1">Kotak Fitur {i}</h4>
                                                <input type="text" value={data[`feature_${i}_title`]} onChange={e => setData(`feature_${i}_title`, e.target.value)} className="w-full px-3 py-1.5 bg-white border border-[#E2DDD0] rounded text-sm font-bold focus:border-[#B8935F] outline-none" placeholder="Judul Fitur" />
                                                <textarea value={data[`feature_${i}_desc`]} onChange={e => setData(`feature_${i}_desc`, e.target.value)} rows={2} className="w-full px-3 py-1.5 bg-white border border-[#E2DDD0] rounded text-xs focus:border-[#B8935F] outline-none resize-none" placeholder="Deskripsi pendek..."></textarea>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* TESTIMONIAL SECTION */}
                        <div className="space-y-4">
                            <AccordionHeader title="Kutipan Testimoni Klien" icon={MessageSquareQuote} section="testi" />
                            {openSection === 'testi' && (
                                <div className="bg-white p-6 rounded-2xl border border-[#E2DDD0] shadow-sm animate-in fade-in slide-in-from-top-2 space-y-6">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row gap-4">
                                            <div className="w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center font-bold text-slate-500 shrink-0">{i}</div>
                                            <div className="flex-1 space-y-3">
                                                <textarea value={data[`testi_${i}_text`]} onChange={e => setData(`testi_${i}_text`, e.target.value)} rows={2} className="w-full px-3 py-2 text-sm italic bg-white border border-slate-300 rounded focus:border-blue-500 outline-none resize-none" placeholder="Teks kutipan testimoni..."></textarea>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input type="text" value={data[`testi_${i}_author`]} onChange={e => setData(`testi_${i}_author`, e.target.value)} className="w-full px-3 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded focus:border-blue-500 outline-none" placeholder="Nama Author" />
                                                    <input type="text" value={data[`testi_${i}_role`]} onChange={e => setData(`testi_${i}_role`, e.target.value)} className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-blue-500 outline-none" placeholder="Jabatan / Instansi" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="xl:col-span-1 hidden xl:block">
                        <div className="sticky top-6">
                            <h3 className="text-sm font-bold text-[#8B93A8] uppercase tracking-wider mb-4 flex items-center gap-2">
                                <MonitorPlay className="w-4 h-4" /> Live Preview
                            </h3>
                            
                            <div className="bg-[#0F1729] rounded-2xl overflow-hidden shadow-lg border border-[#1B2742]">
                                {/* Mock Header */}
                                <div className="h-10 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                                </div>
                                
                                {/* Mock Hero Body */}
                                <div className="p-6 text-center">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B8935F]/20 text-[#D4AF7A] text-[10px] font-bold mb-4">
                                        <Sparkles className="w-3 h-3" /> AkademiaOS 2.0
                                    </span>
                                    <h1 className="text-xl font-serif font-bold text-white leading-tight mb-3">
                                        {data.hero_title || 'Judul Utama Tampil di Sini'}
                                    </h1>
                                    <p className="text-[11px] text-[#A9B2C7] leading-relaxed mb-6 line-clamp-3">
                                        {data.hero_subtitle || 'Sub-judul akan ditampilkan di sini.'}
                                    </p>
                                    <div className="w-full h-8 bg-blue-600 rounded text-white text-[10px] font-bold flex items-center justify-center">
                                        Mulai Demo Gratis
                                    </div>
                                </div>

                                {/* Mock Features */}
                                <div className="bg-white p-5 space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 text-xs font-bold">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-[11px] font-bold text-[#0F1729]">{data[`feature_${i}_title`] || `Fitur ${i}`}</h4>
                                                <p className="text-[9px] text-[#8B93A8] leading-tight line-clamp-2 mt-0.5">
                                                    {data[`feature_${i}_desc`] || `Deskripsi fitur ${i}...`}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <p className="text-[10px] text-center text-[#8B93A8] mt-4">
                                Preview ini bersifat real-time. Klik "Simpan" untuk menerapkan ke website publik secara utuh.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}