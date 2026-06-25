import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Printer, Building } from 'lucide-react';

interface ReportProps {
    academicYear: {
        id: string;
        name: string;
    };
    schoolProfile: {
        principal_name: string | null;
        npsn: string | null;
    } | null;
    reportData: {
        student: {
            name: string;
            nis: string | null;
            nisn: string | null;
            classroom?: { name: string };
        };
        grades: {
            subject_name: string;
            subject_type: string;
            final_score: number;
            predicate: string;
        }[];
        attendance: {
            sick: number;
            leave: number;
            absent: number;
        };
    };
}

export default function Show({ academicYear, schoolProfile, reportData }: ReportProps) {
    const { student, grades, attendance } = reportData;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans print:bg-white print:m-0">
            <Head title={`Rapor - ${student.name}`} />

            {/* Aksi Non-Print (Disembunyikan saat cetak) */}
            <div className="bg-[#16213E] p-4 text-white flex justify-between items-center print:hidden shadow-md sticky top-0 z-50">
                <Link href="/report-cards" className="flex items-center gap-2 hover:text-[#D4AF7A] transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar
                </Link>
                <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-[#D4AF7A] hover:bg-[#B8935F] text-[#16213E] px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                    <Printer className="w-4 h-4" /> Cetak Rapor (Ctrl+P)
                </button>
            </div>

            {/* Lembar Cetak Rapor (Kertas A4) */}
            <div className="max-w-[210mm] mx-auto bg-white min-h-[297mm] p-[10mm] md:p-[20mm] shadow-lg my-8 print:shadow-none print:my-0 print:w-full">
                
                {/* Header Kop Rapor */}
                <div className="text-center border-b-4 border-black pb-4 mb-6">
                    <h1 className="text-2xl font-bold uppercase tracking-wider">Laporan Hasil Belajar Peserta Didik</h1>
                    <p className="text-sm font-medium mt-1">Tahun Ajaran: {academicYear.name}</p>
                </div>

                {/* Identitas Siswa */}
                <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                    <table className="w-full">
                        <tbody>
                            <tr><td className="w-32 py-1 text-gray-600 font-medium">Nama Siswa</td><td className="w-4">:</td><td className="font-bold">{student.name}</td></tr>
                            <tr><td className="py-1 text-gray-600 font-medium">NIS / NISN</td><td>:</td><td>{student.nis || '-'} / {student.nisn || '-'}</td></tr>
                        </tbody>
                    </table>
                    <table className="w-full">
                        <tbody>
                            <tr><td className="w-32 py-1 text-gray-600 font-medium">Kelas</td><td className="w-4">:</td><td className="font-bold">{student.classroom?.name || '-'}</td></tr>
                            <tr><td className="py-1 text-gray-600 font-medium">Semester</td><td>:</td><td>{academicYear.name.includes('Ganjil') ? 'Ganjil' : 'Genap'}</td></tr>
                        </tbody>
                    </table>
                </div>

                {/* Tabel Nilai */}
                <div className="mb-8">
                    <h3 className="font-bold text-sm mb-2 uppercase border-l-4 border-black pl-2">A. Penilaian Akademik</h3>
                    <table className="w-full border-collapse border border-black text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-black px-3 py-2 text-center w-12">No</th>
                                <th className="border border-black px-3 py-2">Mata Pelajaran</th>
                                <th className="border border-black px-3 py-2 text-center w-24">Nilai Akhir</th>
                                <th className="border border-black px-3 py-2 text-center w-24">Predikat</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grades.length > 0 ? grades.map((grade, index) => (
                                <tr key={index}>
                                    <td className="border border-black px-3 py-2 text-center">{index + 1}</td>
                                    <td className="border border-black px-3 py-2">
                                        <div className="font-medium">{grade.subject_name}</div>
                                        <div className="text-[10px] text-gray-500">{grade.subject_type}</div>
                                    </td>
                                    <td className="border border-black px-3 py-2 text-center font-bold text-base">{grade.final_score}</td>
                                    <td className="border border-black px-3 py-2 text-center font-bold">{grade.predicate}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="border border-black px-3 py-8 text-center italic text-gray-500">
                                        Belum ada data nilai pada tahun ajaran ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Rekap Absensi */}
                <div className="mb-12">
                    <h3 className="font-bold text-sm mb-2 uppercase border-l-4 border-black pl-2">B. Ketidakhadiran</h3>
                    <div className="w-64">
                        <table className="w-full border-collapse border border-black text-sm">
                            <tbody>
                                <tr>
                                    <td className="border border-black px-3 py-1.5">Sakit</td>
                                    <td className="border border-black px-3 py-1.5 text-center w-16">{attendance.sick}</td>
                                    <td className="border border-black px-3 py-1.5 text-center w-12">Hari</td>
                                </tr>
                                <tr>
                                    <td className="border border-black px-3 py-1.5">Izin</td>
                                    <td className="border border-black px-3 py-1.5 text-center">{attendance.leave}</td>
                                    <td className="border border-black px-3 py-1.5 text-center">Hari</td>
                                </tr>
                                <tr>
                                    <td className="border border-black px-3 py-1.5">Tanpa Keterangan</td>
                                    <td className="border border-black px-3 py-1.5 text-center">{attendance.absent}</td>
                                    <td className="border border-black px-3 py-1.5 text-center">Hari</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tanda Tangan */}
                <div className="flex justify-between text-sm pt-8 mt-auto">
                    <div className="text-center w-48">
                        <p className="mb-16">Mengetahui,<br/>Orang Tua / Wali</p>
                        <p className="font-bold underline">_________________________</p>
                    </div>
                    <div className="text-center w-48">
                        <p className="mb-16">Diberikan di: ______________<br/>Tanggal: {new Date().toLocaleDateString('id-ID')}<br/>Kepala Sekolah</p>
                        <p className="font-bold underline">{schoolProfile?.principal_name || '_________________________'}</p>
                        <p>NPSN: {schoolProfile?.npsn || '_________________'}</p>
                    </div>
                </div>

            </div>
            
            {/* CSS Print Styles */}
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    @page { margin: 0; size: A4; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
            `}} />
        </div>
    );
}
