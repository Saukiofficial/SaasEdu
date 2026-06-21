<?php

namespace App\Repositories\Contracts;

interface GradeRepositoryInterface extends BaseRepositoryInterface
{
    public function updateOrCreateBulk(array $gradesData, string $subjectId, string $type, string $academicYearId);
    public function getByStudentsSubjectAndType(array $studentIds, string $subjectId, string $type, string $academicYearId);
}