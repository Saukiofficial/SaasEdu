import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { BookOpen, CheckCircle, Clock, PlayCircle } from 'lucide-react';

interface Exam {
    id: string;
    title: string;
    duration: number;
    start_time: string;
    end_time: string;
    subject?: { name: string };
}

interface Attempt {
    id: string;
    status: 'pending' | 'in_progress' | 'completed';
    score: string;
}

interface Props {
    exams: Exam[];
    attempts: Record<string, Attempt>;
}

export default function Index({ exams, attempts }: Props) {
    return (
        <AuthenticatedLayout header="Ujian & Tugas Saya">
            <Head title="CBT Siswa" />

            <div className="space-y-6 max-w-5xl mx-auto">
                <div className="bg-[#16213E] p-6 rounded-2xl text-white shadow-lg flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-[#D4AF7A] mb-1">Daftar Ujian Anda</h2>
                        <p className="text-gray-300 text-sm">Pastikan Anda mengerjakan ujian sebelum batas waktu berakhir.</p>
                    </div>
                    <BookOpen className="w-12 h-12 text-[#D4AF7A] opacity-80" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {exams.length > 0 ? (
                        exams.map(exam => {
                            const attempt = attempts[exam.id];
                            const isCompleted = attempt?.status === 'completed';
                            const isInProgress = attempt?.status === 'in_progress';

                            return (
                                <div key={exam.id} className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] p-6 flex flex-col transition-all hover:shadow-md">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-[#FAF8F3] px-3 py-1 rounded text-xs font-semibold text-[#5B5648] border border-[#E2DDD0]">
                                            {exam.subject?.name}
                                        </div>
                                        {isCompleted ? (
                                            <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
                                                <CheckCircle className="w-3.5 h-3.5" /> Selesai
                                            </span>
                                        ) : isInProgress ? (
                                            <span className="text-orange-600 text-xs font-bold bg-orange-50 px-2 py-1 rounded-full">Sedang Dikerjakan</span>
                                        ) : (
                                            <span className="text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded-full">Tersedia</span>
                                        )}
                                    </div>
                                    
                                    <h3 className="text-lg font-bold text-[#16213E] mb-2">{exam.title}</h3>
                                    
                                    <div className="flex items-center gap-4 text-sm text-[#8B93A8] mb-6">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" /> {exam.duration} Menit
                                        </div>
                                    </div>

                                    <div className="mt-auto border-t border-[#E2DDD0] pt-4 flex justify-between items-center">
                                        {isCompleted ? (
                                            <>
                                                <span className="text-sm font-semibold text-[#5B5648]">Nilai Anda:</span>
                                                <span className="text-lg font-bold text-[#16213E] bg-[#FAF8F3] px-4 py-1 rounded border border-[#E2DDD0]">{attempt.score}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-xs text-[#8B93A8] italic">Tutup: {new Date(exam.end_time).toLocaleString('id-ID')}</span>
                                                <Link 
                                                    href={`/student/cbt/${exam.id}/play`}
                                                    className="flex items-center gap-1.5 bg-[#B8935F] hover:bg-[#A37F4B] text-white px-5 py-2 rounded-lg font-semibold text-sm transition-colors"
                                                >
                                                    {isInProgress ? 'Lanjutkan' : 'Mulai Ujian'} <PlayCircle className="w-4 h-4" />
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-16 text-center text-[#8B93A8] bg-white border border-[#E2DDD0] rounded-xl">
                            <CheckCircle className="w-12 h-12 mx-auto text-[#E2DDD0] mb-3" />
                            <p className="text-lg font-medium">Hore! Tidak ada ujian saat ini.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
