<?php

namespace App\Repositories;

use App\Models\Teacher;
use App\Repositories\Contracts\TeacherRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class TeacherRepository implements TeacherRepositoryInterface
{
    public function getPaginatedBySchool(string $schoolId, int $perPage = 10, ?string $search = null, ?string $status = null): LengthAwarePaginator
    {
        $query = Teacher::where('school_id', $schoolId);

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nip', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if (!empty($status)) {
            $query->where('status', $status);
        }

        // Urutkan berdasarkan nama
        return $query->orderBy('name')->paginate($perPage);
    }

    public function findByIdAndSchool(string $id, string $schoolId): ?Teacher
    {
        return Teacher::where('school_id', $schoolId)->where('id', $id)->firstOrFail();
    }

    public function create(array $data): Teacher
    {
        return Teacher::create($data);
    }

    public function update(string $id, string $schoolId, array $data): bool
    {
        $teacher = $this->findByIdAndSchool($id, $schoolId);
        return $teacher->update($data);
    }

    public function delete(string $id, string $schoolId): bool
    {
        $teacher = $this->findByIdAndSchool($id, $schoolId);
        return $teacher->delete();
    }
}