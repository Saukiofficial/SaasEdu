import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Building, GraduationCap, Link as LinkIcon, Save, ShieldCheck } from 'lucide-react';

interface School {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
}

interface Profile {
    npsn: string | null;
    principal_name: string | null;
    website: string | null;
    vision: string | null;
    mission: string | null;
}

interface Props {
    school: School;
    profile: Profile;
}

export default function Index({ school, profile }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        npsn: profile.npsn || '',
        principal_name: profile.principal_name || '',
        website: profile.website || '',
        vision: profile.vision || '',
        mission: profile.mission || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Menggunakan POST karena Inertia tidak mendukung PUT/PATCH dengan file upload (jika nantinya ada upload logo)
        // Jika form murni teks, bisa diganti put(). Di sini kita gunakan post() sesuai Controller.
        post('/master-data/school-profile', {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout header="Profil Sekolah">
            <Head title="Profil Sekolah" />

            <div className="max-w-5xl mx-auto space-y-6">
                
                {/* Info Utama Sekolah (Read-Only) */}
                <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] overflow-hidden p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-[#FAF8F3] border border-[#E2DDD0] rounded-xl flex items-center justify-center shrink-0">
                            <Building className="w-8 h-8 text-[#B8935F]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-serif font-semibold text-[#16213E]">{school.name}</h2>
                            <p className="text-sm text-[#5B5648] mt-1 line-clamp-2">
                                {school.address || 'Alamat belum diatur'}
                            </p>
                            <div className="flex flex-wrap gap-4 mt-3 text-sm text-[#8B93A8]">
                                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> {school.email || 'Email belum diatur'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
                        <strong>Catatan:</strong> Nama Sekolah, Email, dan Alamat Utama dikelola oleh Super Administrator. Hubungi pusat dukungan jika Anda ingin mengubah data tersebut.
                    </div>
                </div>

                {/* Form Profil Sekolah */}
                <form onSubmit={submit} className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] overflow-hidden">
                    <div className="px-6 py-5 border-b border-[#E2DDD0] bg-[#FAF8F3]">
                        <h3 className="font-serif font-semibold text-[#16213E] text-lg">Kelola Identitas & Visi Misi</h3>
                        <p className="text-sm text-[#8B93A8]">Lengkapi informasi detail mengenai sekolah Anda di sini.</p>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* NPSN */}
                            <div>
                                <label className="block text-sm font-medium text-[#5B5648] mb-1">NPSN (Nomor Pokok Sekolah Nasional)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <ShieldCheck className="h-4 w-4 text-[#A8A296]" />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.npsn}
                                        onChange={(e) => setData('npsn', e.target.value)}
                                        className={`w-full pl-10 pr-4 py-2.5 bg-[#FAF8F3] border rounded-lg text-sm focus:ring-1 outline-none transition-all ${errors.npsn ? 'border-red-400 focus:border-red-400' : 'border-[#E2DDD0] focus:border-[#B8935F]'}`}
                                        placeholder="Contoh: 12345678"
                                    />
                                </div>
                                {errors.npsn && <p className="text-red-500 text-xs mt-1">{errors.npsn}</p>}
                            </div>

                            {/* Kepala Sekolah */}
                            <div>
                                <label className="block text-sm font-medium text-[#5B5648] mb-1">Nama Kepala Sekolah</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <GraduationCap className="h-4 w-4 text-[#A8A296]" />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.principal_name}
                                        onChange={(e) => setData('principal_name', e.target.value)}
                                        className={`w-full pl-10 pr-4 py-2.5 bg-[#FAF8F3] border rounded-lg text-sm focus:ring-1 outline-none transition-all ${errors.principal_name ? 'border-red-400 focus:border-red-400' : 'border-[#E2DDD0] focus:border-[#B8935F]'}`}
                                        placeholder="Gelar beserta nama lengkap"
                                    />
                                </div>
                                {errors.principal_name && <p className="text-red-500 text-xs mt-1">{errors.principal_name}</p>}
                            </div>

                            {/* Website */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-[#5B5648] mb-1">Website Resmi Sekolah</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LinkIcon className="h-4 w-4 text-[#A8A296]" />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.website}
                                        onChange={(e) => setData('website', e.target.value)}
                                        className={`w-full pl-10 pr-4 py-2.5 bg-[#FAF8F3] border rounded-lg text-sm focus:ring-1 outline-none transition-all ${errors.website ? 'border-red-400 focus:border-red-400' : 'border-[#E2DDD0] focus:border-[#B8935F]'}`}
                                        placeholder="Contoh: [https://www.smapelita.sch.id](https://www.smapelita.sch.id)"
                                    />
                                </div>
                                {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website}</p>}
                            </div>

                            {/* Visi */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-[#5B5648] mb-1">Visi Sekolah</label>
                                <textarea
                                    value={data.vision}
                                    onChange={(e) => setData('vision', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-all resize-none"
                                    placeholder="Tuliskan Visi sekolah di sini..."
                                ></textarea>
                            </div>

                            {/* Misi */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-[#5B5648] mb-1">Misi Sekolah</label>
                                <textarea
                                    value={data.mission}
                                    onChange={(e) => setData('mission', e.target.value)}
                                    rows={5}
                                    className="w-full px-4 py-3 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none transition-all resize-none"
                                    placeholder="Tuliskan Misi sekolah di sini (bisa menggunakan format nomor atau poin)..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-[#FAF8F3] border-t border-[#E2DDD0] flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 px-6 py-2.5 bg-[#B8935F] hover:bg-[#A37F4B] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-70"
                        >
                            <Save className="w-4 h-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>

            </div>
        </AuthenticatedLayout>
    );
}