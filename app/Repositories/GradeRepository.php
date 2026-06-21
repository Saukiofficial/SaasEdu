<?php

namespace App\Repositories;

use App\Models\Grade;
use App\Repositories\Contracts\GradeRepositoryInterface;
use Illuminate\Support\Facades\Auth;

class GradeRepository extends BaseRepository implements GradeRepositoryInterface
{
    public function __construct(Grade $model)
    {
        parent::__construct($model);
    }

    public function updateOrCreateBulk(array $gradesData, string $subjectId, string $type, string $academicYearId)
    {
        $schoolId = Auth::user()->school_id;

        foreach ($gradesData as $data) {
            $this->model->updateOrCreate(
                [
                    'school_id' => $schoolId,
                    'student_id' => $data['student_id'],
                    'subject_id' => $subjectId,
                    'academic_year_id' => $academicYearId,
                    'type' => $type,
                ],
                [
                    'score' => $data['score'],
                    'description' => $data['description'] ?? null,
                ]
            );
        }

        return true;
    }

    public function getByStudentsSubjectAndType(array $studentIds, string $subjectId, string $type, string $academicYearId)
    {
        return $this->model->whereIn('student_id', $studentIds)
                           ->where('subject_id', $subjectId)
                           ->where('type', $type)
                           ->where('academic_year_id', $academicYearId)
                           ->get()
                           ->keyBy('student_id');
    }
}
