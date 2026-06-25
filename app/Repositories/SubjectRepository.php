<?php

namespace App\Repositories;

use App\Models\Subject;
use App\Repositories\Contracts\SubjectRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class SubjectRepository implements SubjectRepositoryInterface
{
    public function getPaginatedBySchool(string $schoolId, int $perPage = 10, ?string $search = null): LengthAwarePaginator
    {
        $query = Subject::where('school_id', $schoolId);

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        return $query->latest()->paginate($perPage);
    }

    public function findByIdAndSchool(string $id, string $schoolId): ?Subject
    {
        // Perhatikan $id dan $schoolId menggunakan string (UUID)
        return Subject::where('school_id', $schoolId)->where('id', $id)->firstOrFail();
    }

    public function create(array $data): Subject
    {
        return Subject::create($data);
    }

    public function update(string $id, string $schoolId, array $data): bool
    {
        $subject = $this->findByIdAndSchool($id, $schoolId);
        return $subject->update($data);
    }

    public function delete(string $id, string $schoolId): bool
    {
        $subject = $this->findByIdAndSchool($id, $schoolId);
        return $subject->delete();
    }
}