<?php

namespace App\Services;

use App\Repositories\Contracts\GradeRepositoryInterface;
use App\Models\Student;
use App\Models\AcademicYear;

class GradeService extends BaseService
{
    protected GradeRepositoryInterface $gradeRepository;

    public function __construct(GradeRepositoryInterface $gradeRepository)
    {
        $this->gradeRepository = $gradeRepository;
    }

    public function getGradeDataForm(string $classroomId = null, string $subjectId = null, string $type = null)
    {
        $students = [];
        $grades = [];
        $activeYear = AcademicYear::where('is_active', true)->first();

        if ($classroomId && $subjectId && $type && $activeYear) {
            $students = Student::where('classroom_id', $classroomId)
                               ->where('status', 'active')
                               ->orderBy('name')
                               ->get();

            $studentIds = $students->pluck('id')->toArray();
            $grades = $this->gradeRepository->getByStudentsSubjectAndType($studentIds, $subjectId, $type, $activeYear->id);
        }

        return [
            'students' => $students,
            'existing_grades' => $grades,
            'active_year' => $activeYear
        ];
    }

    public function saveBulkGrades(array $data)
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        if (!$activeYear) {
            throw new \Exception('Tidak ada tahun ajaran yang aktif.');
        }

        return $this->gradeRepository->updateOrCreateBulk(
            $data['grades'], 
            $data['subject_id'], 
            $data['type'], 
            $activeYear->id
        );
    }
}