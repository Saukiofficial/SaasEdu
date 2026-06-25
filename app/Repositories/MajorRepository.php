<?php

namespace App\Repositories;

use App\Models\Major;
use App\Repositories\Contracts\MajorRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class MajorRepository implements MajorRepositoryInterface
{
    public function getPaginatedBySchool(string $schoolId, int $perPage = 10, ?string $search = null): LengthAwarePaginator
    {
        $query = Major::where('school_id', $schoolId);

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        return $query->latest()->paginate($perPage);
    }

    public function findByIdAndSchool(int $id, string $schoolId): ?Major
    {
        return Major::where('school_id', $schoolId)->where('id', $id)->firstOrFail();
    }

    public function create(array $data): Major
    {
        return Major::create($data);
    }

    public function update(int $id, string $schoolId, array $data): bool
    {
        $major = $this->findByIdAndSchool($id, $schoolId);
        return $major->update($data);
    }

    public function delete(int $id, string $schoolId): bool
    {
        $major = $this->findByIdAndSchool($id, $schoolId);
        return $major->delete();
    }
}