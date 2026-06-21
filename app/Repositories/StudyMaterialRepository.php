<?php

namespace App\Repositories;

use App\Models\StudyMaterial;
use App\Repositories\Contracts\StudyMaterialRepositoryInterface;

class StudyMaterialRepository extends BaseRepository implements StudyMaterialRepositoryInterface
{
    public function __construct(StudyMaterial $model)
    {
        parent::__construct($model);
    }

    public function getPaginatedWithRelations(int $perPage = 10, array $filters = [])
    {
        $query = $this->model->with(['teacher', 'subject', 'classroom']);

        if (!empty($filters['classroom_id'])) {
            $query->where('classroom_id', $filters['classroom_id']);
        }
        
        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        return $query->latest()->paginate($perPage);
    }
}