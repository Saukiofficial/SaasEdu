import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        school_name: '',
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        error: '', // <-- Tambahkan baris ini agar TypeScript mengenali properti errors.error
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
            <Head title="Daftar Sekolah Baru" />
            <Card className="w-full max-w-lg">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">Daftar Tenant Baru</CardTitle>
                    <CardDescription>Buat akun untuk mengelola sekolah Anda di EduERP</CardDescription>
                </CardHeader>
                <form onSubmit={submit}>
                    <CardContent className="space-y-4">
                        {errors.error && (
                            <div className="p-3 bg-red-100 text-red-600 rounded-md text-sm">
                                {errors.error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="school_name">Nama Sekolah</Label>
                            <Input 
                                id="school_name" 
                                placeholder="Contoh: SMA Negeri 1 Bangsa"
                                value={data.school_name}
                                onChange={(e) => setData('school_name', e.target.value)}
                            />
                            {errors.school_name && <p className="text-sm text-red-500">{errors.school_name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap (Owner)</Label>
                            <Input 
                                id="name" 
                                placeholder="Nama Anda"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">Ulangi Password</Label>
                                <Input 
                                    id="password_confirmation" 
                                    type="password" 
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button className="w-full" type="submit" disabled={processing}>
                            {processing ? 'Memproses...' : 'Daftar Sekarang'}
                        </Button>
                        <div className="text-center text-sm text-slate-500">
                            Sudah punya akun?{' '}
                            <Link href="/login" className="text-blue-600 hover:underline dark:text-blue-400">
                                Masuk di sini
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}