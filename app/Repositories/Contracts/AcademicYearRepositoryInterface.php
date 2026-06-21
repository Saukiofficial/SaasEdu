<?php

namespace App\Repositories\Contracts;

interface AcademicYearRepositoryInterface extends BaseRepositoryInterface
{
    public function deactivateAllForSchool(string $schoolId): void;
}