<?php

namespace App\Repositories;

use App\Models\Teacher;
use App\Repositories\Contracts\TeacherRepositoryInterface;

class TeacherRepository extends BaseRepository implements TeacherRepositoryInterface
{
    public function __construct(Teacher $model)
    {
        parent::__construct($model);
    }

    public function getPaginatedTeachers(int $perPage = 10)
    {
        // Trait BelongsToTenant sudah memfilter data per sekolah secara otomatis
        return $this->model->latest()->paginate($perPage);
    }
}