<?php

namespace App\Repositories;

use App\Models\StudyMaterial;
use App\Repositories\Contracts\StudyMaterialRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class StudyMaterialRepository implements StudyMaterialRepositoryInterface
{
    public function getPaginatedBySchool(string $schoolId, int $perPage = 10, array $filters = []): LengthAwarePaginator
    {
        $query = StudyMaterial::with(['teacher', 'subject', 'classroom'])
                              ->where('school_id', $schoolId);

        if (!empty($filters['search'])) {
            $query->where('title', 'like', "%{$filters['search']}%");
        }

        if (!empty($filters['classroom_id'])) {
            $query->where('classroom_id', $filters['classroom_id']);
        }
        
        if (!empty($filters['subject_id'])) {
            $query->where('subject_id', $filters['subject_id']);
        }

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        return $query->latest()->paginate($perPage);
    }

    public function findByIdAndSchool(string $id, string $schoolId): ?StudyMaterial
    {
        return StudyMaterial::where('school_id', $schoolId)->where('id', $id)->firstOrFail();
    }

    public function create(array $data): StudyMaterial
    {
        return StudyMaterial::create($data);
    }

    public function update(string $id, string $schoolId, array $data): bool
    {
        $material = $this->findByIdAndSchool($id, $schoolId);
        return $material->update($data);
    }

    public function delete(string $id, string $schoolId): bool
    {
        $material = $this->findByIdAndSchool($id, $schoolId);
        return $material->delete();
    }
}
