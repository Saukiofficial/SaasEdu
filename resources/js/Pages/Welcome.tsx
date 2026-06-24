import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { 
    CheckCircle2, Users, BookOpen, FileSpreadsheet, 
    Banknote, PieChart, CalendarDays, ShieldCheck, 
    Building2, ArrowRight, Award, Globe, ChevronDown
} from 'lucide-react';

// --- KAMUS TERJEMAHAN (DICTIONARY) ---
const translations: Record<string, Record<string, string>> = {
    en: {
        'Produk': 'Products',
        'Fitur Utama': 'Main Features',
        'Pencapaian': 'Achievements',
        'Testimoni': 'Testimonials',
        'Harga Paket': 'Pricing',
        'Artikel': 'Articles',
        'Masuk (Login)': 'Sign In',
        'Coba Gratis': 'Try for Free',
        'Coba Gratis Sekarang': 'Try for Free Now',
        'Jadwalkan Demo': 'Schedule Demo',
        'Telah dipercaya oleh institusi di seluruh Indonesia': 'Trusted by institutions across Indonesia',
        'Produk & Solusi': 'Products & Solutions',
        'Fitur Modul Lengkap': 'Complete Module Features',
        'Satu platform untuk semua kebutuhan': 'One platform for all your needs',
        'Digitalisasi penuh dari pendaftaran siswa hingga kelulusan dalam satu pintu.': 'Full digitalization from student registration to graduation in one place.',
        'Testimoni Klien': 'Client Testimonials',
        'Dipercaya oleh institusi terkemuka': 'Trusted by leading institutions',
        'Daftar Harga': 'Pricing List',
        'Transparan sesuai kebutuhan Anda': 'Transparent pricing for your needs',
        'Pilih paket langganan yang cocok dengan skala operasional sekolah Anda.': 'Choose a subscription plan that fits your school\'s operational scale.',
        'Paling Laris': 'Most Popular',
        'Mulai Berlangganan': 'Start Subscription',
        'Artikel & Berita': 'Articles & News',
        'Informasi Terbaru': 'Latest Information',
        'Ikuti perkembangan terbaru dan wawasan menarik seputar dunia pendidikan digital.': 'Follow the latest developments and interesting insights around digital education.',
        'Baca Selengkapnya': 'Read More',
        'Belum ada artikel yang dipublikasikan saat ini. Silakan kembali lagi nanti!': 'No articles published currently. Please check back later!',
        'Siap untuk memajukan sekolah Anda?': 'Ready to advance your school?',
        'Bergabunglah dengan institusi lain yang telah mempercayakan manajemennya kepada kami.': 'Join other institutions that have entrusted their management to us.',
        'Buat Akun Gratis': 'Create a Free Account',
        'Informasi': 'Information',
        'Pusat Bantuan': 'Help Center',
        'Hubungi Kami': 'Contact Us',
        'Kebijakan Privasi': 'Privacy Policy',
        'Syarat & Ketentuan': 'Terms & Conditions',
        'Dibuat dengan': 'Made with',
        'untuk pendidikan': 'for education',
        'Seluruh hak cipta dilindungi.': 'All rights reserved.',
        'Pilih Bahasa': 'Select Language',
        'bulan': 'month',
        'tahun': 'year',
        'Maksimal': 'Maximum',
        'Siswa': 'Students',
        'Kapasitas': 'Capacity',
        'Belum ada paket harga yang dikonfigurasi.': 'No pricing packages configured yet.'
    }
};

