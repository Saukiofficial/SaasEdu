import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard() {
    const { auth } = usePage<any>().props;
    const user = auth.user;
    const roles = user.roles ? user.roles.map((r: any) => r.name).join(', ') : 'No Role';
    const subscription = user.school?.latest_subscription;

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    return (
        <AuthenticatedLayout header="Dashboard Utama">
            <Head title="Dashboard" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border rounded-xl bg-white shadow-sm dark:bg-slate-950 dark:border-slate-800">
                    <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white">Profil Pengguna</h3>
                    <ul className="space-y-4 text-slate-600 dark:text-slate-300">
                        <li className="flex flex-col"><span className="text-xs text-slate-400">Nama Lengkap</span> <strong className="text-sm">{user.name}</strong></li>
                        <li className="flex flex-col"><span className="text-xs text-slate-400">Email Akses</span> <strong className="text-sm">{user.email}</strong></li>
                        <li className="flex flex-col"><span className="text-xs text-slate-400">Hak Akses</span> 
                            <div><span className="inline-block mt-1 px-2.5 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-bold">{roles}</span></div>
                        </li>
                    </ul>
                </div>
                
                <div className="p-6 border rounded-xl bg-white shadow-sm dark:bg-slate-950 dark:border-slate-800">
                    <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white">Status Layanan SaaS</h3>
                    {user.school ? (
                        subscription ? (
                            <ul className="space-y-4 text-slate-600 dark:text-slate-300">
                                <li className="flex flex-col"><span className="text-xs text-slate-400">Nama Tenant</span> 
                                    <strong className="text-sm text-slate-900 dark:text-white">{user.school.name}</strong>
                                </li>
                                <li className="flex flex-col"><span className="text-xs text-slate-400">Paket Langganan</span> 
                                    <strong className="text-sm text-emerald-600 dark:text-emerald-400">{subscription.plan_name}</strong>
                                </li>
                                <li className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400">Status</span> 
                                        <strong className="text-sm capitalize">{subscription.status}</strong>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400">Berlaku Sampai</span> 
                                        <strong className="text-sm">{formatDate(subscription.end_date)}</strong>
                                    </div>
                                </li>
                            </ul>
                        ) : (
                            <p className="text-sm text-yellow-600">Data langganan tidak ditemukan.</p>
                        )
                    ) : (
                        <p className="text-sm text-slate-500">Anda masuk sebagai Super Admin. Modul ini digunakan untuk mengelola seluruh tenant SaaS.</p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}