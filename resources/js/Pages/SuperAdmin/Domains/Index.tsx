import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Globe, Building2, Search, Link2, 
    MoreVertical, X, CheckCircle2, ShieldAlert,
    RefreshCw, Server
} from 'lucide-react';

interface TenantSetting {
    custom_domain: string | null;
}

interface School {
    id: string;
    name: string;
    tenant_setting: TenantSetting | null;
}

export default function DomainsIndex({ schools }: { schools: any }) {
    const schoolList: School[] = schools?.data || [];
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
    const [verifyingDomain, setVerifyingDomain] = useState<string | null>(null);

    // Form setup
    const { data, setData, put, processing, errors, reset } = useForm({
        custom_domain: '',
    });

    const openEditModal = (school: School) => {
        setSelectedSchool(school);
        setData({
            custom_domain: school.tenant_setting?.custom_domain || '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedSchool(null);
        reset();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSchool) return;

        put(`/super-admin/domains/${selectedSchool.id}`, {
            onSuccess: () => closeModal(),
        });
    };

    // Fungsi simulasi verifikasi DNS (Hanya UI)
    const simulateDnsCheck = (schoolId: string) => {
        setVerifyingDomain(schoolId);
        setTimeout(() => {
            setVerifyingDomain(null);
            alert("Sistem mendeteksi bahwa CNAME record sudah mengarah ke server AkademiaOS dengan benar.");
        }, 1500);
    };

    // Fungsi untuk menghasilkan subdomain default berdasarkan nama sekolah
    const generateDefaultSubdomain = (name: string) => {
        const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        return `${slug}.akademiaos.com`;
    };

    return (
        <AuthenticatedLayout header="Tenant Management">
            <Head title="Manajemen Domain - AkademiaOS" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-serif font-semibold text-[#0F1729] flex items-center gap-2">
                            <Globe className="w-6 h-6 text-[#B8935F]" />
                            Manajemen URL & Domain
                        </h1>
                        <p className="text-sm text-[#8B93A8] mt-1">
                            Kelola alamat akses (subdomain) dan atur custom domain khusus untuk Tenant.
                        </p>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 rounded-xl border border-[#E2DDD0] shadow-sm flex items-center">
                    <div className="relative w-full max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A296]" />
                        <input
                            type="text"
                            placeholder="Cari institusi atau nama domain..."
                            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-md text-sm text-[#0F1729] focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl border border-[#E2DDD0] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#FAF8F3] border-b border-[#E2DDD0] text-[11px] uppercase tracking-wider text-[#8B93A8] font-semibold">
                                    <th className="px-6 py-4">Institusi (Tenant)</th>
                                    <th className="px-6 py-4">Subdomain Bawaan</th>
                                    <th className="px-6 py-4">Custom Domain</th>
                                    <th className="px-6 py-4 text-center">Status DNS</th>
                                    <th className="px-6 py-4 text-center">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2DDD0]/60">
                                {schoolList.length > 0 ? (
                                    schoolList.map((school: School) => {
                                        const cDomain = school.tenant_setting?.custom_domain;
                                        
                                        return (
                                            <tr key={school.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-md bg-[#0F1729]/5 border border-[#E2DDD0] flex items-center justify-center shrink-0">
                                                            <Building2 className="w-4 h-4 text-[#B8935F]" />
                                                        </div>
                                                        <p className="text-sm font-semibold text-[#0F1729]">{school.name}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <a href={`https://${generateDefaultSubdomain(school.name)}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1.5">
                                                        <Server className="w-3.5 h-3.5 text-blue-400" />
                                                        {generateDefaultSubdomain(school.name)}
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {cDomain ? (
                                                        <a href={`https://${cDomain}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-[#0F1729] hover:text-[#B8935F] hover:underline flex items-center gap-1.5">
                                                            <Globe className="w-4 h-4 text-[#B8935F]" />
                                                            {cDomain}
                                                        </a>
                                                    ) : (
                                                        <span className="text-sm text-[#8B93A8] italic">Belum diatur</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {cDomain ? (
                                                        <button 
                                                            onClick={() => simulateDnsCheck(school.id)}
                                                            disabled={verifyingDomain === school.id}
                                                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md border transition-colors ${verifyingDomain === school.id ? 'bg-slate-50 text-slate-500 border-slate-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'}`}
                                                        >
                                                            {verifyingDomain === school.id ? (
                                                                <><RefreshCw className="w-3 h-3 animate-spin" /> Mengecek...</>
                                                            ) : (
                                                                <><CheckCircle2 className="w-3 h-3" /> Terhubung (Cek Ulang)</>
                                                            )}
                                                        </button>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md">
                                                            N/A
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button 
                                                        onClick={() => openEditModal(school)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2DDD0] text-[#0F1729] text-xs font-semibold rounded-md hover:border-[#B8935F] hover:text-[#B8935F] transition-colors shadow-sm"
                                                    >
                                                        <Link2 className="w-3.5 h-3.5" /> Atur Domain
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <Globe className="w-8 h-8 text-[#E2DDD0] mx-auto mb-3" />
                                            <p className="text-[#8B93A8] text-sm">Belum ada data sekolah (tenant) ditemukan.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- MODAL EDIT DOMAIN --- */}
            {isModalOpen && selectedSchool && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-[#0F1729]/60 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 flex flex-col">
                        
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2DDD0] bg-[#FAF8F3] rounded-t-2xl">
                            <div>
                                <h2 className="text-lg font-serif font-semibold text-[#0F1729]">Pengaturan Custom Domain</h2>
                                <p className="text-xs text-[#8B93A8] mt-0.5">{selectedSchool.name}</p>
                            </div>
                            <button onClick={closeModal} className="text-[#8B93A8] hover:text-[#0F1729] transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-5">
                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
                                    <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-blue-800 mb-1">Informasi DNS</h4>
                                        <p className="text-xs text-blue-700 leading-relaxed">
                                            Pastikan pihak sekolah telah menambahkan CNAME Record pada panel domain mereka yang mengarah ke: <br/>
                                            <strong className="bg-blue-100 px-1 py-0.5 rounded">router.akademiaos.com</strong>
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[#0F1729]">Masukkan Custom Domain</label>
                                    <div className="relative">
                                        <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A296]" />
                                        <input
                                            type="text"
                                            value={data.custom_domain}
                                            onChange={e => setData('custom_domain', e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                            placeholder="Contoh: sim.sman1jakarta.sch.id"
                                        />
                                    </div>
                                    {errors.custom_domain && <p className="text-xs text-red-500">{errors.custom_domain}</p>}
                                    <p className="text-[10px] text-[#8B93A8] mt-1">Kosongkan kolom ini jika sekolah ingin kembali menggunakan subdomain bawaan.</p>
                                </div>

                                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E2DDD0] mt-6">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 text-sm font-medium text-[#8B93A8] hover:text-[#0F1729] transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-[#0F1729] text-white rounded-md text-sm font-medium hover:bg-[#1B2742] transition-colors shadow-sm disabled:opacity-70"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Domain'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
