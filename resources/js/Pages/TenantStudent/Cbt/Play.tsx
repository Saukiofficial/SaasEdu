import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { Clock, CheckSquare, ChevronRight, ChevronLeft, Send } from 'lucide-react';
import axios from 'axios';

interface Option {
    id: string;
    option_text: string;
}

interface Question {
    id: string;
    question: string;
    options: Option[];
}

interface Props {
    exam: {
        id: string;
        title: string;
    };
    questions: Question[];
    savedAnswers: Record<string, string>; // { question_id: option_id }
    timeRemainingMs: number;
}

export default function Play({ exam, questions, savedAnswers, timeRemainingMs }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>(savedAnswers || {});
    const [timeLeft, setTimeLeft] = useState(timeRemainingMs);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Format waktu mundur
    useEffect(() => {
        if (timeLeft <= 0) {
            handleFinish();
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1000), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Fungsi menyimpan jawaban otomatis di belakang layar
    const handleAnswer = (questionId: string, optionId: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionId }));
        
        axios.post(`/student/cbt/${exam.id}/answer`, {
            question_id: questionId,
            option_id: optionId
        }).catch(err => console.error("Gagal menyimpan jawaban otomatis", err));
    };

    const handleFinish = () => {
        if (isSubmitting) return;
        if (timeLeft > 0 && !confirm("Yakin ingin menyelesaikan ujian sekarang? Jawaban tidak bisa diubah lagi.")) return;
        
        setIsSubmitting(true);
        router.post(`/student/cbt/${exam.id}/finish`);
    };

    const currentQuestion = questions[currentIndex];

    return (
        <div className="min-h-screen bg-[#F4F1EA] font-sans flex flex-col">
            <Head title={exam.title} />

            {/* Header Sticky */}
            <div className="bg-[#16213E] text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-50">
                <h1 className="font-serif font-bold text-lg hidden sm:block truncate pr-4">{exam.title}</h1>
                <div className="flex items-center gap-4 ml-auto">
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg font-mono text-xl tracking-wider text-[#D4AF7A]">
                        <Clock className="w-5 h-5" /> {formatTime(timeLeft)}
                    </div>
                    <button 
                        onClick={handleFinish}
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg font-semibold text-sm transition flex items-center gap-2"
                    >
                        {isSubmitting ? 'Memproses...' : 'Kumpulkan'} <Send className="w-4 h-4 hidden sm:block" />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row max-w-6xl mx-auto w-full gap-6 p-4 py-8">
                
                {/* Panel Soal Utama */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-[#E2DDD0] overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-[#E2DDD0] bg-[#FAF8F3] flex justify-between items-center">
                        <h2 className="font-bold text-[#16213E] text-lg">Soal No. {currentIndex + 1}</h2>
                        <span className="text-sm font-semibold text-[#A8A296]">{Object.keys(answers).length} Terjawab dari {questions.length}</span>
                    </div>

                    {currentQuestion ? (
                        <div className="p-8 flex-1">
                            <p className="text-lg text-[#1C2333] mb-8 leading-relaxed whitespace-pre-wrap">{currentQuestion.question}</p>
                            
                            <div className="space-y-3">
                                {currentQuestion.options.map((opt, idx) => {
                                    const isSelected = answers[currentQuestion.id] === opt.id;
                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleAnswer(currentQuestion.id, opt.id)}
                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${isSelected ? 'border-[#B8935F] bg-[#FAF8F3]' : 'border-[#E2DDD0] hover:border-gray-300'}`}
                                        >
                                            <div className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center mt-0.5 ${isSelected ? 'border-[#B8935F] bg-[#B8935F]' : 'border-gray-300'}`}>
                                                {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                            </div>
                                            <div className="flex-1 text-[15px] font-medium text-[#5B5648] pt-0.5">
                                                <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                                                {opt.option_text}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">Soal tidak ditemukan.</div>
                    )}

                    {/* Navigasi Bawah */}
                    <div className="p-6 border-t border-[#E2DDD0] bg-gray-50 flex justify-between">
                        <button 
                            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                            disabled={currentIndex === 0}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E2DDD0] rounded-lg font-semibold text-[#5B5648] hover:bg-gray-100 disabled:opacity-50"
                        >
                            <ChevronLeft className="w-4 h-4" /> Sebelumnya
                        </button>
                        <button 
                            onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                            disabled={currentIndex === questions.length - 1}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#16213E] text-white rounded-lg font-semibold hover:bg-[#1C2A4F] disabled:opacity-50"
                        >
                            Selanjutnya <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Panel Navigasi Nomor Soal (Sidebar) */}
                <div className="w-full md:w-72 bg-white rounded-2xl shadow-sm border border-[#E2DDD0] p-6 h-max">
                    <h3 className="font-bold text-[#16213E] mb-4 flex items-center gap-2"><CheckSquare className="w-5 h-5 text-[#B8935F]" /> Peta Soal</h3>
                    <div className="grid grid-cols-5 gap-2">
                        {questions.map((q, idx) => {
                            const isAnswered = !!answers[q.id];
                            const isCurrent = idx === currentIndex;
                            return (
                                <button
                                    key={q.id}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`w-full aspect-square rounded-lg font-bold text-sm flex items-center justify-center transition-all ${
                                        isCurrent ? 'ring-2 ring-offset-2 ring-[#B8935F] bg-[#16213E] text-white' : 
                                        isAnswered ? 'bg-[#B8935F] text-white' : 'bg-[#FAF8F3] border border-[#E2DDD0] text-[#5B5648] hover:bg-gray-200'
                                    }`}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}
