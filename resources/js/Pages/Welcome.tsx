import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { ArrowRight, BookOpen, Code} from 'lucide-react';

export default function Welcome({ landingData, packages, blogs, products, sourceCodes, app_name }: { landingData: any, packages: any[], blogs?: any[], products?: any[], sourceCodes?: any[], app_name: string }) {
    const { props } = usePage<any>();
    const currentLocale = props?.locale || 'id';
    const availableLanguages = props?.available_languages || [];
    
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [isScrolled, setIsScrolled] = useState(false);
    const terminalBodyRef = useRef<HTMLDivElement>(null);

    // Animasi Terminal (Meniru Vanilla JS dari referensi)
    useEffect(() => {
        let isRunning = true;
        const terminalScript = [
            {type:"cmd", text:"akademiaso deploy --product siakad"},
            {type:"out", text:"→ Menyiapkan modul KRS, presensi, nilai...", ok:false},
            {type:"out", text:"✓ SIAKAD aktif di kampus.akademiaso.id", ok:true},
            {type:"cmd", text:"akademiaso deploy --product umkm"},
            {type:"out", text:"→ Menyiapkan kasir, stok, laporan keuangan...", ok:false},
            {type:"out", text:"✓ Aplikasi UMKM aktif di toko.akademiaso.id", ok:true},
            {type:"cmd", text:"akademiaso source-code --get inventory-app"},
            {type:"out", text:"→ Mengunduh source code + dokumentasi...", ok:false},
            {type:"out", text:"✓ Source code siap di /project/inventory-app", ok:true},
        ];

        const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
        const typeText = (el: HTMLElement, text: string, speed: number) => {
            return new Promise<void>(resolve => {
                let i = 0;
                const interval = setInterval(() => {
                    if (!isRunning) { clearInterval(interval); resolve(); return; }
                    el.textContent += text[i];
                    i++;
                    if(i >= text.length){ clearInterval(interval); resolve(); }
                }, speed);
            });
        };

        const typeTerminal = async () => {
            const body = terminalBodyRef.current;
            if (!body) return;
            body.innerHTML = "";

            for(const line of terminalScript){
                if (!isRunning) return;
                const div = document.createElement("div");
                div.className = "terminal-line";
                body.appendChild(div);

                if(line.type === "cmd"){
                    div.innerHTML = '<span class="prompt">kyysolutions@akademiaso</span><span class="path">:~$</span> ';
                    const span = document.createElement("span");
                    div.appendChild(span);
                    await typeText(span, line.text, 28);
                    await sleep(280);
                } else {
                    div.className = "terminal-line terminal-out";
                    div.innerHTML = line.ok ? `<span class="ok">${line.text}</span>` : line.text;
                    await sleep(420);
                }
            }
            if (!isRunning) return;
            const cursorLine = document.createElement("div");
            cursorLine.className = "terminal-line";
            cursorLine.innerHTML = '<span class="prompt">kyysolutions@akademiaso</span><span class="path">:~$</span> <span class="cursor"></span>';
            body.appendChild(cursorLine);

            await sleep(2600);
            if (isRunning) typeTerminal(); 
        };

        typeTerminal();
        return () => { isRunning = false; };
    }, []);

    // Efek Scroll Navbar
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const formatRupiah = (num: number) => "Rp" + num.toLocaleString("id-ID");
    const stripHtml = (html: string) => html ? html.replace(/<[^>]*>?/gm, '') : '';

    return (
        <div className="min-h-screen bg-[var(--paper)] font-body text-[var(--ink)] selection:bg-[var(--moss)] selection:text-white">
            <Head title={`${app_name} - Software Manajemen Pendidikan Modern`}>
                <link rel="preconnect" href="[https://fonts.googleapis.com](https://fonts.googleapis.com)" />
                <link href="[https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap](https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap)" rel="stylesheet" />
            </Head>

            {/* --- CUSTOM CSS TOKENS & ANIMATIONS --- */}
            <style dangerouslySetInnerHTML={{__html: `
                :root {
                    --ink: #0B1120; --ink-soft: #141d33; --paper: #F7F5F0; --paper-dim: #EDEAE2;
                    --moss: #2D5F4C; --moss-light: #3f7d65; --amber: #E8A33D; --amber-deep: #c9842a;
                    --slate: #475569; --slate-light: #8b96a8; --line: rgba(11,17,32,0.1); --line-light: rgba(247,245,240,0.14);
                    --radius: 14px; --shadow-card: 0 1px 2px rgba(11,17,32,0.04), 0 8px 24px -8px rgba(11,17,32,0.10);
                    --font-display: 'Space Grotesk', sans-serif; --font-body: 'Inter', sans-serif; --font-mono: 'JetBrains Mono', monospace;
                }
                body { font-family: var(--font-body); }
                .font-display { font-family: var(--font-display); }
                .font-mono { font-family: var(--font-mono); }
                
                @keyframes pulseDot { 0%,100% {opacity:1;} 50% {opacity:0.3;} }
                .animate-pulse-dot { animation: pulseDot 2s infinite; }
                
                @keyframes riseIn { from {opacity:0; transform:translateY(14px);} to {opacity:1; transform:translateY(0);} }
                .animate-rise { opacity:0; animation: riseIn .7s ease forwards; }
                
                @keyframes blink { 0%,50%{opacity:1;} 51%,100%{opacity:0;} }
                .cursor { display:inline-block; width:7px; height:14px; background:var(--amber); vertical-align:middle; animation:blink 1s step-end infinite; margin-left:2px; }
                
                .terminal-body .prompt { color: var(--amber); }
                .terminal-body .path { color: var(--moss-light); }
                .terminal-out .ok { color: #4fbf7a; }
                
                @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
                .animate-marquee { display: flex; width: max-content; animation: marquee 25s linear infinite; }
                .animate-marquee:hover { animation-play-state: paused; }

                .nav-link { position: relative; padding: 6px 0; color: var(--slate); transition: color .2s ease; }
                .nav-link:hover { color: var(--ink); }
                .nav-link::after { content: ""; position: absolute; left: 0; bottom: 0; width: 0; height: 1.5px; background: var(--amber); transition: width .25s ease; }
                .nav-link:hover::after { width: 100%; }

                .btn-custom { font-weight: 600; font-size: 14.5px; padding: 11px 20px; border-radius: 9px; display: inline-flex; align-items: center; gap: 8px; transition: transform .18s ease, box-shadow .18s ease, background .18s ease; }
                .btn-primary { background: var(--ink); color: var(--paper); }
                .btn-primary:hover { transform: translateY(-1.5px); box-shadow: 0 8px 20px -6px rgba(11,17,32,0.45); }
                .btn-amber { background: var(--amber); color: var(--ink); }
                .btn-amber:hover { background: var(--amber-deep); transform: translateY(-1.5px); box-shadow: 0 8px 20px -6px rgba(201,132,42,0.5); }
                .btn-outline { border: 1.5px solid var(--ink); color: var(--ink); }
                .btn-outline:hover { background: var(--ink); color: var(--paper); }

                .feature-card { background: #fff; border: 1px solid var(--line); border-radius: var(--radius); padding: 30px 26px; box-shadow: var(--shadow-card); transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease; position: relative; overflow: hidden; }
                .feature-card::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: var(--moss); transform: scaleX(0); transform-origin: left; transition: transform .35s ease; }
                .feature-card:hover { transform: translateY(-5px); box-shadow: 0 18px 36px -16px rgba(11,17,32,0.18); border-color: transparent; }
                .feature-card:hover::before { transform: scaleX(1); }

                /* --- CSS LENGKAP UNTUK PRICING CARD --- */
                .price-card { background: #fff; border: 1.5px solid var(--line); border-radius: 18px; padding: 32px 28px; display: flex; flex-direction: column; position: relative; transition: transform .3s ease, box-shadow .3s ease; }
                .price-card:hover { transform: translateY(-4px); }
                
                .price-card .pname { font-family: var(--font-display); font-weight: 600; font-size: 18px; margin-bottom: 6px; }
                .price-card .pdesc { font-size: 13.5px; color: var(--slate); margin-bottom: 22px; min-height: 36px; }
                
                .price-amount { display: flex; align-items: baseline; gap: 6px; margin-bottom: 4px; font-family: var(--font-mono); }
                .price-amount .currency { font-size: 16px; color: var(--slate); font-weight: 600; }
                .price-amount .num { font-size: 38px; font-weight: 700; color: var(--ink); letter-spacing: -0.02em; }
                .price-amount .per { font-size: 13px; color: var(--slate-light); }
                
                .price-note { font-size: 12.5px; color: var(--slate-light); margin-bottom: 26px; font-family: var(--font-mono); }
                
                .price-feat { margin-bottom: 30px; flex-grow: 1; }
                .price-feat li { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: var(--ink); padding: 8px 0; border-top: 1px solid var(--line); }
                .price-feat li:first-child { border-top: none; }
                .price-feat svg { width: 16px; height: 16px; flex-shrink: 0; margin-top: 2px; stroke: var(--moss); stroke-width: 2.4; }

                .price-card.popular { background: var(--ink); border-color: var(--ink); box-shadow: 0 30px 60px -20px rgba(11,17,32,0.45); transform: scale(1.02); }
                .price-card.popular .pname { color: var(--paper); }
                .price-card.popular .pdesc { color: var(--slate-light); }
                .price-card.popular .price-amount .num { color: var(--paper); }
                .price-card.popular .price-amount .currency { color: var(--slate-light); }
                .price-card.popular .price-note { color: var(--slate-light); }
                .price-card.popular .price-feat li { color: var(--paper); border-top: 1px solid var(--line-light); }
                .price-card.popular .price-feat svg { stroke: var(--amber); }

                .popular-badge { position: absolute; top: -13px; left: 28px; background: var(--amber); color: var(--ink); font-family: var(--font-mono); font-size: 11.5px; font-weight: 700; padding: 5px 13px; border-radius: 100px; letter-spacing: 0.02em; display: flex; align-items: center; gap: 5px; box-shadow: 0 6px 14px -4px rgba(201,132,42,0.5); }
                .popular-badge::before { content: "★"; font-size: 11px; }

                /* --- ARTICLE --- */
                .article-card { border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; background: #fff; transition: transform .25s ease, box-shadow .25s ease; display: flex; flex-direction: column; }
                .article-card:hover { transform: translateY(-4px); box-shadow: 0 18px 36px -16px rgba(11,17,32,0.16); }
                
                .cta-band { background: var(--moss); border-radius: 24px; padding: 60px 50px; display: flex; align-items: center; justify-content: space-between; gap: 30px; position: relative; overflow: hidden; }
                .cta-band::before { content: ""; position: absolute; right: -60px; top: -60px; width: 240px; height: 240px; border-radius: 50%; background: rgba(255,255,255,0.07); }
                .cta-band::after { content: ""; position: absolute; left: 30%; bottom: -100px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.05); }
            `}} />

            {/* --- TOP NAVBAR --- */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#F7F5F0]/80 backdrop-blur-md border-b border-[#0B1120]/10 shadow-sm' : 'bg-transparent border-transparent'}`}>
                <div className="max-w-[1160px] mx-auto px-6 h-[72px] flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 font-display font-bold text-[19px] tracking-tight">
                        <div className="w-[30px] h-[30px] rounded-lg bg-[var(--ink)] flex items-center justify-center shrink-0">
                            <div className="w-[11px] h-[11px] border-2 border-[var(--amber)] border-r-transparent border-b-transparent rounded-[3px] rotate-45"></div>
                        </div>
                        {app_name}
                    </Link>

                    <nav className="hidden md:flex items-center gap-8 font-medium text-[14.5px]">
                        <a href="#product" className="nav-link">Product</a>
                        <a href="#source-code" className="nav-link">Source Code</a>
                        <a href="#achievement" className="nav-link">Achievement</a>
                        <a href="#pricing" className="nav-link">Pricing</a>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link href="/login" className="hidden sm:block text-[14.5px] font-semibold text-[var(--ink)] px-2">Sign in</Link>
                        <Link href="/register" className="btn-custom btn-primary text-sm">Try for free</Link>
                    </div>
                </div>
            </header>

            {/* --- HERO SECTION --- */}
            <section id="hero" className="relative pt-[168px] pb-[100px] overflow-hidden">
                <div className="absolute -top-[200px] -right-[160px] w-[560px] h-[560px] bg-[radial-gradient(circle,rgba(45,95,76,0.13),transparent_70%)] pointer-events-none"></div>
                <div className="max-w-[1160px] mx-auto px-6 grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center relative z-10">
                    <div>
                        <div className="inline-flex items-center gap-2 font-mono text-[12.5px] font-medium text-[var(--moss)] bg-[rgba(45,95,76,0.08)] border border-[rgba(45,95,76,0.2)] px-3 py-1.5 rounded-full mb-6 animate-rise" style={{animationDelay: '.05s'}}>
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--moss)] animate-pulse-dot"></span> 
                            Dipakai 120+ institusi & UMKM di Indonesia
                        </div>
                        <h1 className="font-display text-[clamp(36px,4.6vw,58px)] leading-[1.05] font-bold tracking-tight mb-5 animate-rise" style={{animationDelay: '.12s'}}>
                            Sistem akademik, platform sekolah, dan <span className="text-[var(--moss)] italic font-semibold">source code</span> — siap pakai.
                        </h1>
                        <p className="text-[17px] leading-[1.65] text-[var(--slate)] max-w-[480px] mb-8 animate-rise" style={{animationDelay: '.2s'}}>
                            {app_name} menyediakan SIAKAD untuk kampus & sekolah, modul PPDB modern, dan source code production-ready — tanpa perlu bangun dari nol.
                        </p>
                        <div className="flex items-center gap-4 mb-10 animate-rise" style={{animationDelay: '.28s'}}>
                            <Link href="#pricing" className="btn-custom btn-amber px-6 py-3 text-[15px]">Mulai berlangganan</Link>
                            <a href="#source-code" className="btn-custom btn-outline px-6 py-3 text-[15px]">Lihat source code</a>
                        </div>
                        <div className="flex flex-wrap items-center gap-5 text-[13px] text-[var(--slate-light)] animate-rise" style={{animationDelay: '.36s'}}>
                            <span className="flex items-center gap-1.5"><svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 stroke-[var(--moss)] stroke-2"><path d="M20 6L9 17l-5-5"/></svg> Setup dalam 24 jam</span>
                            <span className="flex items-center gap-1.5"><svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 stroke-[var(--moss)] stroke-2"><path d="M20 6L9 17l-5-5"/></svg> Source code tersedia</span>
                            <span className="flex items-center gap-1.5"><svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 stroke-[var(--moss)] stroke-2"><path d="M20 6L9 17l-5-5"/></svg> Support Bahasa Indonesia</span>
                        </div>
                    </div>

                    <div className="bg-[var(--ink)] rounded-2xl shadow-[0_30px_70px_-24px_rgba(11,17,32,0.55),inset_0_1px_0_rgba(255,255,255,0.04)] overflow-hidden rotate-[0.4deg] animate-rise" style={{animationDelay: '.3s'}}>
                        <div className="flex items-center gap-2 px-4 py-3 bg-[var(--ink-soft)] border-b border-[var(--line-light)]">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#e8584f]"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-[#e8b84f]"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-[#4fbf7a]"></span>
                            <span className="ml-2 font-mono text-xs text-[var(--slate-light)]">akademiaso — zsh</span>
                        </div>
                        <div className="p-6 font-mono text-[13.5px] leading-[1.9] text-[#cdd6e8] min-h-[300px]" ref={terminalBodyRef}>
                            {/* Injected by React useEffect */}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- LOGOS STRIP --- */}
            <div className="border-y border-[var(--line)] py-8 bg-[var(--paper)]">
                <div className="max-w-[1160px] mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
                    <span className="font-mono text-xs text-[var(--slate-light)] shrink-0 uppercase tracking-widest">Dipercaya oleh tim dari</span>
                    <div className="flex overflow-hidden opacity-60 grayscale hover:grayscale-0 transition-all duration-500 w-full relative">
                        <div className="animate-marquee flex items-center gap-10 whitespace-nowrap">
                            {['Univ. Cendekia', 'SMA Negeri 4', 'Politeknik Nusantara', 'Dinas Pendidikan', 'Yayasan Bangsa'].map((name, i) => (
                                <span key={i} className="font-display font-semibold text-[15px] text-[var(--slate-light)]">{name}</span>
                            ))}
                            {/* Duplikasi untuk looping */}
                            {['Univ. Cendekia', 'SMA Negeri 4', 'Politeknik Nusantara', 'Dinas Pendidikan', 'Yayasan Bangsa'].map((name, i) => (
                                <span key={`dup-${i}`} className="font-display font-semibold text-[15px] text-[var(--slate-light)]">{name}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- PRODUCT & SOLUTIONS --- */}
            <section id="product" className="py-[110px]">
                <div className="max-w-[1160px] mx-auto px-6">
                    <div className="max-w-[600px] mb-[60px]">
                        <span className="font-mono text-[12.5px] font-semibold text-[var(--amber-deep)] uppercase tracking-[0.06em] mb-3 block">Product</span>
                        <h2 className="font-display font-bold text-[clamp(28px,3.2vw,40px)] leading-[1.12] tracking-tight mb-4 text-[var(--ink)]">Layanan SaaS berlangganan.</h2>
                        <p className="text-[16px] text-[var(--slate)] leading-[1.65]">Pilih paket manajemen sistem akademik yang berjalan penuh di cloud. Tidak perlu memikirkan server dan maintenance.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-[22px]">
                        {products && products.length > 0 ? products.slice(0,3).map((prod: any) => (
                            <Link href={`/product/${prod.slug}`} key={prod.id} className="feature-card group flex flex-col">
                                <div className="w-[46px] h-[46px] rounded-[11px] bg-[var(--ink)] flex items-center justify-center mb-5 text-[var(--amber)] shrink-0">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-[22px] h-[22px]"><path d="M12 3L2 8l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                                </div>
                                <h3 className="font-display text-[19px] font-semibold mb-2.5 tracking-tight text-[var(--ink)] group-hover:text-[var(--moss)] transition-colors">{prod.name}</h3>
                                <p className="text-[14.5px] text-[var(--slate)] leading-[1.6] mb-5 line-clamp-3 flex-1">{prod.subtitle}</p>
                                <div className="mt-auto">
                                    <span className="inline-flex font-mono text-[11.5px] text-[var(--moss)] bg-[rgba(45,95,76,0.08)] px-2.5 py-1 rounded-md">Selengkapnya &rarr;</span>
                                </div>
                            </Link>
                        )) : (
                            <div className="col-span-3 text-center py-10 text-[var(--slate-light)] border border-dashed border-[var(--line)] rounded-2xl">Produk langganan belum dikonfigurasi.</div>
                        )}
                    </div>
                </div>
            </section>

            {/* --- SOURCE CODE CATALOG (NEW) --- */}
            <section id="source-code" className="py-[110px] bg-white border-t border-[var(--line)]">
                <div className="max-w-[1160px] mx-auto px-6">
                    <div className="max-w-[600px] mb-[60px]">
                        <span className="font-mono text-[12.5px] font-semibold text-[var(--moss)] uppercase tracking-[0.06em] mb-3 block">Digital Products</span>
                        <h2 className="font-display font-bold text-[clamp(28px,3.2vw,40px)] leading-[1.12] tracking-tight mb-4 text-[var(--ink)]">Katalog Source Code.</h2>
                        <p className="text-[16px] text-[var(--slate)] leading-[1.65]">Beli putus source code aplikasi siap pakai untuk mempercepat proyek Anda. Dapatkan akses penuh tanpa batasan fitur.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {sourceCodes && sourceCodes.length > 0 ? sourceCodes.map((sc: any, idx: number) => (
                            <Link href={`/product/${sc.slug}/checkout`} key={sc.id} className="article-card group block border border-[var(--line)] hover:border-[var(--moss)]">
                                <div className={`h-[180px] relative overflow-hidden ${idx % 2 === 0 ? 'bg-gradient-to-br from-[#2b3a55] to-[var(--ink)]' : 'bg-gradient-to-br from-[var(--moss)] to-[#1d4334]'}`}>
                                    {sc.thumbnail ? (
                                        <img src={sc.thumbnail} alt={sc.title} className="w-full h-full object-cover mix-blend-overlay opacity-80 group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12),transparent_60%)]"></div>
                                    )}
                                    <span className="absolute bottom-3.5 left-4 font-mono text-[11px] text-[var(--ink)] bg-[var(--amber)] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">Beli Putus</span>
                                </div>
                                <div className="p-6 flex flex-col flex-grow bg-white">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-display text-[17px] font-semibold leading-[1.35] text-[var(--ink)] tracking-tight line-clamp-1 group-hover:text-[var(--moss)] transition-colors">{sc.title}</h3>
                                    </div>
                                    <p className="text-[13.5px] text-[var(--slate)] leading-[1.6] mb-5 flex-grow line-clamp-2">{sc.description}</p>
                                    
                                    <div className="flex items-center gap-2 flex-wrap mb-6">
                                        {sc.tech_stack && sc.tech_stack.slice(0, 3).map((tech: string, i: number) => (
                                            <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium border border-slate-200">{tech}</span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--line-light)]">
                                        <span className="font-mono font-bold text-[17px] text-[var(--moss)]">{formatRupiah(sc.price)}</span>
                                        <span className="text-[13px] font-semibold text-[var(--ink)] inline-flex items-center gap-1.5 group-hover:text-[var(--moss)] bg-[var(--paper)] px-3 py-1.5 rounded-lg border border-[var(--line)]">
                                            Beli Sekarang <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        )) : (
                            <div className="col-span-3 text-center p-12 bg-white rounded-xl border border-dashed border-[var(--line)]">
                                <Code className="w-10 h-10 text-[var(--line)] mx-auto mb-3" />
                                <p className="text-[var(--slate)] text-sm">Belum ada source code yang tersedia di katalog saat ini.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* --- ACHIEVEMENT --- */}
            <section id="achievement" className="py-[110px] bg-[var(--ink)] text-[var(--paper)] relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '42px 42px'}}></div>
                <div className="max-w-[1160px] mx-auto px-6 relative z-10">
                    <div className="max-w-[600px] mb-[60px]">
                        <span className="font-mono text-[12.5px] font-semibold text-[var(--amber)] uppercase tracking-[0.06em] mb-3 block">Achievement</span>
                        <h2 className="font-display font-bold text-[clamp(28px,3.2vw,40px)] leading-[1.12] tracking-tight mb-4">Angka yang berbicara lebih dari testimoni.</h2>
                        <p className="text-[16px] text-[var(--slate-light)] leading-[1.65]">Sejak dirilis, {app_name} tumbuh bersama institusi pendidikan dan pelaku usaha di seluruh Indonesia.</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-[1px] bg-[var(--line-light)] border border-[var(--line-light)] rounded-[var(--radius)] overflow-hidden">
                        <div className="bg-[var(--ink)] p-8 md:p-[38px_28px]">
                            <div className="font-mono font-bold text-[clamp(30px,3.4vw,42px)] text-[var(--paper)] mb-2 flex items-baseline gap-0.5">120<span className="text-[18px] text-[var(--amber)]">^</span></div>
                            <div className="text-[13.5px] text-[var(--slate-light)] leading-[1.5]">Institusi & Klien Aktif</div>
                        </div>
                        <div className="bg-[var(--ink)] p-8 md:p-[38px_28px]">
                            <div className="font-mono font-bold text-[clamp(30px,3.4vw,42px)] text-[var(--paper)] mb-2 flex items-baseline gap-0.5">1.2<span className="text-[18px] text-[var(--amber)]">K</span></div>
                            <div className="text-[13.5px] text-[var(--slate-light)] leading-[1.5]">Siswa Termanajemen</div>
                        </div>
                        <div className="bg-[var(--ink)] p-8 md:p-[38px_28px]">
                            <div className="font-mono font-bold text-[clamp(30px,3.4vw,42px)] text-[var(--paper)] mb-2 flex items-baseline gap-0.5">99.9<span className="text-[18px] text-[var(--amber)]">%</span></div>
                            <div className="text-[13.5px] text-[var(--slate-light)] leading-[1.5]">Server Uptime SLA</div>
                        </div>
                        <div className="bg-[var(--ink)] p-8 md:p-[38px_28px]">
                            <div className="font-mono font-bold text-[clamp(30px,3.4vw,42px)] text-[var(--paper)] mb-2 flex items-baseline gap-0.5">4.9<span className="text-[18px] text-[var(--amber)]">/5</span></div>
                            <div className="text-[13.5px] text-[var(--slate-light)] leading-[1.5]">Rata-rata rating Klien</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PRICING --- */}
            <section id="pricing" className="py-[110px] bg-[var(--paper-dim)] relative">
                <div className="max-w-[1160px] mx-auto px-6">
                    <div className="max-w-[600px] mx-auto text-center mb-[60px]">
                        <span className="font-mono text-[12.5px] font-semibold text-[var(--amber-deep)] uppercase tracking-[0.06em] mb-3 block">Pricing SaaS</span>
                        <h2 className="font-display font-bold text-[clamp(28px,3.2vw,40px)] leading-[1.12] tracking-tight mb-4">Paket langganan yang jujur.</h2>
                        <p className="text-[16px] text-[var(--slate)] leading-[1.65]">Tanpa biaya tersembunyi. Upgrade, downgrade, atau berhenti kapan saja melalui dasbor Anda.</p>
                    </div>

                    <div className="flex justify-center mb-12">
                        <div className="inline-flex items-center gap-1 bg-white border border-[var(--line)] rounded-full p-1.5">
                            <button onClick={() => setBillingCycle('monthly')} className={`text-[13.5px] font-semibold px-5 py-2 rounded-full transition-all ${billingCycle === 'monthly' ? 'bg-[var(--ink)] text-[var(--paper)]' : 'text-[var(--slate)] hover:bg-slate-50'}`}>Bulanan</button>
                            <button onClick={() => setBillingCycle('yearly')} className={`text-[13.5px] font-semibold px-5 py-2 rounded-full transition-all ${billingCycle === 'yearly' ? 'bg-[var(--ink)] text-[var(--paper)]' : 'text-[var(--slate)] hover:bg-slate-50'}`}>Tahunan <span className="text-[var(--amber-deep)]">-20%</span></button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 items-stretch">
                        {packages && packages.length > 0 ? packages.filter(p => p.billing_cycle === billingCycle || p.billing_cycle === 'lifetime').map((pkg: any) => (
                            <div key={pkg.id} className={`price-card ${pkg.is_popular ? 'popular' : ''}`}>
                                {pkg.is_popular && <span className="popular-badge">Paling Populer</span>}
                                <div className="pname">{pkg.name}</div>
                                <div className="pdesc line-clamp-2">{pkg.description}</div>
                                <div className="price-amount">
                                    <span className="currency">Rp</span>
                                    <span className="num">{Number(pkg.price).toLocaleString('id-ID')}</span>
                                    <span className="per">/{pkg.billing_cycle === 'monthly' ? 'bln' : 'thn'}</span>
                                </div>
                                <div className="price-note">{pkg.billing_cycle === 'yearly' ? 'Hemat hingga 20% pertahun' : 'Ditagih setiap bulan'}</div>
                                
                                <ul className="price-feat">
                                    <li><svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5"/></svg> Maks <strong>{pkg.max_students} Siswa</strong></li>
                                    <li><svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5"/></svg> Storage <strong>{(pkg.storage_limit_mb / 1024).toFixed(1)} GB</strong></li>
                                    {pkg.features && Array.isArray(pkg.features) && pkg.features.slice(0,4).map((feat: string, i: number) => (
                                        <li key={i}><svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5"/></svg> {feat}</li>
                                    ))}
                                </ul>

                                <Link href={`/register?package_id=${pkg.id}`} className={`btn-custom w-full justify-center ${pkg.is_popular ? 'btn-amber' : 'btn-outline'}`}>
                                    Pilih Paket
                                </Link>
                            </div>
                        )) : (
                            <div className="col-span-3 text-center p-8 text-[var(--slate)] border border-dashed border-[var(--line)] rounded-xl">Paket belum dikonfigurasi.</div>
                        )}
                    </div>
                </div>
            </section>

            {/* --- ARTICLE --- */}
            <section id="article" className="py-[110px] bg-[var(--paper)]">
                <div className="max-w-[1160px] mx-auto px-6">
                    <div className="max-w-[600px] mb-[60px]">
                        <span className="font-mono text-[12.5px] font-semibold text-[var(--amber-deep)] uppercase tracking-[0.06em] mb-3 block">Article</span>
                        <h2 className="font-display font-bold text-[clamp(28px,3.2vw,40px)] leading-[1.12] tracking-tight mb-4">Catatan dari tim pengembang.</h2>
                        <p className="text-[16px] text-[var(--slate)] leading-[1.65]">Panduan, studi kasus, dan pembaruan produk seputar pendidikan digital dan manajemen SaaS.</p>
                    </div>

                    {blogs && blogs.length > 0 ? (
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Layout khusus jika data banyak, yang pertama memanjang, tapi di sini grid 3 standard agar konsisten */}
                            {blogs.slice(0,3).map((blog: any, idx: number) => (
                                <article key={blog.id} className="article-card flex flex-col h-full group cursor-pointer" onClick={() => alert('Detail blog belum tersedia')}>
                                    <div className={`h-[180px] relative overflow-hidden ${idx === 0 ? 'bg-gradient-to-br from-[var(--moss)] to-[#1d4334]' : idx === 1 ? 'bg-gradient-to-br from-[#2b3a55] to-[var(--ink)]' : 'bg-gradient-to-br from-[var(--amber-deep)] to-[#8a5b1f]'}`}>
                                        {blog.thumbnail ? (
                                            <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover mix-blend-overlay opacity-80 group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12),transparent_60%)]"></div>
                                        )}
                                        <span className="absolute bottom-3.5 left-4 font-mono text-[11px] text-white bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-md">{blog.status}</span>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <span className="font-mono text-[11.5px] text-[var(--slate-light)] mb-2.5 uppercase">
                                            {new Date(blog.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                        <h3 className="font-display text-[17px] font-semibold leading-[1.35] mb-2.5 text-[var(--ink)] tracking-tight line-clamp-2 group-hover:text-[var(--moss)] transition-colors">{blog.title}</h3>
                                        <p className="text-[13.5px] text-[var(--slate)] leading-[1.6] mb-4 flex-grow line-clamp-3">{stripHtml(blog.content)}</p>
                                        <span className="text-[13px] font-semibold text-[var(--ink)] inline-flex items-center gap-1.5 group-hover:text-[var(--moss)]">
                                            Baca selengkapnya <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-12 bg-white rounded-xl border border-dashed border-[var(--line)]">
                            <BookOpen className="w-10 h-10 text-[var(--line)] mx-auto mb-3" />
                            <p className="text-[var(--slate)] text-sm">Belum ada artikel yang dipublikasikan.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* --- CTA BAND --- */}
            <section className="pt-0 pb-[110px] bg-[var(--paper)]">
                <div className="max-w-[1160px] mx-auto px-6">
                    <div className="cta-band flex-col md:flex-row text-center md:text-left">
                        <div className="relative z-10">
                            <h2 className="font-display text-[clamp(24px,2.6vw,32px)] text-white font-bold mb-2.5 tracking-tight">Siap menjalankan sistem Anda minggu ini?</h2>
                            <p className="text-white/80 text-[15px]">Coba gratis 14 hari, tanpa kartu kredit di awal.</p>
                        </div>
                        <Link href="/register" className="btn-custom btn-amber shrink-0 relative z-10">
                            Mulai Sekarang
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-[var(--ink)] text-[var(--slate-light)] pt-16 pb-8">
                <div className="max-w-[1160px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 pb-12 border-b border-white/10">
                        <div>
                            <Link href="/" className="flex items-center gap-2 font-display font-bold text-[19px] text-white tracking-tight mb-4">
                                <div className="w-[30px] h-[30px] rounded-lg bg-white flex items-center justify-center shrink-0">
                                    <div className="w-[11px] h-[11px] border-2 border-[var(--amber)] border-r-transparent border-b-transparent rounded-[3px] rotate-45"></div>
                                </div>
                                {app_name}
                            </Link>
                            <p className="text-[13.5px] leading-[1.65] max-w-[260px] text-[var(--slate-light)]">
                                Penyedia solusi perangkat lunak akademik dan manajemen untuk institusi pendidikan modern di Indonesia.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-mono text-[12px] text-white uppercase tracking-wider mb-4">Produk</h4>
                            <ul className="space-y-3 text-[14px]">
                                <li><a href="#product" className="hover:text-white transition-colors">SIAKAD Akademik</a></li>
                                <li><a href="#product" className="hover:text-white transition-colors">Aplikasi UMKM</a></li>
                                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing SaaS</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-mono text-[12px] text-white uppercase tracking-wider mb-4">Perusahaan</h4>
                            <ul className="space-y-3 text-[14px]">
                                <li><a href="#achievement" className="hover:text-white transition-colors">Pencapaian</a></li>
                                <li><a href="#article" className="hover:text-white transition-colors">Artikel</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Karier</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Kontak</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-mono text-[12px] text-white uppercase tracking-wider mb-4">Dukungan</h4>
                            <ul className="space-y-3 text-[14px]">
                                <li><a href="#" className="hover:text-white transition-colors">Dokumentasi</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Status layanan</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Syarat Ketentuan</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center pt-6 text-[13px] gap-4">
                        <span>© 2026 {app_name}. Seluruh hak cipta dilindungi.</span>
                        <span>Dibuat dengan teliti di Indonesia.</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}