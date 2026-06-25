<?php

namespace App\Services;

use App\Repositories\Contracts\AcademicYearRepositoryInterface;
use Illuminate\Support\Facades\DB;

class AcademicYearService
{
    public function __construct(
        protected AcademicYearRepositoryInterface $academicYearRepository
    ) {}

    public function getAcademicYearsPaginated(string $schoolId, array $filters = [])
    {
        $search = $filters['search'] ?? null;
        $perPage = $filters['per_page'] ?? 10;

        return $this->academicYearRepository->getPaginatedBySchool($schoolId, $perPage, $search);
    }

    public function createAcademicYear(string $schoolId, array $data)
    {
        $data['school_id'] = $schoolId;
        
        return DB::transaction(function () use ($schoolId, $data) {
            $academicYear = $this->academicYearRepository->create($data);

            // Jika diset sebagai aktif, nonaktifkan yang lain
            if (!empty($data['is_active']) && $data['is_active']) {
                $this->academicYearRepository->deactivateAllOther($schoolId, $academicYear->id);
            }

            return $academicYear;
        });
    }

    public function updateAcademicYear(string $id, string $schoolId, array $data)
    {
        return DB::transaction(function () use ($id, $schoolId, $data) {
            $updated = $this->academicYearRepository->update($id, $schoolId, $data);

            // Jika diset sebagai aktif, nonaktifkan yang lain
            if (!empty($data['is_active']) && $data['is_active']) {
                $this->academicYearRepository->deactivateAllOther($schoolId, $id);
            }

            return $updated;
        });
    }

    public function deleteAcademicYear(string $id, string $schoolId)
    {
        return $this->academicYearRepository->delete($id, $schoolId);
    }
}