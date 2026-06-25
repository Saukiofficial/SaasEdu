<?php

namespace App\Repositories;

use App\Models\Alumni;
use App\Repositories\Contracts\AlumniRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class AlumniRepository implements AlumniRepositoryInterface
{
    public function getPaginatedBySchool(string $schoolId, int $perPage = 10, ?string $search = null, ?string $activity = null): LengthAwarePaginator
    {
        // Eager load data siswa agar bisa menampilkan nama
        $query = Alumni::with('student')->where('school_id', $schoolId);

        if (!empty($search)) {
            $query->whereHas('student', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%")
                  ->orWhere('nisn', 'like', "%{$search}%");
            })->orWhere('institution_name', 'like', "%{$search}%");
        }

        if (!empty($activity)) {
            $query->where('current_activity', $activity);
        }

        return $query->latest('graduation_year')->latest('created_at')->paginate($perPage);
    }

    public function findByIdAndSchool(string $id, string $schoolId): ?Alumni
    {
        return Alumni::with('student')->where('school_id', $schoolId)->where('id', $id)->firstOrFail();
    }

    public function create(array $data): Alumni
    {
        return Alumni::create($data);
    }

    public function update(string $id, string $schoolId, array $data): bool
    {
        $alumni = $this->findByIdAndSchool($id, $schoolId);
        return $alumni->update($data);
    }

    public function delete(string $id, string $schoolId): bool
    {
        $alumni = $this->findByIdAndSchool($id, $schoolId);
        return $alumni->delete();
    }
}
