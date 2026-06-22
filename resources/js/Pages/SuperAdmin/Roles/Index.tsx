import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Shield, Plus, Search, Edit, Trash2, X, CheckSquare, ShieldCheck, Info
} from 'lucide-react';

interface Role {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    is_system: boolean;
    created_at: string;
}

// Daftar Modul & Hak Akses yang bisa dicentang
const availablePermissions = [
    { id: 'view_dashboard', label: 'Akses Dashboard Utama', module: 'General' },
    { id: 'manage_tenants', label: 'Kelola Tenant & Sekolah', module: 'Tenant Management' },
    { id: 'manage_users', label: 'Kelola Pengguna & Staff', module: 'User Management' },
    { id: 'manage_billing', label: 'Kelola Paket & Keuangan', module: 'Billing & Finance' },
    { id: 'manage_leads', label: 'Kelola Leads & CRM', module: 'CRM & Sales' },
    { id: 'manage_content', label: 'Kelola Broadcast & FAQ', module: 'Content' },
    { id: 'view_reports', label: 'Akses Laporan Analitik', module: 'Analytics' },
    { id: 'manage_tickets', label: 'Balas Tiket Dukungan (Support)', module: 'Support Center' },
    { id: 'manage_settings', label: 'Ubah Pengaturan Sistem', module: 'System Settings' },
];

