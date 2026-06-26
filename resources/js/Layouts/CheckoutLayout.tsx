import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';

interface Props {
    children: React.ReactNode;
    title: string;
    backUrl?: string;
}

export default function CheckoutLayout({ children, title, backUrl = '/' }: Props) {
    return (
        <div className="min-h-screen bg-[#EDEAE2] font-body text-[#0B1120] p-0 selection:bg-[#2D5F4C] selection:text-white">
            <Head title={title} />
            
            {/* --- CUSTOM CSS TOKENS GLOBAL UNTUK SEMUA CHECKOUT --- */}
            <style dangerouslySetInnerHTML={{__html: `
                :root { 
                    --ink: #0B1120; 
                    --paper: #F7F5F0; 
                    --moss: #2D5F4C; 
                    --amber: #E8A33D; 
                    --slate: #475569; 
                    --line: rgba(11,17,32,0.1); 
                }
                .field-input { border: 1.5px solid var(--line); border-radius: 9px; padding: 11px 13px; font-size: 14.5px; background: var(--paper); color: var(--ink); width: 100%; transition: all .2s; }
                .field-input:focus { border-color: var(--moss); background: #fff; outline: none; }
                .pay-method { border: 1.5px solid var(--line); border-radius: 10px; padding: 13px 10px; display: flex; flex-direction: column; align-items: center; gap: 7px; font-size: 12px; font-weight: 600; color: var(--slate); cursor: pointer; transition: all .2s; }
                .pay-method.selected { border-color: var(--moss); background: rgba(45,95,76,0.06); color: var(--moss); }
            `}} />

            {/* --- TOPBAR BERSAMA (REUSABLE) --- */}
            <div className="h-[72px] flex items-center border-b border-[var(--line)] bg-[var(--paper)] sticky top-0 z-50">
                <div className="max-w-[1100px] mx-auto px-7 w-full flex items-center justify-between">
                    <Link href={backUrl} className="flex items-center gap-2 text-[14px] font-semibold text-[var(--slate)] hover:text-[var(--ink)] transition-colors">
                        &larr; Kembali
                    </Link>
                    <div className="flex items-center gap-2 font-bold text-[16px]">
                        <div className="w-6 h-6 rounded-md bg-[var(--ink)] flex items-center justify-center shrink-0">
                            <div className="w-[8px] h-[8px] border-[1.5px] border-[var(--amber)] border-r-transparent border-b-transparent rounded-sm rotate-45"></div>
                        </div>
                        Secure Checkout
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-[12.5px] text-slate-500 font-medium">
                        <ShieldCheck className="w-4 h-4 text-[var(--moss)]" /> Enkripsi End-to-End
                    </div>
                </div>
            </div>

            {/* --- CONTAINER KONTEN UTAMA --- */}
            <div className="max-w-[1100px] mx-auto px-7 pt-14 pb-[100px]">
                {children}
            </div>
        </div>
    );
}
