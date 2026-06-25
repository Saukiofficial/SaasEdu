<?php

namespace App\Services;

use App\Repositories\Contracts\GradeRepositoryInterface;

class GradeService
{
    public function __construct(
        protected GradeRepositoryInterface $gradeRepository
    ) {}

    public function getGradeForm(string $schoolId, array $filters)
    {
        if (empty($filters['academic_year_id']) || empty($filters['classroom_id']) || empty($filters['subject_id']) || empty($filters['type'])) {
            return collect([]); // Kembalikan koleksi kosong jika filter belum lengkap
        }

        return $this->gradeRepository->getBulkGradeForm(
            $schoolId, 
            $filters['academic_year_id'], 
            $filters['classroom_id'], 
            $filters['subject_id'], 
            $filters['type']
        );
    }

    public function saveBulkGrades(string $schoolId, array $data)
    {
        return $this->gradeRepository->upsertBulkGrades($schoolId, $data);
    }
}