export default function RolesIndex({ roles }: { roles: any }) {
    const roleList: Role[] = roles?.data || [];
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        description: '',
        permissions: [] as string[],
    });

    const openCreateModal = () => {
        setEditingId(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (role: Role) => {
        setEditingId(role.id);
        setData({
            name: role.name,
            description: role.description || '',
            permissions: role.permissions || [],
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        reset();
    };

    const handleCheckboxChange = (permId: string) => {
        const currentPerms = [...data.permissions];
        if (currentPerms.includes(permId)) {
            setData('permissions', currentPerms.filter(p => p !== permId));
        } else {
            setData('permissions', [...currentPerms, permId]);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(`/super-admin/roles/${editingId}`, { onSuccess: () => closeModal() });
        } else {
            post('/super-admin/roles', { onSuccess: () => closeModal() });
        }
    };

    const handleDelete = (role: Role) => {
        if (role.is_system) {
            alert('Role bawaan sistem tidak dapat dihapus.');
            return;
        }
        if (confirm('Apakah Anda yakin ingin menghapus hak akses ini? Pengguna dengan role ini akan kehilangan aksesnya.')) {
            router.delete(`/super-admin/roles/${role.id}`);
        }
    };

    return (
        <AuthenticatedLayout header="User Management">
            <Head title="Manajemen Hak Akses (Roles) - AkademiaOS" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-serif font-semibold text-[#0F1729] flex items-center gap-2">
                            <Shield className="w-6 h-6 text-[#B8935F]" />
                            Manajemen Peran & Hak Akses (Roles)
                        </h1>
                        <p className="text-sm text-[#8B93A8] mt-1">
                            Tentukan batasan akses menu dan modul bagi Staff internal SaaS Anda.
                        </p>
                    </div>
                    <button 
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-[#0F1729] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#1B2742] transition-colors shadow-sm ring-1 ring-[#0F1729]/10"
                    >
                        <Plus className="w-4 h-4 text-[#D4AF7A]" />
                        Buat Peran Baru
                    </button>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 rounded-xl border border-[#E2DDD0] shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A296]" />
                        <input
                            type="text"
                            placeholder="Cari nama peran (contoh: CS, Sales)..."
                            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-md text-sm text-[#0F1729] focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grid Roles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {roleList.length > 0 ? (
                        roleList.map((role: Role) => (
                            <div key={role.id} className="bg-white p-5 rounded-xl border border-[#E2DDD0] shadow-sm flex flex-col hover:border-[#B8935F] transition-colors group">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[#FAF8F3] border border-[#E2DDD0] flex items-center justify-center shrink-0">
                                            {role.is_system ? <ShieldCheck className="w-5 h-5 text-emerald-600" /> : <Shield className="w-5 h-5 text-[#B8935F]" />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#0F1729] flex items-center gap-2">
                                                {role.name}
                                            </h3>
                                            {role.is_system && <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-bold uppercase">Sistem</span>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditModal(role)} className="p-1.5 text-[#8B93A8] hover:text-[#0F1729] rounded" title="Edit Role">
                                            <Edit className="w-3.5 h-3.5" />
                                        </button>
                                        {!role.is_system && (
                                            <button onClick={() => handleDelete(role)} className="p-1.5 text-[#8B93A8] hover:text-red-600 rounded" title="Hapus Role">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-[#8B93A8] mb-4 flex-1">{role.description || 'Tidak ada deskripsi.'}</p>
                                <div className="pt-4 border-t border-[#E2DDD0] flex items-center justify-between">
                                    <span className="text-xs font-semibold text-[#0F1729] flex items-center gap-1.5">
                                        <CheckSquare className="w-4 h-4 text-[#B8935F]" /> 
                                        {role.permissions?.length || 0} Izin Akses
                                    </span>
                                    <span className="text-[10px] text-[#8B93A8]">
                                        Dibuat: {new Date(role.created_at).toLocaleDateString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-12 rounded-xl border border-[#E2DDD0] shadow-sm text-center">
                            <Shield className="w-10 h-10 text-[#E2DDD0] mx-auto mb-3" />
                            <h3 className="text-[#0F1729] font-medium mb-1">Belum Ada Peran (Role)</h3>
                            <p className="text-[#8B93A8] text-sm">Gunakan tombol Buat Peran Baru di atas untuk menambah konfigurasi hak akses staf Anda.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODAL FORM ROLE --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-[#0F1729]/60 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl relative z-10 flex flex-col max-h-[90vh]">
                        
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2DDD0] bg-[#FAF8F3] rounded-t-2xl">
                            <div>
                                <h2 className="text-lg font-serif font-semibold text-[#0F1729]">{editingId ? 'Edit Peran & Hak Akses' : 'Buat Peran (Role) Baru'}</h2>
                                <p className="text-xs text-[#8B93A8] mt-0.5">Tentukan modul yang dapat diakses oleh peran ini.</p>
                            </div>
                            <button onClick={closeModal} className="text-[#8B93A8] hover:text-[#0F1729] transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[#0F1729]">Nama Peran (Role Name) <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                            placeholder="Contoh: Tim Sales, Customer Service"
                                        />
                                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[#0F1729]">Deskripsi</label>
                                        <input
                                            type="text"
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                            placeholder="Penjelasan singkat tugas peran ini..."
                                        />
                                        {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                                    </div>
                                </div>

                                <div className="border-t border-[#E2DDD0] pt-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Shield className="w-5 h-5 text-[#B8935F]" />
                                        <h3 className="text-sm font-bold text-[#0F1729] uppercase tracking-wider">Konfigurasi Hak Akses (Permissions)</h3>
                                    </div>
                                    
                                    <div className="bg-[#FAF8F3] border border-[#E2DDD0] rounded-xl p-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {availablePermissions.map(perm => (
                                                <label key={perm.id} className="flex items-start gap-3 cursor-pointer group p-2 hover:bg-white rounded-lg transition-colors">
                                                    <div className="flex items-center h-5">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={data.permissions.includes(perm.id)}
                                                            onChange={() => handleCheckboxChange(perm.id)}
                                                            className="w-4 h-4 text-[#B8935F] rounded border-[#E2DDD0] focus:ring-[#B8935F]"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-[#0F1729] group-hover:text-[#B8935F] transition-colors">{perm.label}</span>
                                                        <span className="text-[10px] text-[#8B93A8]">{perm.module}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    {errors.permissions && <p className="text-xs text-red-500 mt-2">{errors.permissions}</p>}
                                </div>

                                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-700 text-xs">
                                    <Info className="w-4 h-4 shrink-0" />
                                    <p>Pastikan Anda hanya memberikan hak akses krusial (seperti Billing/Setting) kepada staf yang berwenang.</p>
                                </div>

                                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E2DDD0]">
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
                                        {processing ? 'Menyimpan...' : 'Simpan Role'}
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