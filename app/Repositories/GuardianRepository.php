<?php

namespace App\Repositories;

use App\Models\Guardian;
use App\Repositories\Contracts\GuardianRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class GuardianRepository implements GuardianRepositoryInterface
{
    public function getPaginatedBySchool(string $schoolId, int $perPage = 10, ?string $search = null): LengthAwarePaginator
    {
        $query = Guardian::with('students')->where('school_id', $schoolId);

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        return $query->latest()->paginate($perPage);
    }

    public function findByIdAndSchool(string $id, string $schoolId): ?Guardian
    {
        return Guardian::with('students')->where('school_id', $schoolId)->where('id', $id)->firstOrFail();
    }

    public function create(array $data): Guardian
    {
        return Guardian::create($data);
    }

    public function update(string $id, string $schoolId, array $data): bool
    {
        $guardian = $this->findByIdAndSchool($id, $schoolId);
        return $guardian->update($data);
    }

    public function delete(string $id, string $schoolId): bool
    {
        $guardian = $this->findByIdAndSchool($id, $schoolId);
        return $guardian->delete();
    }

    public function syncStudents(Guardian $guardian, array $studentsData): void
    {
        // Format studentsData yang diharapkan: 
        // [ 'uuid-siswa-1' => ['relationship' => 'Ayah'], 'uuid-siswa-2' => ['relationship' => 'Wali'] ]
        $guardian->students()->sync($studentsData);
    }
}
