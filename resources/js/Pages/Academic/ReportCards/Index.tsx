import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Printer } from 'lucide-react';

export default function ReportCardIndex({ classrooms, students, reportData, filters, errors: serverErrors }: any) {
    const [classroomId, setClassroomId] = useState(filters.classroom_id || '');
    const [studentId, setStudentId] = useState(filters.student_id || '');

    const handleClassroomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newClassId = e.target.value;
        setClassroomId(newClassId);
        setStudentId(''); // Reset student saat kelas ganti
        router.get('/report-cards', { classroom_id: newClassId }, { preserveState: true });
    };

    const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStudentId = e.target.value;
        setStudentId(newStudentId);
        router.get('/report-cards', { classroom_id: classroomId, student_id: newStudentId }, { preserveState: true });
    };

    // Helper untuk render nilai dengan aman
    const renderScore = (scoresObj: any, type: string) => {
        if (scoresObj && scoresObj[type] !== undefined) {
            return parseFloat(scoresObj[type]).toString();
        }
        return '-';
    };

    return (
        <AuthenticatedLayout header="Cetak E-Rapor">
            <Head title="Cetak Rapor" />

            {/* Filter Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/3 space-y-2">
                        <Label htmlFor="class_filter">Pilih Kelas</Label>
                        <select id="class_filter" value={classroomId} onChange={handleClassroomChange} className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800">
                            <option value="">-- Pilih Kelas --</option>
                            {classrooms.map((cls: any) => (
                                <option key={cls.id} value={cls.id}>{cls.name}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="w-full md:w-1/3 space-y-2">
                        <Label htmlFor="student_filter">Pilih Siswa</Label>
                        <select id="student_filter" value={studentId} onChange={handleStudentChange} className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-slate-800" disabled={!classroomId || students.length === 0}>
                            <option value="">-- Pilih Siswa --</option>
                            {students.map((stu: any) => (
                                <option key={stu.id} value={stu.id}>{stu.name} {stu.nis ? `(${stu.nis})` : ''}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {serverErrors?.error && (
                    <div className="mt-4 p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">
                        {serverErrors.error}
                    </div>
                )}
            </div>

            {/* Report Card Preview Section */}
            {reportData && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 dark:bg-slate-950 dark:border-slate-800">
                    <div className="flex justify-between items-start mb-6 border-b pb-4 border-slate-200 dark:border-slate-800">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Rekapitulasi Nilai Siswa</h2>
                            <p className="text-sm text-slate-500 mt-1">Siswa: <span className="font-semibold text-slate-900 dark:text-white">{reportData.student.name}</span> | T.A: {reportData.academic_year.name}</p>
                        </div>
                        <a href={`/report-cards/${reportData.student.id}/print`} target="_blank" rel="noopener noreferrer">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                <Printer className="w-4 h-4 mr-2" />
                                Download PDF Rapor
                            </Button>
                        </a>
                    </div>

                    <div className="border rounded-lg overflow-hidden dark:border-slate-800">
                        <Table>
                            <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                                <TableRow>
                                    <TableHead className="w-16 text-center">No</TableHead>
                                    <TableHead>Mata Pelajaran</TableHead>
                                    <TableHead className="text-center">Tugas 1</TableHead>
                                    <TableHead className="text-center">Tugas 2</TableHead>
                                    <TableHead className="text-center">Tugas 3</TableHead>
                                    <TableHead className="text-center">UTS</TableHead>
                                    <TableHead className="text-center">UAS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.keys(reportData.grades).length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                                            Siswa ini belum memiliki data nilai pada semester ini.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    Object.keys(reportData.grades).map((subjectName, index) => {
                                        const scores = reportData.grades[subjectName];
                                        return (
                                            <TableRow key={index}>
                                                <TableCell className="text-center">{index + 1}</TableCell>
                                                <TableCell className="font-semibold">{subjectName}</TableCell>
                                                <TableCell className="text-center">{renderScore(scores, 'Tugas 1')}</TableCell>
                                                <TableCell className="text-center">{renderScore(scores, 'Tugas 2')}</TableCell>
                                                <TableCell className="text-center">{renderScore(scores, 'Tugas 3')}</TableCell>
                                                <TableCell className="text-center font-medium">{renderScore(scores, 'UTS')}</TableCell>
                                                <TableCell className="text-center font-bold text-blue-700 dark:text-blue-400">{renderScore(scores, 'UAS')}</TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
