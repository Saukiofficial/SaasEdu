import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';

export default function GradeIndex({ classrooms, subjects, students, existing_grades, active_year, filters, flash, errors: serverErrors }: any) {
    const [classroomId, setClassroomId] = useState(filters.classroom_id || '');
    const [subjectId, setSubjectId] = useState(filters.subject_id || '');
    const [type, setType] = useState(filters.type || '');

    const types = ['Tugas 1', 'Tugas 2', 'Tugas 3', 'UTS', 'UAS'];

    const { data, setData, post, processing } = useForm({
        classroom_id: filters.classroom_id || '',
        subject_id: filters.subject_id || '',
        type: filters.type || '',
        grades: [] as any[],
    });

    useEffect(() => {
        if (students && students.length > 0) {
            const initialGrades = students.map((student: any) => {
                const existingRecord = existing_grades[student.id];
                return {
                    student_id: student.id,
                    score: existingRecord ? existingRecord.score : 0,
                    description: existingRecord ? existingRecord.description || '' : '',
                };
            });
            setData('grades', initialGrades);
        }
    }, [students, existing_grades]);

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (classroomId && subjectId && type) {
            router.get('/grades', { classroom_id: classroomId, subject_id: subjectId, type: type }, { preserveState: true });
            setData('classroom_id', classroomId);
            setData('subject_id', subjectId);
            setData('type', type);
        } else {
            alert('Silakan lengkapi semua pilihan (Kelas, Mapel, Jenis Nilai).');
        }
    };

    const handleGradeChange = (studentId: string, field: string, value: string | number) => {
        const updatedGrades = data.grades.map((g: any) => 
            g.student_id === studentId ? { ...g, [field]: value } : g
        );
        setData('grades', updatedGrades);
    };

    const submitGrades = (e: React.FormEvent) => {
        e.preventDefault();
        post('/grades', { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout header="Input Nilai Siswa">
            <Head title="Input Nilai" />
            
            {!active_year && (
                <div className="mb-6 p-4 text-sm text-red-800 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400">
                    Sistem belum mendeteksi "Tahun Ajaran Aktif". Silakan set minimal satu Tahun Ajaran menjadi aktif di Master Data.
                </div>
            )}

            {/* Filter Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 mb-6">
                <form onSubmit={handleFilterSubmit} className="flex flex-col md:flex-row items-end gap-4">
                    <div className="w-full md:w-1/4 space-y-2">
                        <Label htmlFor="class_filter">Kelas</Label>
                        <select id="class_filter" value={classroomId} onChange={e => setClassroomId(e.target.value)} className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800" required>
                            <option value="">-- Pilih Kelas --</option>
                            {classrooms.map((cls: any) => (
                                <option key={cls.id} value={cls.id}>{cls.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full md:w-1/4 space-y-2">
                        <Label htmlFor="subject_filter">Mata Pelajaran</Label>
                        <select id="subject_filter" value={subjectId} onChange={e => setSubjectId(e.target.value)} className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800" required>
                            <option value="">-- Pilih Mapel --</option>
                            {subjects.map((sub: any) => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full md:w-1/4 space-y-2">
                        <Label htmlFor="type_filter">Jenis Nilai</Label>
                        <select id="type_filter" value={type} onChange={e => setType(e.target.value)} className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800" required>
                            <option value="">-- Pilih Jenis --</option>
                            {types.map((t: string) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full md:w-1/4">
                        <Button type="submit" className="w-full" disabled={!active_year}>Tampilkan Data</Button>
                    </div>
                </form>
            </div>

            {/* Grades Form Section */}
            {students && students.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 dark:bg-slate-950 dark:border-slate-800">
                    <div className="mb-4 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Pengisian Nilai: <span className="text-blue-600">{type}</span></h2>
                        <span className="text-sm px-3 py-1 bg-slate-100 text-slate-800 rounded-full font-medium dark:bg-slate-800 dark:text-slate-300">
                            T.A: {active_year.name}
                        </span>
                    </div>

                    {flash?.message && (
                        <div className="mb-4 p-4 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">
                            {flash.message}
                        </div>
                    )}
                    {serverErrors?.error && (
                        <div className="mb-4 p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">
                            {serverErrors.error}
                        </div>
                    )}

                    <form onSubmit={submitGrades}>
                        <div className="border rounded-lg overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead className="w-12 text-center">No</TableHead>
                                        <TableHead>Nama Siswa</TableHead>
                                        <TableHead>NIS</TableHead>
                                        <TableHead className="w-32 text-center">Nilai (0-100)</TableHead>
                                        <TableHead>Catatan Guru (Opsional)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students.map((student: any, index: number) => {
                                        const currentGrade = data.grades.find((g:any) => g.student_id === student.id) || { score: 0, description: '' };
                                        
                                        return (
                                            <TableRow key={student.id}>
                                                <TableCell className="text-center">{index + 1}</TableCell>
                                                <TableCell className="font-bold">{student.name}</TableCell>
                                                <TableCell className="text-slate-500">{student.nis || '-'}</TableCell>
                                                <TableCell>
                                                    <Input 
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max="100"
                                                        className="h-9 text-center font-semibold"
                                                        value={currentGrade.score}
                                                        onChange={(e) => handleGradeChange(student.id, 'score', e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input 
                                                        placeholder="Sangat baik..." 
                                                        className="h-9 text-sm"
                                                        value={currentGrade.description}
                                                        onChange={(e) => handleGradeChange(student.id, 'description', e.target.value)}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button type="submit" size="lg" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Semua Nilai'}
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                filters.classroom_id && filters.subject_id && filters.type && (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
                        <p className="text-slate-500">Tidak ada siswa yang ditemukan di kelas ini.</p>
                    </div>
                )
            )}
        </AuthenticatedLayout>
    );
}
