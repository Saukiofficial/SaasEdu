<?php

namespace App\Repositories;

use App\Models\StudentMutation;
use App\Repositories\Contracts\StudentMutationRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class StudentMutationRepository implements StudentMutationRepositoryInterface
{
    public function getPaginatedBySchool(string $schoolId, int $perPage = 10, ?string $search = null, ?string $type = null): LengthAwarePaginator
    {
        // Eager load relasi student untuk ditampilkan di UI
        $query = StudentMutation::with('student')->where('school_id', $schoolId);

        if (!empty($search)) {
            $query->whereHas('student', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%");
            })->orWhere('reference_number', 'like', "%{$search}%");
        }

        if (!empty($type)) {
            $query->where('type', $type);
        }

        return $query->latest('mutation_date')->latest('created_at')->paginate($perPage);
    }

    public function findByIdAndSchool(string $id, string $schoolId): ?StudentMutation
    {
        return StudentMutation::with('student')->where('school_id', $schoolId)->where('id', $id)->firstOrFail();
    }

    public function create(array $data): StudentMutation
    {
        return StudentMutation::create($data);
    }

    public function update(string $id, string $schoolId, array $data): bool
    {
        $mutation = $this->findByIdAndSchool($id, $schoolId);
        return $mutation->update($data);
    }

    public function delete(string $id, string $schoolId): bool
    {
        $mutation = $this->findByIdAndSchool($id, $schoolId);
        return $mutation->delete();
    }
}
