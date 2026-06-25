import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ArrowLeft, Plus, Edit2, Trash2, X, AlertTriangle, CheckCircle2, Circle } from 'lucide-react';

interface Option {
    id?: string;
    option_text: string;
    is_correct: boolean;
}

interface Question {
    id: string;
    question: string;
    options: Option[];
}

interface Exam {
    id: string;
    title: string;
    duration_minutes: number;
    subject?: { name: string };
    classroom?: { name: string };
}

interface Props {
    exam: Exam;
    questions: Question[];
}

export default function Questions({ exam, questions }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<Question | null>(null);
    const [recordToDelete, setRecordToDelete] = useState<Question | null>(null);

    // Default template untuk 4 pilihan ganda (A, B, C, D)
    const defaultOptions = [
        { option_text: '', is_correct: true }, // Default opsi pertama benar
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
    ];

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        question: '',
        options: defaultOptions,
    });

    const openCreateModal = () => {
        clearErrors();
        reset();
        setData('options', defaultOptions);
        setEditingRecord(null);
        setIsModalOpen(true);
    };

    const openEditModal = (record: Question) => {
        clearErrors();
        setEditingRecord(record);
        setData({
            question: record.question,
            options: record.options.map(opt => ({
                id: opt.id,
                option_text: opt.option_text,
                is_correct: opt.is_correct
            })),
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleOptionTextChange = (index: number, text: string) => {
        const newOptions = [...data.options];
        newOptions[index].option_text = text;
        setData('options', newOptions);
    };

    const handleSetCorrectOption = (index: number) => {
        const newOptions = data.options.map((opt, i) => ({
            ...opt,
            is_correct: i === index // Hanya 1 yang bisa benar
        }));
        setData('options', newOptions);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validasi mandiri: Pastikan ada jawaban benar
        if (!data.options.some(opt => opt.is_correct)) {
            alert('Silakan pilih minimal 1 kunci jawaban yang benar!');
            return;
        }

        if (editingRecord) {
            put(`/exams/${exam.id}/questions/${editingRecord.id}`, { onSuccess: () => closeModal() });
        } else {
            post(`/exams/${exam.id}/questions`, { onSuccess: () => closeModal() });
        }
    };

    const confirmDelete = (record: Question) => {
        setRecordToDelete(record);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = () => {
        if (recordToDelete) {
            destroy(`/exams/${exam.id}/questions/${recordToDelete.id}`, { onSuccess: () => setIsDeleteModalOpen(false) });
        }
    };

    return (
        <AuthenticatedLayout header="Manajemen Soal Ujian">
            <Head title="Bank Soal Ujian" />

            <div className="max-w-5xl mx-auto space-y-6">
                
                <div className="flex items-center gap-4">
                    <Link href="/exams" className="p-2 bg-white border border-[#E2DDD0] rounded-lg text-[#5B5648] hover:bg-[#FAF8F3] transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-serif font-semibold text-[#16213E]">{exam.title}</h2>
                        <p className="text-sm text-[#8B93A8]">
                            {exam.subject?.name} • Kelas {exam.classroom?.name} • {exam.duration_minutes} Menit
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] overflow-hidden">
                    <div className="p-5 border-b border-[#E2DDD0] flex justify-between items-center bg-[#FAF8F3]">
                        <h3 className="font-semibold text-[#16213E]">Daftar Soal ({questions.length})</h3>
                        <button
                            onClick={openCreateModal}
                            className="bg-[#16213E] hover:bg-[#1C2A4F] text-[#D4AF7A] px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Tambah Soal
                        </button>
                    </div>

                    <div className="divide-y divide-[#E2DDD0]">
                        {questions.length > 0 ? (
                            questions.map((q, index) => (
                                <div key={q.id} className="p-6 hover:bg-[#FAF8F3]/30 transition-colors">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 shrink-0 bg-[#F4F1EA] text-[#5B5648] font-bold rounded-full flex items-center justify-center">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium text-[#16213E] mb-4 text-base leading-relaxed whitespace-pre-wrap">{q.question}</p>
                                                <div className="space-y-2">
                                                    {q.options.map((opt, optIndex) => (
                                                        <div key={optIndex} className={`flex items-start gap-3 p-2 rounded-lg border ${opt.is_correct ? 'bg-green-50 border-green-200' : 'bg-white border-[#E2DDD0]'}`}>
                                                            <div className="mt-0.5">
                                                                {opt.is_correct ? (
                                                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                                ) : (
                                                                    <Circle className="w-4 h-4 text-gray-300" />
                                                                )}
                                                            </div>
                                                            <span className={`text-sm ${opt.is_correct ? 'text-green-800 font-semibold' : 'text-[#5B5648]'}`}>
                                                                {opt.option_text}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 shrink-0">
                                            <button onClick={() => openEditModal(q)} className="p-2 text-[#8B93A8] hover:text-[#B8935F] hover:bg-[#FAF8F3] rounded-lg transition-colors border border-transparent hover:border-[#E2DDD0]">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => confirmDelete(q)} className="p-2 text-[#8B93A8] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-16 text-center text-[#8B93A8]">
                                <p className="text-lg mb-2">Belum ada soal untuk ujian ini.</p>
                                <p className="text-sm">Silakan klik tombol "Tambah Soal" untuk mulai menyusun bank soal.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1020]/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden my-auto">
                        <div className="px-6 py-4 border-b border-[#E2DDD0] flex justify-between items-center bg-[#FAF8F3] sticky top-0 z-10">
                            <h3 className="font-serif font-semibold text-[#16213E]">
                                {editingRecord ? 'Edit Soal' : 'Buat Soal Baru'}
                            </h3>
                            <button onClick={closeModal} className="text-[#8B93A8] hover:text-[#16213E]">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={submit} className="p-6 space-y-6">
                            
                            <div>
                                <label className="block text-sm font-semibold text-[#16213E] mb-2">Pertanyaan Soal <span className="text-red-500">*</span></label>
                                <textarea 
                                    value={data.question} 
                                    onChange={e => setData('question', e.target.value)} 
                                    rows={4} 
                                    className="w-full px-4 py-3 bg-[#FAF8F3] border border-[#E2DDD0] rounded-xl text-sm focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none resize-none" 
                                    required 
                                    placeholder="Tuliskan pertanyaan di sini..."
                                />
                                {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#16213E] mb-2">Pilihan Ganda & Kunci Jawaban <span className="text-red-500">*</span></label>
                                <p className="text-xs text-[#8B93A8] mb-3">Ketikkan pilihan jawaban dan klik tombol radio di sebelah kiri untuk menentukan kunci jawaban yang benar.</p>
                                
                                <div className="space-y-3">
                                    {data.options.map((opt, idx) => (
                                        <div key={idx} className={`flex items-center gap-3 p-3 border rounded-xl transition-all ${opt.is_correct ? 'bg-green-50 border-green-400 shadow-sm' : 'bg-white border-[#E2DDD0]'}`}>
                                            <input 
                                                type="radio" 
                                                name="correct_answer" 
                                                checked={opt.is_correct} 
                                                onChange={() => handleSetCorrectOption(idx)}
                                                className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300 cursor-pointer"
                                            />
                                            <div className="font-bold text-[#A8A296] w-6 text-center">{String.fromCharCode(65 + idx)}.</div>
                                            <input 
                                                type="text" 
                                                value={opt.option_text} 
                                                onChange={e => handleOptionTextChange(idx, e.target.value)}
                                                className="flex-1 px-3 py-2 bg-transparent border-none focus:ring-0 text-sm outline-none placeholder:text-gray-300"
                                                placeholder={`Teks pilihan ${String.fromCharCode(65 + idx)}...`}
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>
                                {errors.options && <p className="text-red-500 text-xs mt-2">{errors.options}</p>}
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-[#E2DDD0]">
                                <button type="button" onClick={closeModal} className="px-4 py-2.5 text-sm font-medium text-[#5B5648] hover:bg-[#FAF8F3] rounded-lg transition-colors">
                                    Batal
                                </button>
                                <button type="submit" disabled={processing} className="px-6 py-2.5 bg-[#B8935F] hover:bg-[#A37F4B] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-70">
                                    {processing ? 'Menyimpan...' : 'Simpan Soal'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1020]/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="font-serif font-semibold text-lg text-[#16213E] mb-2">Hapus Soal?</h3>
                        <p className="text-sm text-[#8B93A8] mb-6">
                            Yakin ingin menghapus soal ini beserta pilihan jawabannya?
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-[#5B5648] bg-[#FAF8F3] hover:bg-[#E2DDD0] rounded-lg transition-colors">
                                Batal
                            </button>
                            <button onClick={executeDelete} disabled={processing} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-70">
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
