import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Sliders, Building2, ToggleRight, Database, Users, 
    Search, Globe, Shield, X, Settings2
} from 'lucide-react';

interface TenantSetting {
    max_students: number;
    storage_limit_mb: number;
    custom_domain: string | null;
    enable_cbt: boolean;
    enable_ppdb: boolean;
    enable_lms: boolean;
    enable_finance: boolean;
}

interface School {
    id: string;
    name: string;
    email: string;
    tenant_setting: TenantSetting | null;
}

export default function TenantSettingsIndex({ schools }: { schools: any }) {
    const schoolList: School[] = schools?.data || [];
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

    // Form setup untuk Edit Settings
    const { data, setData, put, processing, errors, reset } = useForm({
        max_students: 500,
        storage_limit_mb: 1024,
        custom_domain: '',
        enable_cbt: true,
        enable_ppdb: true,
        enable_lms: true,
        enable_finance: true,
    });

    // Buka Modal Edit
    const openEditModal = (school: School) => {
        setSelectedSchool(school);
        const settings = school.tenant_setting;
        
        setData({
            max_students: settings?.max_students || 500,
            storage_limit_mb: settings?.storage_limit_mb || 1024,
            custom_domain: settings?.custom_domain || '',
            enable_cbt: settings ? settings.enable_cbt : true,
            enable_ppdb: settings ? settings.enable_ppdb : true,
            enable_lms: settings ? settings.enable_lms : true,
            enable_finance: settings ? settings.enable_finance : true,
        });
        
        setIsModalOpen(true);
    };

    // Tutup Modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedSchool(null);
        reset();
    };

    // Submit Update
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSchool) return;

        put(`/super-admin/tenant-settings/${selectedSchool.id}`, {
            onSuccess: () => closeModal(),
        });
    };

    // Komponen Toggle Switch Custom
    const ToggleSwitch = ({ label, isEnabled, onChange }: { label: string, isEnabled: boolean, onChange: () => void }) => (
        <div className="flex items-center justify-between p-3 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg">
            <span className="text-sm font-medium text-[#0F1729]">{label}</span>
            <button 
                type="button"
                onClick={onChange}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isEnabled ? 'bg-[#16a34a]' : 'bg-[#D1D5DB]'}`}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
    );

    return (
        <AuthenticatedLayout header="Tenant Settings & Override">
            <Head title="Tenant Settings - AkademiaOS" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-serif font-semibold text-[#0F1729] flex items-center gap-2">
                            <Sliders className="w-6 h-6 text-[#B8935F]" />
                            Konfigurasi Fitur & Kuota Tenant
                        </h1>
                        <p className="text-sm text-[#8B93A8] mt-1">
                            Atur batasan storage, jumlah siswa, dan ketersediaan modul untuk masing-masing sekolah.
                        </p>
                    </div>
                </div>

                {/* Filter & Search */}
                <div className="bg-white p-4 rounded-xl border border-[#E2DDD0] shadow-sm flex items-center">
                    <div className="relative w-full max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A296]" />
                        <input
                            type="text"
                            placeholder="Cari nama institusi..."
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
                                    <th className="px-6 py-4 text-center">Batas Siswa</th>
                                    <th className="px-6 py-4 text-center">Storage Max</th>
                                    <th className="px-6 py-4">Status Fitur Aktif</th>
                                    <th className="px-6 py-4 text-center">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2DDD0]/60">
                                {schoolList.length > 0 ? (
                                    schoolList.map((school: School) => {
                                        const sets = school.tenant_setting;
                                        return (
                                            <tr key={school.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-[#0F1729]/5 border border-[#E2DDD0] flex items-center justify-center shrink-0">
                                                            <Building2 className="w-4 h-4 text-[#B8935F]" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-[#0F1729]">{school.name}</p>
                                                            <p className="text-[11px] text-[#8B93A8] flex items-center gap-1 mt-0.5">
                                                                <Globe className="w-3 h-3" /> 
                                                                {sets?.custom_domain ? sets.custom_domain : 'Subdomain Bawaan'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF8F3] border border-[#E2DDD0] text-[#0F1729] text-xs font-semibold rounded-md">
                                                        <Users className="w-3.5 h-3.5 text-[#B8935F]" />
                                                        {sets?.max_students || 500}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF8F3] border border-[#E2DDD0] text-[#0F1729] text-xs font-semibold rounded-md">
                                                        <Database className="w-3.5 h-3.5 text-[#B8935F]" />
                                                        {sets ? (sets.storage_limit_mb / 1024).toFixed(1) : '1.0'} GB
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {(!sets || sets.enable_cbt) && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded border border-blue-200">CBT</span>}
                                                        {(!sets || sets.enable_ppdb) && <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded border border-purple-200">PPDB</span>}
                                                        {(!sets || sets.enable_lms) && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-200">LMS</span>}
                                                        {(!sets || sets.enable_finance) && <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded border border-amber-200">Keuangan</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button 
                                                        onClick={() => openEditModal(school)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2DDD0] text-[#0F1729] text-xs font-semibold rounded-md hover:border-[#B8935F] hover:text-[#B8935F] transition-colors shadow-sm"
                                                    >
                                                        <Settings2 className="w-3.5 h-3.5" /> Konfigurasi
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <Building2 className="w-8 h-8 text-[#E2DDD0] mx-auto mb-3" />
                                            <p className="text-[#8B93A8] text-sm">Belum ada data sekolah (tenant) ditemukan.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- MODAL KONFIGURASI TENANT --- */}
            {isModalOpen && selectedSchool && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-[#0F1729]/60 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative z-10 flex flex-col max-h-[90vh]">
                        
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2DDD0] bg-[#FAF8F3] rounded-t-2xl">
                            <div>
                                <h2 className="text-lg font-serif font-semibold text-[#0F1729]">Pengaturan Tenant</h2>
                                <p className="text-xs text-[#8B93A8] mt-0.5">{selectedSchool.name}</p>
                            </div>
                            <button onClick={closeModal} className="text-[#8B93A8] hover:text-[#0F1729] transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body & Form */}
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form onSubmit={submit} className="space-y-8">
                                
                                {/* Section 1: Resource Limits */}
                                <div>
                                    <h3 className="text-sm font-bold text-[#D4AF7A] uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Shield className="w-4 h-4" /> Batasan Sumber Daya
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-[#0F1729]">Maksimal Siswa</label>
                                            <div className="relative">
                                                <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A296]" />
                                                <input
                                                    type="number"
                                                    value={data.max_students}
                                                    onChange={e => setData('max_students', Number(e.target.value))}
                                                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                                />
                                            </div>
                                            {errors.max_students && <p className="text-xs text-red-500">{errors.max_students}</p>}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-[#0F1729]">Batas Storage (MB)</label>
                                            <div className="relative">
                                                <Database className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A296]" />
                                                <input
                                                    type="number"
                                                    value={data.storage_limit_mb}
                                                    onChange={e => setData('storage_limit_mb', Number(e.target.value))}
                                                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                                />
                                            </div>
                                            <p className="text-[10px] text-[#8B93A8]">Isi 1024 untuk 1 GB</p>
                                            {errors.storage_limit_mb && <p className="text-xs text-red-500">{errors.storage_limit_mb}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Custom Domain */}
                                <div>
                                    <h3 className="text-sm font-bold text-[#D4AF7A] uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Globe className="w-4 h-4" /> Custom Domain
                                    </h3>
                                    <div className="space-y-1.5">
                                        <input
                                            type="text"
                                            value={data.custom_domain}
                                            onChange={e => setData('custom_domain', e.target.value)}
                                            placeholder="Contoh: portal.sman1jakarta.sch.id"
                                            className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                        />
                                        <p className="text-[10px] text-[#8B93A8]">Biarkan kosong jika menggunakan subdomain bawaan platform.</p>
                                    </div>
                                </div>

                                {/* Section 3: Feature Toggles */}
                                <div>
                                    <h3 className="text-sm font-bold text-[#D4AF7A] uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <ToggleRight className="w-4 h-4" /> Override Fitur Modul
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <ToggleSwitch 
                                            label="Modul PPDB (Penerimaan Siswa)" 
                                            isEnabled={data.enable_ppdb} 
                                            onChange={() => setData('enable_ppdb', !data.enable_ppdb)} 
                                        />
                                        <ToggleSwitch 
                                            label="Modul Ujian Online (CBT)" 
                                            isEnabled={data.enable_cbt} 
                                            onChange={() => setData('enable_cbt', !data.enable_cbt)} 
                                        />
                                        <ToggleSwitch 
                                            label="Modul E-Learning (LMS)" 
                                            isEnabled={data.enable_lms} 
                                            onChange={() => setData('enable_lms', !data.enable_lms)} 
                                        />
                                        <ToggleSwitch 
                                            label="Modul Tagihan & Keuangan" 
                                            isEnabled={data.enable_finance} 
                                            onChange={() => setData('enable_finance', !data.enable_finance)} 
                                        />
                                    </div>
                                    <p className="text-[10px] text-[#8B93A8] mt-3 bg-amber-50 text-amber-700 p-2 rounded-md border border-amber-200">
                                        Mematikan fitur di atas akan otomatis menghilangkan akses menu terkait dari *dashboard* sekolah tersebut.
                                    </p>
                                </div>

                                {/* Modal Footer / Actions */}
                                <div className="pt-6 flex items-center justify-end gap-3 border-t border-[#E2DDD0]">
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
                                        className="px-4 py-2 bg-[#0F1729] text-white rounded-md text-sm font-medium hover:bg-[#1B2742] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Konfigurasi'}
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