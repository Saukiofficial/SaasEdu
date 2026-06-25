<?php

namespace App\Repositories;

use App\Models\Student;
use App\Repositories\Contracts\StudentRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class StudentRepository implements StudentRepositoryInterface
{
    public function getPaginatedBySchool(string $schoolId, int $perPage = 10, ?string $search = null, ?string $classroomId = null): LengthAwarePaginator
    {
        // Eager load relasi classroom agar query lebih efisien
        $query = Student::with('classroom')->where('school_id', $schoolId);

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%")
                  ->orWhere('nisn', 'like', "%{$search}%");
            });
        }

        if (!empty($classroomId)) {
            $query->where('classroom_id', $classroomId);
        }

        return $query->latest()->paginate($perPage);
    }

    public function findByIdAndSchool(string $id, string $schoolId): ?Student
    {
        return Student::where('school_id', $schoolId)->where('id', $id)->firstOrFail();
    }

    public function create(array $data): Student
    {
        return Student::create($data);
    }

    public function update(string $id, string $schoolId, array $data): bool
    {
        $student = $this->findByIdAndSchool($id, $schoolId);
        return $student->update($data);
    }

    public function delete(string $id, string $schoolId): bool
    {
        $student = $this->findByIdAndSchool($id, $schoolId);
        return $student->delete();
    }
}
