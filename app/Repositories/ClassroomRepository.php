<?php

namespace App\Repositories;

use App\Models\Classroom;
use App\Repositories\Contracts\ClassroomRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class ClassroomRepository implements ClassroomRepositoryInterface
{
    public function getPaginatedBySchool(string $schoolId, int $perPage = 10, ?string $search = null): LengthAwarePaginator
    {
        $query = Classroom::where('school_id', $schoolId);

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('level', 'like', "%{$search}%");
            });
        }

        // Urutkan berdasarkan level/tingkat, lalu nama kelas
        return $query->orderBy('level')->orderBy('name')->paginate($perPage);
    }

    public function findByIdAndSchool(string $id, string $schoolId): ?Classroom
    {
        return Classroom::where('school_id', $schoolId)->where('id', $id)->firstOrFail();
    }

    public function create(array $data): Classroom
    {
        return Classroom::create($data);
    }

    public function update(string $id, string $schoolId, array $data): bool
    {
        $classroom = $this->findByIdAndSchool($id, $schoolId);
        return $classroom->update($data);
    }

    public function delete(string $id, string $schoolId): bool
    {
        $classroom = $this->findByIdAndSchool($id, $schoolId);
        return $classroom->delete();
    }
}
