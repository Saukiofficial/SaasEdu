import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Check, ShieldCheck,
    MonitorSmartphone, MessageSquare, Settings, Minus, Plus, Smartphone,
    Building2, BarChart3, BookOpen, Landmark, GraduationCap, TrendingUp,
    PieChart, Star,
} from 'lucide-react';

export default function ProductDetail({ product, app_name }: { product: any, app_name: string }) {
    // --- LOGIKA UNTUK SLIDER LAPTOP ---
    const [currentSlide, setCurrentSlide] = useState(0);

    // Jika admin belum mengupload screenshot, kita sediakan gambar fallback
    const screenshots = product.screenshots && product.screenshots.length > 0
        ? product.screenshots
        : [
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80'
          ];

    const nextSlide = () => setCurrentSlide((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));

    // Auto-slide setiap 5 detik
    useEffect(() => {
        const timer = setInterval(() => nextSlide(), 5000);
        return () => clearInterval(timer);
    }, [screenshots.length]);

    // Parse Features dari Database — dipakai pada grid fitur utama (ikon bulat + judul + deskripsi)
    const features = product.features || [
        { title: 'SIM Sekolah', description: 'Sekolah akan memiliki website yang selalu terupdate sesuai dengan kegiatan belajar mengajar.' },
        { title: 'e-Rapor', description: 'Pantau nilai siswa dengan e-Rapor, administrasi penilaian siswa lebih mudah dan efisien.' },
        { title: 'Perpus Digital', description: 'Akses ke perpustakaan digital yang memungkinkan siswa dan guru meminjam dan membaca buku secara online.' },
        { title: 'CBT', description: 'Ujian berbasis komputer, ujian online yang cepat dan interaktif dengan penilaian otomatis.' },
        { title: 'PPDB', description: 'Memfasilitasi pendaftaran peserta didik baru secara online dengan proses seleksi yang lebih mudah.' },
        { title: 'Absensi Online', description: 'Sistem ini mencatat kehadiran siswa dan guru secara otomatis menggunakan QR code atau RFID.' },
    ];

    // Ikon bulat untuk tiap fitur, dirotasi mengikuti urutan data backend (tampilan saja, bukan data)
    const featureIcons = [Building2, BarChart3, BookOpen, Landmark, GraduationCap, Smartphone];

    // --- KONTEN DUMMY: kategori layanan (statis, sesuai referensi) ---
    const categories = [
        { icon: Building2, label: 'Kelembagaan' },
        { icon: MonitorSmartphone, label: 'Teknologi' },
        { icon: BarChart3, label: 'Statistik' },
        { icon: BookOpen, label: 'Pustaka' },
        { icon: Landmark, label: 'Institusi' },
        { icon: GraduationCap, label: 'Akademik' },
    ];

    // --- KONTEN DUMMY: accordion "Mengapa Memilih Kami" ---
    const [openAccordion, setOpenAccordion] = useState(0);
    const whyChooseUs = [
        { title: 'Hemat Anggaran', desc: 'Dengan standar layanan profesional, Anda mendapat website sekolah terbaik tanpa menguras anggaran.' },
        { title: 'Meningkatkan Kredibilitas Sekolah', desc: 'Website resmi membuat citra lembaga pendidikan Anda terlihat lebih terpercaya di mata orang tua dan calon siswa.' },
        { title: 'Transparansi Biaya', desc: 'Tidak ada biaya tersembunyi, semua rincian paket dijelaskan secara terbuka sejak awal.' },
        { title: 'Keamanan Website Terjamin', desc: 'Dilindungi sistem keamanan berlapis untuk menjaga data sekolah, guru, dan siswa tetap aman.' },
        { title: 'Pengalaman dan Terpercaya', desc: 'Telah dipercaya oleh banyak lembaga pendidikan dari berbagai jenjang di seluruh Indonesia.' },
        { title: 'Proses Cepat Hasil Maksimal', desc: 'Website Anda dapat aktif dalam waktu singkat tanpa mengurangi kualitas hasil akhir.' },
        { title: 'Fitur yang Fleksibel', desc: 'Setiap modul dapat disesuaikan dengan kebutuhan dan karakteristik sekolah Anda.' },
        { title: 'Desain Eksklusif', desc: 'Tampilan website dirancang khusus agar berbeda dan mencerminkan identitas sekolah Anda.' },
        { title: 'Jangkauan Sekolah Luas', desc: 'Telah digunakan oleh sekolah dari jenjang SD hingga Perguruan Tinggi di berbagai daerah.' },
        { title: 'Gratis Pelatihan Pengelolaan', desc: 'Tim kami membekali admin sekolah agar mampu mengelola website secara mandiri.' },
        { title: 'Pengelolaan Mudah Tanpa Keahlian IT', desc: 'Antarmuka yang sederhana membuat siapa pun dapat mengelola website tanpa latar belakang teknis.' },
        { title: 'Bantuan Teknis', desc: 'Tim support kami siap membantu setiap kendala teknis yang dihadapi sekolah Anda.' },
    ];

    // --- KONTEN DUMMY: paket harga (statis, sesuai referensi) ---
    const pricingPlans: Array<{
        name: string;
        tagline: string;
        price: string;
        period: string;
        highlight: boolean;
        badge: string | null;
        features: string[];
    }> = [
        {
            name: 'Web Sekolah',
            tagline: 'Untuk Lembaga Pendidikan Umum, SD, SMP, SHK, Kampus',
            price: 'Rp 1jt',
            period: '/ Thn',
            highlight: false,
            badge: null,
            features: [
                'Gratis Biaya Pembuatan Web Senilai Rp 2,5 jt',
                'Domain Resmi .sch.id',
                'Masa Aktif Selama 1 Tahun',
                'Fitur Sesuai Demo',
                'Perlindungan Dari Virus',
                'Perlindungan Dari Hacker',
                'Tutorial Mengelola Website',
            ],
        },
        {
            name: 'Portal Sekolah',
            tagline: 'Handle Semua Kebutuhan Sekolah Dalam Satu Aplikasi',
            price: 'Rp 5rb',
            period: '/ Siswa (Aktif)',
            highlight: true,
            badge: 'MyPortal Mihapeschool (Versi Pro)',
            features: [
                'Domain Resmi .sch.id',
                'Fitur Pro Kelola Data',
                'Handle Semua Kebutuhan Sekolah Dalam 1 Aplikasi',
                'Identitas Disesuaikan Dengan Sekolah',
                'Manajemen Role Akses',
                'Free Update',
                'Free Maintenance 24/7',
                'Perlindungan Dari Virus',
                'Perlindungan Dari Hacker',
                'Auto Backup',
                'Tutorial / Dokumentasi Lengkap',
            ],
        },
        {
            name: 'Web Custome',
            tagline: 'Buat Web Sesuai Request',
            price: 'Rp Negosiasi',
            period: '',
            highlight: false,
            badge: null,
            features: [
                'Fitur Bebas Request',
                'Sesuaikan Dengan Kebutuhan Sekolah',
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-[#FDFDFC] font-sans text-slate-900 overflow-x-hidden">
            <Head title={`${product.name} - ${app_name}`} />

            {/* --- NAVBAR --- */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                                {app_name.charAt(0)}
                            </div>
                            <span className="font-bold text-xl tracking-tight text-slate-900">{app_name}</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-8">
                            <Link href="/#produk" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Produk</Link>
                            <Link href="/#fitur" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Fitur Utama</Link>
                            <Link href="/#harga" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Harga Paket</Link>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link href="/login" className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                                Masuk
                            </Link>
                            <Link href="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-md">
                                Pesan Sekarang
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -z-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="max-w-xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-widest uppercase mb-6">
                                <ShieldCheck className="w-4 h-4" /> Let's Go!
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.2] mb-6">
                                {product.name}
                            </h1>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                {product.subtitle}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/register" className="flex justify-center items-center gap-2 bg-[#0F172A] text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-slate-800 transition-all shadow-lg">
                                    Coba Gratis Sekarang <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>

                        {/* Ilustrasi hero — dummy, menggantikan foto unsplash dengan kartu statistik bertema KBM */}
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-slate-50 flex items-center justify-center relative">
                                {product.thumbnail_url ? (
                                    <img src={product.thumbnail_url} alt="Preview Produk" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <img src={screenshots[0]} alt="Preview" className="w-full h-full object-cover" />
                                        {/* Floating widget dummy ala referensi */}
                                        <div className="absolute top-6 left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-slate-100">
                                            <div className="relative w-14 h-14 shrink-0">
                                                <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
                                                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="#E2E8F0" strokeWidth="3.5" />
                                                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="#2563EB" strokeWidth="3.5" strokeDasharray="97.4" strokeDashoffset="24.3" strokeLinecap="round" />
                                                </svg>
                                                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-blue-600">75%</span>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-900">KBM</p>
                                                <p className="text-[10px] text-slate-500 leading-tight">Efisiensi<br />Kegiatan Belajar Mengajar</p>
                                                <span className="inline-block mt-1 text-[9px] bg-emerald-100 text-emerald-600 font-semibold px-2 py-0.5 rounded-full">Optimalisasi</span>
                                            </div>
                                        </div>
                                        <div className="absolute top-6 right-6 flex gap-2">
                                            <div className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-amber-500">
                                                <PieChart className="w-4 h-4" />
                                            </div>
                                            <div className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-emerald-500">
                                                <TrendingUp className="w-4 h-4" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl px-5 py-3 flex items-center gap-5 border border-slate-100">
                                            <div className="text-center">
                                                <p className="text-base font-extrabold text-slate-900">80</p>
                                                <p className="text-[9px] text-slate-400">Performa</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-base font-extrabold text-slate-900">90</p>
                                                <p className="text-[9px] text-slate-400">Maintenance</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-base font-extrabold text-slate-900">85</p>
                                                <p className="text-[9px] text-slate-400">Analisa</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- STRIP KATEGORI (dummy) --- */}
            <section className="pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-blue-100/70 rounded-2xl py-6 px-6 flex items-center justify-center gap-4 sm:gap-8 overflow-x-auto">
                        {categories.map((cat, idx) => {
                            const Icon = cat.icon;
                            const palette = ['bg-orange-200 text-orange-600', 'bg-violet-200 text-violet-600', 'bg-emerald-200 text-emerald-600', 'bg-indigo-200 text-indigo-600', 'bg-amber-200 text-amber-600', 'bg-sky-200 text-sky-600'];
                            return (
                                <div key={idx} className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl shrink-0 flex items-center justify-center ${palette[idx % palette.length]}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* --- BANNER JASA WEBSITE PENDIDIKAN (dummy) --- */}
            <section className="pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-10 items-center">
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-[2rem] bg-gradient-to-br from-blue-500 to-blue-700 overflow-hidden relative flex items-center justify-center">
                                <img src={screenshots[1] || screenshots[0]} alt="Jasa Website Pendidikan" className="w-full h-full object-cover opacity-90" />
                                <div className="absolute bottom-0 left-0 right-0 bg-blue-700/95 px-6 py-4">
                                    <p className="text-white font-extrabold text-lg leading-tight">JASA WEBSITE PENDIDIKAN</p>
                                    <p className="text-blue-100 text-sm">Desain Profesional & Mudah Dikelola</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <span className="inline-block bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full mb-4">Solusi Website Tanpa Biaya Tinggi</span>
                            <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mb-4 leading-snug">Website Pendidikan Dari SD Hingga Universitas</h2>
                            <p className="text-slate-500 mb-3 leading-relaxed">Website adalah jembatan penting untuk memperkenalkan lembaga, menyampaikan informasi, hingga menjangkau lebih banyak orang.</p>
                            <p className="text-slate-700 font-medium mb-6 leading-relaxed">Kami hadir untuk mewujudkan impian Anda. Dengan program ini, kami menawarkan pembuatan website lembaga pendidikan yang modern, lengkap, aman dengan layanan pemeliharaan agar website selalu aktif, serta murah.</p>
                            <Link href="/register" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-md">
                                Informasi Lebih Lanjut
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- BENEFIT HIGHLIGHTS --- */}
            <section className="py-12 border-y border-slate-100 bg-slate-50 relative z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-start">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0"><MonitorSmartphone className="w-6 h-6" /></div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">Website Profesional</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">Dapatkan website modern yang fungsional untuk lembaga Anda, dengan budget kurang dari 1jt-an saja.</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-start">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0"><MessageSquare className="w-6 h-6" /></div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">Gratis Konsultasi</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">Untuk mendukung lembaga pendidikan "Go Digital", kami tidak membebankan biaya konsultasi.</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-start">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0"><Settings className="w-6 h-6" /></div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">Gratis Maintenance</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">Sesuaikan nama domain dengan sekolah Anda, hosting handal dan perlindungan web yang maksimal.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FITUR DINAMIS + MOCKUP LAPTOP SECTION (data backend: features) --- */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 max-w-3xl mx-auto leading-snug">
                            Solusi Untuk Sekolah Digital yang Efisien, Terintegrasi, Dengan Beragam Fitur Unggulan
                        </h2>
                    </div>

                    <div className="grid lg:grid-cols-[1fr_420px_1fr] gap-x-8 gap-y-10 items-center">
                        {/* Kolom kiri: separuh pertama fitur backend */}
                        <div className="flex flex-col gap-10 order-1">
                            {features.slice(0, Math.ceil(features.length / 2)).map((feat: any, idx: number) => {
                                const Icon = featureIcons[idx % featureIcons.length];
                                return (
                                    <div key={idx} className="flex items-start gap-4 lg:text-right lg:flex-row-reverse">
                                        <div className="w-12 h-12 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-1">{feat.title}</h3>
                                            <p className="text-sm text-slate-500 leading-relaxed">{feat.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Mockup Laptop di tengah — menampilkan screenshot dari backend secara utuh (object-contain) */}
                        <div className="order-3 lg:order-2 flex justify-center">
                            <div className="w-full max-w-[420px]">
                                {/* Layar laptop */}
                                <div className="relative pt-[62%] bg-slate-900 rounded-t-xl border-[6px] border-slate-900 shadow-2xl overflow-hidden">
                                    <div className="absolute inset-0 bg-white flex items-center justify-center">
                                        <img
                                            src={screenshots[currentSlide % screenshots.length]}
                                            alt="Preview Aplikasi"
                                            className="w-full h-full object-contain transition-opacity duration-700"
                                        />
                                    </div>
                                </div>
                                {/* Base laptop */}
                                <div className="relative h-3 w-[106%] -ml-[3%] bg-gradient-to-b from-slate-200 to-slate-400 rounded-b-lg shadow-xl flex justify-center">
                                    <div className="w-1/5 h-1 bg-slate-400/50 rounded-b-md"></div>
                                </div>
                            </div>
                        </div>

                        {/* Kolom kanan: separuh kedua fitur backend */}
                        <div className="flex flex-col gap-10 order-2 lg:order-3">
                            {features.slice(Math.ceil(features.length / 2)).map((feat: any, idx: number) => {
                                const Icon = featureIcons[(idx + Math.ceil(features.length / 2)) % featureIcons.length];
                                return (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-1">{feat.title}</h3>
                                            <p className="text-sm text-slate-500 leading-relaxed">{feat.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- GRID FITUR TAMBAHAN (dummy, sesuai referensi: KBM, Surat-Menyurat, Sarpras, dll) --- */}
            <section className="pb-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: BarChart3, title: 'KBM', desc: 'Orang Tua dapat memantau kegiatan belajar dan perkembangan prestasi Siswa.' },
                            { icon: MessageSquare, title: 'Surat-Menyurat', desc: 'Layanan surat-menyurat yang terintegrasi dengan administrasi sekolah.' },
                            { icon: Settings, title: 'Sarpras', desc: 'Sarana dan prasarana sekolah, semua tercatat dalam Sarpras.' },
                            { icon: GraduationCap, title: 'BKK & Tracer Study', desc: 'Bursa Kerja Khusus dan Tracer Study, kontrol alumni pada fitur BKK.' },
                            { icon: MessageSquare, title: 'e-Konseling', desc: 'Kontrol perkembangan siswa melalui fitur e-konseling.' },
                            { icon: Smartphone, title: 'Komunikasi', desc: 'Live chat, informasi kalender akademik, layanan komunikasi antar guru, siswa, dan orang tua.' },
                        ].map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="bg-blue-50 text-blue-600 w-11 h-11 rounded-xl flex items-center justify-center mb-4">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-1.5">{item.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* --- LAPTOP SLIDER SECTION (MOCKUP) — data backend: screenshots --- */}
            <section className="pt-4 pb-24 bg-white relative z-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Frame Laptop Mockup */}
                        <div className="relative mx-auto w-full max-w-[520px] z-10 group">
                            <div className="relative pt-[62.5%] sm:pt-[56.25%] bg-slate-900 rounded-t-2xl sm:rounded-t-3xl border-[8px] sm:border-[12px] border-slate-900 shadow-2xl overflow-hidden">
                                <div className="absolute inset-0 bg-slate-100 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                                    {screenshots.map((img: string, idx: number) => (
                                        <div key={idx} className="w-full h-full shrink-0 flex items-center justify-center bg-white relative">
                                            <img src={img} alt={`Screenshot ${idx + 1}`} className="absolute w-full h-full object-contain object-center" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative h-4 sm:h-5 w-[105%] -ml-[2.5%] bg-gradient-to-b from-slate-200 to-slate-400 rounded-b-xl sm:rounded-b-2xl shadow-xl flex justify-center">
                                <div className="w-1/6 h-1.5 bg-slate-400/50 rounded-b-md"></div>
                            </div>

                            <button
                                onClick={prevSlide}
                                className="absolute top-[40%] -left-4 sm:-left-12 -translate-y-1/2 p-3 bg-white/90 backdrop-blur rounded-full shadow-xl text-slate-600 hover:text-blue-600 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 z-20"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute top-[40%] -right-4 sm:-right-12 -translate-y-1/2 p-3 bg-white/90 backdrop-blur rounded-full shadow-xl text-slate-600 hover:text-blue-600 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 z-20"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>

                            <div className="flex justify-center gap-2 mt-6">
                                {screenshots.map((_: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentSlide(idx)}
                                        className={`h-2 rounded-full transition-all ${currentSlide === idx ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300 hover:bg-slate-400'}`}
                                    ></button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-widest uppercase mb-5">
                                Let's Go!
                            </div>
                            <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mb-4 leading-snug">
                                Tingkatkan Level Kualitas Sekolah Dengan Digitalisasi Sekolah Modern
                            </h2>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                Tingkatkan mutu layanan pendidikan di level satuan sekolah dengan penerapan digitalisasi sekolah sesuai rekomendasi Kemendikbud.
                            </p>
                            <Link href="/register" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-md">
                                Coba Gratis Sekarang
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- MENGAPA MEMILIH KAMI (accordion, dummy) --- */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4">Mengapa Memilih Kami Untuk Pembuatan Website Sekolah Anda?</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
                            Kami tidak hanya membuat website, tetapi juga menghadirkan solusi digital terbaik untuk layanan sekolah Anda. Berikut adalah alasan mengapa kami menjadi mitra yang sangat tepat.
                        </p>
                    </div>

                    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                        {whyChooseUs.map((item, idx) => {
                            const isOpen = openAccordion === idx;
                            return (
                                <div key={idx} className="border-b border-slate-200 last:border-b-0">
                                    <button
                                        onClick={() => setOpenAccordion(isOpen ? -1 : idx)}
                                        className={`w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors ${isOpen ? 'bg-[#0F4C81] text-white' : 'bg-sky-100 text-slate-800 hover:bg-sky-200'}`}
                                    >
                                        <span className="flex items-center gap-3 font-semibold text-sm sm:text-base">
                                            {isOpen ? <Minus className="w-4 h-4 shrink-0" /> : <Plus className="w-4 h-4 shrink-0" />}
                                            {item.title}
                                        </span>
                                        <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                                    </button>
                                    {isOpen && (
                                        <div className="px-5 py-4 bg-sky-50 text-sm text-slate-600 leading-relaxed">
                                            {item.desc}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* --- CTA BANNER dengan foto siswa (dummy) --- */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-[#0F4C81] rounded-2xl overflow-hidden grid md:grid-cols-2 items-center">
                        <div className="p-8 sm:p-10">
                            <h3 className="text-white text-xl sm:text-2xl font-extrabold mb-4 leading-snug">
                                Dapatkan Website Profesional Dengan Segudang Fitur dan Manfaat untuk Sekolah Anda.
                            </h3>
                            <p className="text-blue-100 text-sm leading-relaxed">
                                Jangan biarkan lembaga pendidikan Anda tertinggal di Era Digitalisasi, dengan layanan kami, Anda akan memiliki website sekolah profesional, modern dan fungsional.
                            </p>
                        </div>
                        <div className="h-56 sm:h-full">
                            <img
                                src={screenshots[2] || screenshots[0]}
                                alt="Siswa menggunakan platform sekolah digital"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PRICING TABLE (dummy, 3 paket) --- */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4">Wujudkan Website Profesional untuk Sekolah Anda Hari ini!</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">Konsultasi GRATIS dengan tim kami. Dapatkan demo dan penawaran khusus minggu ini.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 items-start">
                        {pricingPlans.map((plan, idx) => (
                            <div
                                key={idx}
                                className={`rounded-2xl overflow-hidden border ${plan.highlight ? 'border-blue-200 shadow-xl relative md:-translate-y-3' : 'border-slate-200 shadow-sm'} bg-white flex flex-col`}
                            >
                                {plan.highlight && (
                                    <span className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                        <Star className="w-3 h-3" /> Terpopuler
                                    </span>
                                )}
                                <div className={`px-6 py-5 ${plan.highlight ? 'bg-[#0F4C81] text-white' : 'bg-[#0F172A] text-white'}`}>
                                    <h3 className="font-bold text-lg">{plan.name}</h3>
                                    <p className={`text-xs mt-1 ${plan.highlight ? 'text-blue-100' : 'text-slate-300'}`}>{plan.tagline}</p>
                                </div>
                                <div className="px-6 pt-6 pb-2 text-center">
                                    {plan.badge && (
                                        <span className="inline-block text-[11px] font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3">{plan.badge}</span>
                                    )}
                                    <p className="text-2xl font-extrabold text-slate-900">
                                        {plan.price} <span className="text-sm font-medium text-slate-400">{plan.period}</span>
                                    </p>
                                </div>
                                <ul className="px-6 py-4 flex flex-col gap-3 flex-1">
                                    {plan.features.map((f, fIdx) => (
                                        <li key={fIdx} className="flex items-start gap-2 text-sm text-slate-600">
                                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="px-6 pb-6">
                                    <Link
                                        href="/register"
                                        className={`block text-center w-full py-3 rounded-xl text-sm font-semibold transition-all ${plan.highlight ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-[#0F172A] text-white hover:bg-slate-800'}`}
                                    >
                                        {plan.name === 'Web Custome' ? 'Konsultasi Sekarang' : 'Order Sekarang'}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA BANNER Bawah --- */}
            <section className="py-20 bg-[#0F172A]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Mulai Transformasi Digital Bersama Kami</h2>
                    <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">Tingkatkan efisiensi dan modernisasi layanan Anda sekarang juga.</p>
                    <Link href="/register" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900">
                        Konsultasi Gratis Sekarang <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-[#0F172A] pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid sm:grid-cols-3 gap-10 pb-10 border-b border-slate-700">
                        <div>
                            <Link href="/" className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                                    {app_name.charAt(0)}
                                </div>
                                <span className="font-bold text-xl tracking-tight text-white">{app_name}</span>
                            </Link>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                                Solusi digitalisasi sekolah terpadu untuk memudahkan dan mengoptimalkan proses belajar mengajar bagi semua elemen pendidikan.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">About</h4>
                            <ul className="flex flex-col gap-2 text-sm text-slate-400">
                                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                                <li><Link href="/team" className="hover:text-white transition-colors">Our Team</Link></li>
                                <li><Link href="/customers" className="hover:text-white transition-colors">Customers</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Get In Touch</h4>
                            <ul className="flex flex-col gap-2 text-sm text-slate-400">
                                <li>Kota Sumenep- Jawa Timur</li>
                                <li>+62 812-3291-6758</li>
                                <li>kyysolutions17@gmail.com</li>
                            </ul>
                        </div>
                    </div>
                    <p className="text-center text-xs text-slate-500 pt-6">© 2026 {app_name} | Powered by {app_name}</p>
                </div>
            </footer>
        </div>
    );
}