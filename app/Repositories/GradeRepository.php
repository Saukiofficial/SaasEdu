<?php

namespace App\Repositories;

use App\Models\Grade;
use App\Models\Student;
use App\Repositories\Contracts\GradeRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class GradeRepository implements GradeRepositoryInterface
{
    public function getBulkGradeForm(string $schoolId, string $academicYearId, string $classroomId, string $subjectId, string $type): Collection
    {
        // 1. Ambil semua siswa aktif di kelas tersebut
        $students = Student::where('school_id', $schoolId)
                           ->where('classroom_id', $classroomId)
                           ->where('status', 'active')
                           ->orderBy('name')
                           ->get(['id', 'name', 'nis']);

        // 2. Ambil data nilai yang sudah pernah diinput sebelumnya (jika ada)
        $existingGrades = Grade::where('school_id', $schoolId)
                               ->where('academic_year_id', $academicYearId)
                               ->where('classroom_id', $classroomId)
                               ->where('subject_id', $subjectId)
                               ->where('type', $type)
                               ->get()
                               ->keyBy('student_id');

        // 3. Gabungkan data. Jika belum ada nilai, default score = 0
        return $students->map(function ($student) use ($existingGrades) {
            $grade = $existingGrades->get($student->id);
            return [
                'student_id' => $student->id,
                'name' => $student->name,
                'nis' => $student->nis,
                'score' => $grade ? $grade->score : 0,
                'description' => $grade ? $grade->description : '',
            ];
        });
    }

    public function upsertBulkGrades(string $schoolId, array $data): bool
    {
        DB::transaction(function () use ($schoolId, $data) {
            foreach ($data['grades'] as $item) {
                Grade::updateOrCreate(
                    [
                        'school_id' => $schoolId,
                        'student_id' => $item['student_id'],
                        'academic_year_id' => $data['academic_year_id'],
                        'subject_id' => $data['subject_id'],
                        'type' => $data['type'],
                    ],
                    [
                        'classroom_id' => $data['classroom_id'],
                        'teacher_id' => $data['teacher_id'],
                        'score' => $item['score'] ?? 0,
                        'description' => $item['description'] ?? null,
                    ]
                );
            }
        });

        return true;
    }
}
