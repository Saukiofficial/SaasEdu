<?php

namespace App\Repositories;

use App\Models\AcademicYear;
use App\Repositories\Contracts\AcademicYearRepositoryInterface;

class AcademicYearRepository extends BaseRepository implements AcademicYearRepositoryInterface
{
    public function __construct(AcademicYear $model)
    {
        parent::__construct($model);
    }

    public function deactivateAllForSchool(string $schoolId): void
    {
        $this->model->where('school_id', $schoolId)->update(['is_active' => false]);
    }
}