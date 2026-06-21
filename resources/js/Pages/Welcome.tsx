import React from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Rocket } from 'lucide-react';

export default function Welcome() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center space-y-6 bg-slate-50 p-4 dark:bg-slate-900">
            <Head title="Welcome to EduERP" />
            
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                    EduERP SaaS
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Sistem Informasi Manajemen Sekolah Modern
                </p>
            </div>

            <div className="flex gap-4">
                <Button>
                    <Rocket className="mr-2 h-4 w-4" />
                    Mulai Jelajahi
                </Button>
                <Button variant="outline">
                    Dokumentasi
                </Button>
            </div>
        </div>
    );
}