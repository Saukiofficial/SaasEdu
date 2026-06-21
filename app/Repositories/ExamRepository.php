<?php

namespace App\Repositories;

use App\Models\Exam;
use App\Repositories\Contracts\ExamRepositoryInterface;

class ExamRepository extends BaseRepository implements ExamRepositoryInterface
{
    public function __construct(Exam $model)
    {
        parent::__construct($model);
    }

    public function getPaginatedWithRelations(int $perPage = 10, array $filters = [])
    {
        $query = $this->model->with(['subject', 'classroom']);

        if (!empty($filters['classroom_id'])) {
            $query->where('classroom_id', $filters['classroom_id']);
        }

        return $query->orderBy('start_time', 'desc')->paginate($perPage);
    }
}