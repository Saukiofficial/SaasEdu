import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Building2, CheckCircle2 } from 'lucide-react';

export default function PpdbLanding({ school, flash }: any) {
    const { data, setData, post, processing, errors, reset } = useForm({
        full_name: '',
        nisn: '',
        email: '',
        phone: '',
        previous_school: '',
        address: '',
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/ppdb/${school.id}`, {
            onSuccess: () => {
                reset();
                setIsSubmitted(true);
            },
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Head title={`PPDB - ${school.name}`} />

            {/* Header Sekolah */}
            <header className="bg-white border-b border-slate-200 py-6 dark:bg-slate-950 dark:border-slate-800">
                <div className="max-w-4xl mx-auto px-4 flex items-center justify-center sm:justify-start">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 mr-4">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">PPDB Online</h1>
                        <p className="text-slate-500 font-medium">{school.name}</p>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-12">
                {flash?.message && isSubmitted ? (
                    <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800">
                        <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                            <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-400">Pendaftaran Berhasil!</h2>
                                <p className="text-emerald-600 dark:text-emerald-500">
                                    {flash.message}
                                </p>
                                <p className="text-sm text-emerald-600 mt-4">
                                    Harap simpan nomor registrasi Anda. Pihak sekolah akan segera menghubungi Anda untuk informasi lebih lanjut.
                                </p>
                            </div>
                            <Button className="mt-6" variant="outline" onClick={() => setIsSubmitted(false)}>
                                Daftar Siswa Lain
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="shadow-lg">
                        <CardHeader className="text-center space-y-2 pb-6 border-b">
                            <CardTitle className="text-2xl">Formulir Pendaftaran Siswa Baru</CardTitle>
                            <CardDescription>
                                Silakan lengkapi data diri calon siswa dengan benar dan valid.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="full_name">Nama Lengkap Siswa <span className="text-red-500">*</span></Label>
                                    <Input id="full_name" placeholder="Sesuai Akte Kelahiran / Ijazah" value={data.full_name} onChange={e => setData('full_name', e.target.value)} required />
                                    {errors.full_name && <p className="text-sm text-red-500">{errors.full_name}</p>}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="nisn">NISN</Label>
                                        <Input id="nisn" placeholder="Nomor Induk Siswa Nasional" value={data.nisn} onChange={e => setData('nisn', e.target.value)} />
                                        {errors.nisn && <p className="text-sm text-red-500">{errors.nisn}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="previous_school">Asal Sekolah</Label>
                                        <Input id="previous_school" placeholder="Nama sekolah sebelumnya" value={data.previous_school} onChange={e => setData('previous_school', e.target.value)} />
                                        {errors.previous_school && <p className="text-sm text-red-500">{errors.previous_school}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Nomor Telepon / WhatsApp <span className="text-red-500">*</span></Label>
                                        <Input id="phone" placeholder="08123456789" value={data.phone} onChange={e => setData('phone', e.target.value)} required />
                                        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Alamat Email</Label>
                                        <Input id="email" type="email" placeholder="email@contoh.com" value={data.email} onChange={e => setData('email', e.target.value)} />
                                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Alamat Lengkap Tempat Tinggal</Label>
                                    <textarea 
                                        id="address" 
                                        rows={3}
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        className="flex w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                                        placeholder="Nama Jalan, RT/RW, Kelurahan, Kecamatan..."
                                    />
                                    {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                                </div>

                                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                                    <Button type="submit" className="w-full text-lg h-12" disabled={processing}>
                                        {processing ? 'Memproses Pendaftaran...' : 'Kirim Formulir Pendaftaran'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}
