<?php

namespace App\Services;

use App\Models\Student;
use App\Models\AcademicYear;
use App\Models\Grade;

class ReportCardService extends BaseService
{
    public function getStudentReportData(string $studentId)
    {
        $student = Student::with('classroom')->findOrFail($studentId);
        
        $activeYear = AcademicYear::where('is_active', true)->first();
        if (!$activeYear) {
            throw new \Exception('Tidak ada Tahun Ajaran yang aktif.');
        }

        // Ambil semua nilai siswa pada tahun ajaran aktif, beserta data mata pelajarannya
        $grades = Grade::with('subject')
            ->where('student_id', $studentId)
            ->where('academic_year_id', $activeYear->id)
            ->get();

        // Format data: Kelompokkan nilai berdasarkan Mata Pelajaran
        // Hasilnya: [ 'Matematika' => ['Tugas 1' => 80, 'UTS' => 85, 'UAS' => 90], ... ]
        $reportData = [];
        foreach ($grades as $grade) {
            $subjectName = $grade->subject->name;
            if (!isset($reportData[$subjectName])) {
                $reportData[$subjectName] = [];
            }
            $reportData[$subjectName][$grade->type] = $grade->score;
        }

        return [
            'student' => $student,
            'academic_year' => $activeYear,
            'grades' => $reportData,
        ];
    }
}