export default function Welcome({ landingData, packages, blogs, products, app_name }: { landingData: any, packages: any[], blogs?: any[], products?: any[], app_name: string }) {
    const { props } = usePage<any>();
    
    // --- VARIABEL & STATE UNTUK LANGUAGE SWITCHER ---
    const currentLocale = props?.locale || 'id';
    const availableLanguages = props?.available_languages || [];
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

    const handleLanguageSwitch = (code: string) => {
        router.post('/language/switch', { code: code }, {
            preserveScroll: true,
            onSuccess: () => setIsLangMenuOpen(false)
        });
    };

    // Fungsi helper untuk menerjemahkan teks
    const t = (key: string) => {
        const localeStr = String(currentLocale).toLowerCase();
        const langKey = localeStr.startsWith('en') ? 'en' : 'id'; 

        if (langKey !== 'id' && translations[langKey] && translations[langKey][key]) {
            return translations[langKey][key];
        }
        return key; 
    };
    // ------------------------------------------------
    
    // Parse CMS Data
    const partners = [1, 2, 3, 4, 5].map(i => ({
        name: landingData[`partner_${i}_name`],
        logo: landingData[`partner_${i}_logo`]
    })).filter(p => p.name || p.logo);

    const features = [1, 2, 3, 4, 5, 6].map(i => ({
        title: landingData[`feature_${i}_title`],
        desc: landingData[`feature_${i}_desc`]
    }));

    const stats = [1, 2, 3, 4].map(i => ({
        value: landingData[`stat_${i}_value`],
        label: landingData[`stat_${i}_label`]
    }));

    const testimonials = [1, 2, 3].map(i => ({
        text: landingData[`testi_${i}_text`],
        author: landingData[`testi_${i}_author`],
        role: landingData[`testi_${i}_role`]
    }));

    const featureIcons = [Users, BookOpen, FileSpreadsheet, Banknote, PieChart, CalendarDays];
    const featureColors = ['blue', 'emerald', 'purple', 'amber', 'rose', 'indigo'];
    const statIcons = [Building2, Users, Banknote, CheckCircle2];

    const renderHeroTitle = (title: string) => {
        const words = title.split(' ');
        if (words.length <= 2) return title;
        const lastTwoWords = words.slice(-2).join(' ');
        const initialWords = words.slice(0, -2).join(' ');
        return (
            <>
                {initialWords} <span className="text-blue-600">{lastTwoWords}</span>
            </>
        );
    };

    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
    };

    const stripHtml = (html: string) => {
        if (!html) return '';
        return html.replace(/<[^>]*>?/gm, '');
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 overflow-x-hidden">
            <Head title={`${app_name} - Software Manajemen Pendidikan Modern`} />

            {/* Custom CSS untuk Animasi Marquee Partner */}
            <style>
                {`
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    display: flex;
                    width: max-content;
                    animation: marquee 25s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
                `}
            </style>

            {/* --- NAVBAR --- */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                                {app_name.charAt(0)}
                            </div>
                            <span className="font-bold text-xl tracking-tight text-slate-900">{app_name}</span>
                        </div>

                        {/* Center Links */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#produk" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">{t('Produk')}</a>
                            <a href="#fitur" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">{t('Fitur Utama')}</a>
                            <a href="#statistik" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">{t('Pencapaian')}</a>
                            <a href="#harga" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">{t('Harga Paket')}</a>
                            <a href="#artikel" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">{t('Artikel')}</a>
                        </div>

                        {/* Actions: Lang Switcher & CTA Buttons */}
                        <div className="flex items-center gap-4">
                            
                            {/* --- LANGUAGE SWITCHER DROPDOWN --- */}
                            {availableLanguages.length > 0 && (
                                <div className="relative hidden sm:block">
                                    <button 
                                        onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 transition-colors border border-transparent"
                                    >
                                        <Globe className="w-4 h-4 text-slate-600" />
                                        <span className="text-xs font-semibold text-slate-600 uppercase">
                                            {currentLocale}
                                        </span>
                                        <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
                                    </button>

                                    {isLangMenuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setIsLangMenuOpen(false)}></div>
                                            <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-2 overflow-hidden">
                                                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('Pilih Bahasa')}</p>
                                                </div>
                                                {availableLanguages.map((lang: any) => (
                                                    <button
                                                        key={lang.code}
                                                        onClick={() => handleLanguageSwitch(lang.code)}
                                                        className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                                                            currentLocale === lang.code 
                                                                ? 'bg-blue-50 text-blue-700 font-semibold' 
                                                                : 'text-slate-600 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        <span>{lang.name}</span>
                                                        <span className="text-[9px] font-mono text-gray-400 uppercase border border-gray-200 px-1 rounded">
                                                            {lang.code}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            <Link href="/login" className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                                {t('Masuk (Login)')}
                            </Link>
                            <Link href="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                                {t('Coba Gratis')}
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] rounded-full bg-blue-50/70 blur-3xl -z-10 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                        <div className="max-w-2xl">
                            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
                                {renderHeroTitle(landingData.hero_title)}
                            </h1>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl">
                                {landingData.hero_subtitle}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 mb-10">
                                <Link href="/register" className="flex justify-center items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                                    {t('Coba Gratis Sekarang')} <ArrowRight className="w-5 h-5" />
                                </Link>
                                <button className="flex justify-center items-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-slate-50 transition-all">
                                    {t('Jadwalkan Demo')}
                                </button>
                            </div>
                        </div>

                        {/* Mockup / Dashboard Preview */}
                        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                            <div className="relative rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/10]">
                                <div className="flex items-center px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                    </div>
                                    <div className="mx-auto bg-white border border-slate-200 rounded-md h-6 w-1/2 flex items-center justify-center">
                                        <div className="w-20 h-1.5 bg-slate-200 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="w-32 h-4 bg-slate-200 rounded mb-6"></div>
                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div className="h-20 rounded-xl border border-slate-100 bg-slate-50"></div>
                                        <div className="h-20 rounded-xl border border-slate-100 bg-slate-50"></div>
                                        <div className="h-20 rounded-xl border border-slate-100 bg-slate-50"></div>
                                    </div>
                                    <div className="h-40 rounded-xl border border-slate-100 bg-blue-50/30 flex items-end p-4">
                                        <div className="w-full h-24 bg-gradient-to-t from-blue-100 to-transparent rounded-t-xl opacity-50"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-100 rounded-full blur-2xl -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- TRUSTED BY LOGOS (MARQUEE ANIMATION) --- */}
            {partners.length > 0 && (
                <section className="py-10 border-y border-slate-100 bg-slate-50/50 overflow-hidden">
                    <div className="max-w-7xl mx-auto text-center mb-6">
                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{t('Telah dipercaya oleh institusi di seluruh Indonesia')}</p>
                    </div>
                    <div className="relative w-full overflow-hidden flex items-center h-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="animate-marquee gap-16 px-8 items-center">
                            {partners.map((partner, index) => (
                                <div key={index} className="flex items-center gap-3 shrink-0">
                                    {partner.logo ? (
                                        <img src={partner.logo} alt={partner.name} className="h-10 w-auto object-contain" />
                                    ) : (
                                        <ShieldCheck className="w-8 h-8 text-slate-800" />
                                    )}
                                    {partner.name && <span className="text-xl font-serif font-bold text-slate-800">{partner.name}</span>}
                                </div>
                            ))}
                            {partners.map((partner, index) => (
                                <div key={`dup-${index}`} className="flex items-center gap-3 shrink-0">
                                    {partner.logo ? (
                                        <img src={partner.logo} alt={partner.name} className="h-10 w-auto object-contain" />
                                    ) : (
                                        <ShieldCheck className="w-8 h-8 text-slate-800" />
                                    )}
                                    {partner.name && <span className="text-xl font-serif font-bold text-slate-800">{partner.name}</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* --- PRODUCT SECTION (DAFTAR PRODUK & SOLUSI) --- */}
            <section id="produk" className="py-24 bg-[#F8FAFC]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">{t('Produk & Solusi')}</h2>
                        <p className="text-slate-500 max-w-3xl mx-auto text-lg">
                            {app_name} menghadirkan berbagai solusi untuk membantu transformasi layanan secara digital.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {products && products.length > 0 ? (
                            products.map((prod: any) => (
                                <div key={prod.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-slate-100 flex flex-col">
                                    <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                                        {prod.thumbnail_url ? (
                                            <img src={prod.thumbnail_url} alt={prod.name} className="w-full h-full object-cover mix-blend-multiply opacity-90" />
                                        ) : (
                                            <span className="text-slate-400">No Image</span>
                                        )}
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold text-slate-800 rounded-lg">Pilihan Terbaik</div>
                                    </div>
                                    <div className="p-8 text-center flex flex-col flex-1">
                                        <h3 className="text-xl font-bold text-slate-900 mb-3">{prod.name}</h3>
                                        <p className="text-slate-500 mb-8 flex-1 text-sm line-clamp-3">{prod.subtitle}</p>
                                        <Link href={`/product/${prod.slug}`} className="inline-block w-full py-3 px-4 border border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors">
                                            Selengkapnya
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center text-slate-500 py-10">Produk sedang disiapkan.</div>
                        )}
                    </div>
                </div>
            </section>

            {/* --- FEATURES SECTION (DINAMIS DARI CMS) --- */}
            <section id="fitur" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-widest uppercase mb-4">{t('Fitur Modul Lengkap')}</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">{t('Satu platform untuk semua kebutuhan')}</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto mb-16 text-lg">{t('Digitalisasi penuh dari pendaftaran siswa hingga kelulusan dalam satu pintu.')}</p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                        {features.map((feature, idx) => {
                            const Icon = featureIcons[idx % featureIcons.length];
                            const colorName = featureColors[idx % featureColors.length];
                            const bgClass = `bg-${colorName}-50`;
                            const textClass = `text-${colorName}-600`;
                            const borderHoverClass = `hover:border-${colorName}-200`;

                            return (
                                <div key={idx} className={`p-8 rounded-2xl bg-white border border-slate-100 ${borderHoverClass} hover:shadow-xl hover:shadow-slate-200 transition-all group`}>
                                    <div className={`w-12 h-12 rounded-xl ${bgClass} ${textClass} flex items-center justify-center mb-6 transition-colors`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                    <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* --- STATS SECTION (DINAMIS DARI CMS) --- */}
            <section id="statistik" className="py-12 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-x divide-blue-200/50">
                        {stats.map((stat, idx) => {
                            const SIcon = statIcons[idx % statIcons.length];
                            return (
                                <div key={idx} className="flex flex-col items-center justify-center gap-2">
                                    <SIcon className="w-8 h-8 text-blue-600/50" />
                                    <div className="text-3xl font-extrabold text-slate-900 mt-2">{stat.value}</div>
                                    <div className="text-sm font-medium text-slate-500">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* --- TESTIMONIALS (DINAMIS DARI CMS) --- */}
            <section id="testimoni" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-widest uppercase mb-4">{t('Testimoni Klien')}</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-16">{t('Dipercaya oleh institusi terkemuka')}</h2>

                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        {testimonials.map((testi, idx) => (
                            <div key={idx} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between hover:shadow-lg transition-shadow">
                                <p className="text-slate-700 leading-relaxed italic mb-8">"{testi.text}"</p>
                                <div className="flex items-center gap-4 mt-auto">
                                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xl shrink-0">
                                        {testi.author.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{testi.author}</h4>
                                        <p className="text-xs text-slate-500">{testi.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- PRICING SECTION (TERHUBUNG KE DATABASE SUBSCRIPTION_PACKAGES) --- */}
            <section id="harga" className="py-24 bg-slate-50 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-widest uppercase mb-4">{t('Daftar Harga')}</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">{t('Transparan sesuai kebutuhan Anda')}</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto mb-16 text-lg">{t('Pilih paket langganan yang cocok dengan skala operasional sekolah Anda.')}</p>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left items-center">
                        {packages && packages.length > 0 ? (
                            packages.map((pkg: any) => (
                                <div key={pkg.id} className={`bg-white rounded-3xl p-8 border ${pkg.is_popular ? 'border-blue-600 shadow-xl relative transform md:-translate-y-4 border-2' : 'border-slate-200 shadow-sm'}`}>
                                    {pkg.is_popular && (
                                        <div className="absolute top-0 right-8 transform -translate-y-1/2">
                                            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{t('Paling Laris')}</span>
                                        </div>
                                    )}
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-4xl font-extrabold text-slate-900">
                                            {formatRupiah(pkg.price)}
                                        </span>
                                        <span className="text-sm font-medium text-slate-500">
                                            /{pkg.billing_cycle === 'monthly' ? t('bulan') : pkg.billing_cycle === 'yearly' ? t('tahun') : t('lifetime')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-6 min-h-[40px]">{pkg.description}</p>

                                    <ul className="space-y-4 mb-8 text-sm text-slate-700">
                                        <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> {t('Maksimal')} <strong>{pkg.max_students} {t('Siswa')}</strong></li>
                                        <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> {t('Kapasitas')} <strong>{(pkg.storage_limit_mb / 1024).toFixed(1)} GB</strong> Storage</li>
                                        {pkg.features && Array.isArray(pkg.features) && pkg.features.slice(0, 3).map((feat: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> <span className="leading-tight">{feat}</span></li>
                                        ))}
                                    </ul>

                                    <Link href={`/register?package_id=${pkg.id}`} className={`w-full flex items-center justify-center py-3 px-4 rounded-xl font-bold transition-all ${pkg.is_popular ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30' : 'border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}>
                                        {t('Mulai Berlangganan')}
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center p-8">
                                <p className="text-slate-500">{t('Belum ada paket harga yang dikonfigurasi.')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* --- LATEST BLOGS / ARTIKEL SECTION --- */}
            <section id="artikel" className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-widest uppercase mb-4">{t('Artikel & Berita')}</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">{t('Informasi Terbaru')}</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg">{t('Ikuti perkembangan terbaru dan wawasan menarik seputar dunia pendidikan digital.')}</p>
                    </div>

                    {blogs && blogs.length > 0 ? (
                        <div className="grid md:grid-cols-3 gap-8">
                            {blogs.map((blog: any) => (
                                <div key={blog.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-slate-200 transition-all duration-300 group flex flex-col">
                                    <div className="aspect-video w-full overflow-hidden bg-slate-50 relative">
                                        {blog.thumbnail ? (
                                            <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <BookOpen className="w-12 h-12 text-slate-300" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="text-xs font-semibold text-blue-600 mb-3 uppercase tracking-wider">
                                            {new Date(blog.created_at).toLocaleDateString(currentLocale, { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {blog.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                                            {stripHtml(blog.content).substring(0, 150)}...
                                        </p>
                                        <Link href={`#`} className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors mt-auto">
                                            {t('Baca Selengkapnya')} <ArrowRight className="w-4 h-4 ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 max-w-2xl mx-auto">
                            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500">{t('Belum ada artikel yang dipublikasikan saat ini. Silakan kembali lagi nanti!')}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* --- CTA BANNER --- */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-900/20 text-center md:text-left">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">{t('Siap untuk memajukan sekolah Anda?')}</h2>
                            <p className="text-blue-100 text-lg">{t('Bergabunglah dengan institusi lain yang telah mempercayakan manajemennya kepada kami.')}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                            <Link href="/register" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg">{t('Buat Akun Gratis')}</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-[#0B1120] pt-20 pb-10 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">
                        <div className="col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">{app_name.charAt(0)}</div>
                                <span className="font-bold text-xl tracking-tight text-white">{app_name}</span>
                            </div>
                            <p className="text-slate-400 text-sm mb-6 max-w-xs leading-relaxed">
                                {landingData.hero_subtitle.substring(0, 100)}...
                            </p>
                            <div className="flex gap-4 text-slate-400">
                                <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                                </a>
                                <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                                </a>
                                <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-6">{t('Produk')}</h4>
                            <ul className="space-y-4 text-sm text-slate-400">
                                <li><a href="#produk" className="hover:text-blue-400 transition-colors">{t('Produk & Solusi')}</a></li>
                                <li><a href="#fitur" className="hover:text-blue-400 transition-colors">{t('Fitur Utama')}</a></li>
                                <li><a href="#harga" className="hover:text-blue-400 transition-colors">{t('Harga Paket')}</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-6">{t('Informasi')}</h4>
                            <ul className="space-y-4 text-sm text-slate-400">
                                <li><a href="#artikel" className="hover:text-blue-400 transition-colors">{t('Artikel & Berita')}</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">{t('Pusat Bantuan')}</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">{t('Hubungi Kami')}</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                        <p>© 2026 {app_name}. {t('Seluruh hak cipta dilindungi.')}</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white transition-colors">{t('Kebijakan Privasi')}</a>
                            <a href="#" className="hover:text-white transition-colors">{t('Syarat & Ketentuan')}</a>
                        </div>
                        <p className="flex items-center gap-1">{t('Dibuat dengan')} <span className="text-red-500">♥</span> {t('untuk pendidikan')}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
