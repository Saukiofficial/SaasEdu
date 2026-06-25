<?php

namespace App\Services;

use App\Models\Student;
use App\Models\Grade;
use App\Models\StudentAttendance;
use Illuminate\Support\Facades\DB;

class ReportCardService
{
    /**
     * Mendapatkan daftar siswa beserta rata-rata nilai di kelas tertentu
     */
    public function getStudentListWithAverages(string $schoolId, string $academicYearId, string $classroomId)
    {
        return Student::where('school_id', $schoolId)
            ->where('classroom_id', $classroomId)
            ->where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name', 'nis'])
            ->map(function ($student) use ($schoolId, $academicYearId) {
                // Hitung rata-rata nilai per siswa
                $averageScore = Grade::where('school_id', $schoolId)
                    ->where('academic_year_id', $academicYearId)
                    ->where('student_id', $student->id)
                    ->avg('score');

                $student->average_score = $averageScore ? round($averageScore, 2) : 0;
                return $student;
            });
    }

    /**
     * Mendapatkan detail rapor lengkap untuk 1 siswa
     */
    public function getStudentReportCard(string $studentId, string $schoolId, string $academicYearId)
    {
        $student = Student::with('classroom')->where('school_id', $schoolId)->findOrFail($studentId);

        // 1. Ambil & Kelompokkan Nilai berdasarkan Mata Pelajaran
        $grades = Grade::with('subject')
            ->where('school_id', $schoolId)
            ->where('academic_year_id', $academicYearId)
            ->where('student_id', $studentId)
            ->get();

        $subjectsReport = [];
        foreach ($grades as $grade) {
            $subjectId = $grade->subject_id;
            if (!isset($subjectsReport[$subjectId])) {
                $subjectsReport[$subjectId] = [
                    'subject_name' => $grade->subject->name,
                    'subject_type' => $grade->subject->type,
                    'scores' => [],
                    'total' => 0,
                    'count' => 0,
                ];
            }
            $subjectsReport[$subjectId]['scores'][] = [
                'type' => $grade->type,
                'score' => $grade->score,
            ];
            $subjectsReport[$subjectId]['total'] += $grade->score;
            $subjectsReport[$subjectId]['count'] += 1;
        }

        // Hitung nilai akhir per mapel
        foreach ($subjectsReport as &$report) {
            $report['final_score'] = round($report['total'] / $report['count'], 2);
            $report['predicate'] = $this->getPredicate($report['final_score']);
        }

        // 2. Rekapitulasi Absensi Siswa
        $attendances = StudentAttendance::where('school_id', $schoolId)
            ->where('student_id', $studentId)
            // Filter rentang tanggal berdasarkan tahun ajaran (idealnya relasikan ini jika ada, tapi sebagai contoh kita hitung total)
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        $attendanceSummary = [
            'sick' => $attendances['sick'] ?? 0,
            'leave' => $attendances['leave'] ?? 0,
            'absent' => $attendances['absent'] ?? 0,
        ];

        return [
            'student' => $student,
            'grades' => array_values($subjectsReport), // Re-index array
            'attendance' => $attendanceSummary,
        ];
    }

    /**
     * Konversi angka ke huruf / predikat
     */
    private function getPredicate($score)
    {
        if ($score >= 90) return 'A';
        if ($score >= 80) return 'B';
        if ($score >= 70) return 'C';
        return 'D';
    }
}
