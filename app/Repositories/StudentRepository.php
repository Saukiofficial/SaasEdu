<?php

namespace App\Repositories;

use App\Models\Student;
use App\Repositories\Contracts\StudentRepositoryInterface;

class StudentRepository extends BaseRepository implements StudentRepositoryInterface
{
    public function __construct(Student $model)
    {
        parent::__construct($model);
    }

    public function getPaginatedWithClassroom(int $perPage = 10)
    {
        // Trait BelongsToTenant sudah memfilter data per sekolah
        return $this->model->with('classroom')->latest()->paginate($perPage);
    }
}