import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Building, Building2, Search, Mail, Phone, 
    MoreVertical, ShieldCheck, Users, Package,
    CheckCircle2, Ban, MapPin, Globe
} from 'lucide-react';

interface Subscription {
    id: string;
    package_name: string;
    status: string;
}

interface TenantSetting {
    custom_domain: string | null;
}

interface School {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    status: 'active' | 'suspended' | 'inactive';
    users_count: number;
    created_at: string;
    latest_subscription?: Subscription;
    tenant_setting?: TenantSetting;
}

export default function TenantsIndex({ tenants }: { tenants: any }) {
    const tenantList: School[] = tenants?.data || [];
    const [searchQuery, setSearchQuery] = useState('');

    const handleStatusToggle = (school: School) => {
        const newStatus = school.status === 'active' ? 'suspended' : 'active';
        const actionText = newStatus === 'suspended' ? 'menangguhkan (suspend)' : 'mengaktifkan kembali';
        
        if (confirm(`Apakah Anda yakin ingin ${actionText} akses untuk institusi ${school.name}?`)) {
            router.put(`/super-admin/tenants/${school.id}/status`, { status: newStatus }, {
                preserveScroll: true
            });
        }
    };

    return (
        <AuthenticatedLayout header="Tenant Management">
            <Head title="Manajemen Institusi - AkademiaOS" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-serif font-semibold text-[#0F1729] flex items-center gap-2">
                            <Building className="w-6 h-6 text-[#B8935F]" />
                            Direktori Institusi (Tenant)
                        </h1>
                        <p className="text-sm text-[#8B93A8] mt-1">
                            Pantau seluruh sekolah yang menggunakan layanan SaaS AkademiaOS Anda.
                        </p>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 rounded-xl border border-[#E2DDD0] shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A296]" />
                        <input
                            type="text"
                            placeholder="Cari nama institusi atau email..."
                            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-md text-sm text-[#0F1729] focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <select className="bg-[#FAF8F3] border border-[#E2DDD0] text-[#0F1729] text-sm rounded-md px-3 py-2 outline-none focus:border-[#B8935F] w-full sm:w-auto">
                            <option value="">Semua Status</option>
                            <option value="active">Aktif</option>
                            <option value="suspended">Ditangguhkan</option>
                        </select>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl border border-[#E2DDD0] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#FAF8F3] border-b border-[#E2DDD0] text-[11px] uppercase tracking-wider text-[#8B93A8] font-semibold">
                                    <th className="px-6 py-4">Informasi Institusi</th>
                                    <th className="px-6 py-4 text-center">Pengguna Aktif</th>
                                    <th className="px-6 py-4 text-center">Paket Saat Ini</th>
                                    <th className="px-6 py-4 text-center">Status Layanan</th>
                                    <th className="px-6 py-4 text-center">Akses</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2DDD0]/60">
                                {tenantList.length > 0 ? (
                                    tenantList.map((school: School) => (
                                        <tr key={school.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-[#0F1729]/5 border border-[#E2DDD0] flex items-center justify-center shrink-0">
                                                        <Building2 className="w-5 h-5 text-[#B8935F]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-[#0F1729] mb-1">{school.name}</p>
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-[11px] text-[#8B93A8]">
                                                            <span className="flex items-center gap-1">
                                                                <Mail className="w-3 h-3" /> {school.email}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Phone className="w-3 h-3" /> {school.phone || '-'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E2DDD0] text-[#0F1729] text-xs font-semibold rounded-md">
                                                    <Users className="w-3.5 h-3.5 text-[#B8935F]" />
                                                    {school.users_count} Akun
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 border border-purple-200 text-purple-700 text-[11px] font-bold rounded-md">
                                                    <Package className="w-3 h-3" />
                                                    {school.latest_subscription?.package_name || 'Free / Trial'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {school.status === 'active' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold rounded-md">
                                                        <ShieldCheck className="w-3 h-3" /> Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 text-[11px] font-bold rounded-md">
                                                        <Ban className="w-3 h-3" /> Suspend
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button 
                                                    onClick={() => handleStatusToggle(school)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 border text-[11px] font-semibold rounded-md transition-colors shadow-sm
                                                        ${school.status === 'active' 
                                                            ? 'bg-white border-[#E2DDD0] text-red-600 hover:bg-red-50 hover:border-red-200' 
                                                            : 'bg-[#0F1729] border-[#0F1729] text-white hover:bg-[#1B2742]'
                                                        }
                                                    `}
                                                >
                                                    {school.status === 'active' ? (
                                                        <>Suspen Akun</>
                                                    ) : (
                                                        <>Aktifkan</>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <Building className="w-8 h-8 text-[#E2DDD0] mx-auto mb-3" />
                                            <p className="text-[#8B93A8] text-sm">Belum ada sekolah (tenant) yang terdaftar.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}