<?php

namespace App\Repositories;

use App\Models\Schedule;
use App\Repositories\Contracts\ScheduleRepositoryInterface;

class ScheduleRepository extends BaseRepository implements ScheduleRepositoryInterface
{
    public function __construct(Schedule $model)
    {
        parent::__construct($model);
    }

    public function getPaginatedWithRelations(int $perPage = 10)
    {
        // Memuat relasi agar tidak terjadi N+1 query problem
        return $this->model->with(['academicYear', 'classroom', 'subject', 'teacher'])
                           ->orderBy('day')
                           ->orderBy('start_time')
                           ->paginate($perPage);
    }
}