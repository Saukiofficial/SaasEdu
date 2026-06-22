import React, { useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Users, Plus, Search, Mail, Building2, 
    MoreVertical, Trash2, X, Shield, UserCheck, KeySquare
} from 'lucide-react';

interface School {
    id: string;
    name: string;
}

interface UserData {
    id: string;
    name: string;
    email: string;
    school_id: string | null;
    created_at: string;
    school?: School;
}

export default function UsersIndex({ users }: { users: any }) {
    const { auth } = usePage<any>().props;
    const currentUser = auth?.user;
    
    const userList: UserData[] = users?.data || [];
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form setup menggunakan Inertia untuk tambah Staff
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
    });

    const openCreateModal = () => {
        reset();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/super-admin/users', { 
            onSuccess: () => closeModal() 
        });
    };

    const handleDelete = (id: string) => {
        if (id === currentUser.id) {
            alert('Anda tidak bisa menghapus akun Anda sendiri!');
            return;
        }

        if (confirm('Peringatan: Menghapus pengguna ini tidak dapat dibatalkan. Yakin ingin melanjutkan?')) {
            router.delete(`/super-admin/users/${id}`);
        }
    };

    return (
        <AuthenticatedLayout header="User Management">
            <Head title="Manajemen Pengguna - AkademiaOS" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-serif font-semibold text-[#0F1729] flex items-center gap-2">
                            <Users className="w-6 h-6 text-[#B8935F]" />
                            Direktori Pengguna Sistem
                        </h1>
                        <p className="text-sm text-[#8B93A8] mt-1">
                            Kelola seluruh akun Admin Sekolah dan tambahkan Staff internal SaaS.
                        </p>
                    </div>
                    <button 
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-[#0F1729] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#1B2742] transition-colors shadow-sm ring-1 ring-[#0F1729]/10"
                    >
                        <Plus className="w-4 h-4 text-[#D4AF7A]" />
                        Tambah Staff SaaS
                    </button>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 rounded-xl border border-[#E2DDD0] shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A296]" />
                        <input
                            type="text"
                            placeholder="Cari nama atau email pengguna..."
                            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-md text-sm text-[#0F1729] focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <select className="bg-[#FAF8F3] border border-[#E2DDD0] text-[#0F1729] text-sm rounded-md px-3 py-2 outline-none focus:border-[#B8935F] w-full sm:w-auto">
                            <option value="">Semua Tipe Akun</option>
                            <option value="saas">Staff & Super Admin (SaaS)</option>
                            <option value="tenant">Admin Sekolah (Tenant)</option>
                        </select>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl border border-[#E2DDD0] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#FAF8F3] border-b border-[#E2DDD0] text-[11px] uppercase tracking-wider text-[#8B93A8] font-semibold">
                                    <th className="px-6 py-4">Pengguna</th>
                                    <th className="px-6 py-4">Institusi Asal</th>
                                    <th className="px-6 py-4 text-center">Level / Role</th>
                                    <th className="px-6 py-4">Tanggal Bergabung</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2DDD0]/60">
                                {userList.length > 0 ? (
                                    userList.map((usr: UserData) => {
                                        const isSaaS = usr.school_id === null;
                                        
                                        return (
                                            <tr key={usr.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 font-serif font-semibold ${isSaaS ? 'bg-[#1B2742] border-[#B8935F]/30 text-[#D4AF7A]' : 'bg-[#FAF8F3] border-[#E2DDD0] text-[#0F1729]'}`}>
                                                            {usr.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-[#0F1729] mb-0.5 flex items-center gap-1.5">
                                                                {usr.name}
                                                                {currentUser.id === usr.id && (
                                                                    <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded uppercase tracking-wide">Anda</span>
                                                                )}
                                                            </p>
                                                            <p className="text-[11px] text-[#8B93A8] flex items-center gap-1">
                                                                <Mail className="w-3 h-3" /> {usr.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-medium text-[#0F1729] flex items-center gap-1.5">
                                                        {isSaaS ? (
                                                            <>
                                                                <Shield className="w-3.5 h-3.5 text-[#B8935F]" />
                                                                Pusat (SaaS Internal)
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Building2 className="w-3.5 h-3.5 text-[#A8A296]" />
                                                                {usr.school?.name || 'Sekolah Tidak Ditemukan'}
                                                            </>
                                                        )}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {isSaaS ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold rounded-md">
                                                            <UserCheck className="w-3 h-3" /> Staff SaaS
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold rounded-md">
                                                            <Users className="w-3 h-3" /> Tenant Admin
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-[#8B93A8]">
                                                    {new Date(usr.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric', month: 'short', year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button 
                                                        onClick={() => handleDelete(usr.id)}
                                                        disabled={currentUser.id === usr.id}
                                                        className="p-1.5 text-[#8B93A8] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed" 
                                                        title="Hapus Pengguna"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <Users className="w-8 h-8 text-[#E2DDD0] mx-auto mb-3" />
                                            <p className="text-[#8B93A8] text-sm">Belum ada data pengguna.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- MODAL FORM TAMBAH STAFF --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-[#0F1729]/60 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 flex flex-col max-h-[90vh]">
                        
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2DDD0] bg-[#FAF8F3] rounded-t-2xl">
                            <div>
                                <h2 className="text-lg font-serif font-semibold text-[#0F1729]">Tambah Staff SaaS Baru</h2>
                                <p className="text-xs text-[#8B93A8] mt-0.5">Akun ini memiliki hak akses penuh ke panel Super Admin.</p>
                            </div>
                            <button onClick={closeModal} className="text-[#8B93A8] hover:text-[#0F1729] transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form onSubmit={submit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[#0F1729]">Nama Lengkap <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                        placeholder="Contoh: Budi Santoso"
                                    />
                                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[#0F1729]">Alamat Email <span className="text-red-500">*</span></label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                        placeholder="budi@akademiaos.com"
                                    />
                                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[#0F1729]">Password <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <KeySquare className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A296]" />
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2DDD0] rounded-md text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-colors"
                                            placeholder="Minimal 8 karakter"
                                        />
                                    </div>
                                    {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
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
                                        {processing ? 'Menyimpan...' : 'Simpan Akun Staff'}
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