<?php

namespace App\Repositories;

use App\Models\AcademicYear;
use App\Repositories\Contracts\AcademicYearRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class AcademicYearRepository implements AcademicYearRepositoryInterface
{
    public function getPaginatedBySchool(string $schoolId, int $perPage = 10, ?string $search = null): LengthAwarePaginator
    {
        $query = AcademicYear::where('school_id', $schoolId);

        if (!empty($search)) {
            $query->where('name', 'like', "%{$search}%");
        }

        return $query->latest('start_date')->paginate($perPage);
    }

    public function findByIdAndSchool(string $id, string $schoolId): ?AcademicYear
    {
        return AcademicYear::where('school_id', $schoolId)->where('id', $id)->firstOrFail();
    }

    public function create(array $data): AcademicYear
    {
        return AcademicYear::create($data);
    }

    public function update(string $id, string $schoolId, array $data): bool
    {
        $academicYear = $this->findByIdAndSchool($id, $schoolId);
        return $academicYear->update($data);
    }

    public function delete(string $id, string $schoolId): bool
    {
        $academicYear = $this->findByIdAndSchool($id, $schoolId);
        return $academicYear->delete();
    }

    /**
     * Memastikan hanya ada 1 Tahun Ajaran yang aktif dalam satu sekolah
     */
    public function deactivateAllOther(string $schoolId, string $exceptId = null): void
    {
        $query = AcademicYear::where('school_id', $schoolId);
        if ($exceptId) {
            $query->where('id', '!=', $exceptId);
        }
        $query->update(['is_active' => false]);
    }
}
