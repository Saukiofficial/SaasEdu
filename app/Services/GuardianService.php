<?php

namespace App\Services;

use App\Repositories\Contracts\GuardianRepositoryInterface;
use Illuminate\Support\Facades\DB;

class GuardianService
{
    public function __construct(
        protected GuardianRepositoryInterface $guardianRepository
    ) {}

    public function getGuardiansPaginated(string $schoolId, array $filters = [])
    {
        $search = $filters['search'] ?? null;
        $perPage = $filters['per_page'] ?? 10;

        return $this->guardianRepository->getPaginatedBySchool($schoolId, $perPage, $search);
    }

    public function createGuardian(string $schoolId, array $data)
    {
        return DB::transaction(function () use ($schoolId, $data) {
            $data['school_id'] = $schoolId;
            $guardian = $this->guardianRepository->create($data);

            if (isset($data['students']) && is_array($data['students'])) {
                $this->guardianRepository->syncStudents($guardian, $this->formatSyncData($data['students']));
            }

            return $guardian;
        });
    }

    public function updateGuardian(string $id, string $schoolId, array $data)
    {
        return DB::transaction(function () use ($id, $schoolId, $data) {
            $updated = $this->guardianRepository->update($id, $schoolId, $data);
            
            $guardian = $this->guardianRepository->findByIdAndSchool($id, $schoolId);

            if (isset($data['students']) && is_array($data['students'])) {
                $this->guardianRepository->syncStudents($guardian, $this->formatSyncData($data['students']));
            }

            return $updated;
        });
    }

    public function deleteGuardian(string $id, string $schoolId)
    {
        return $this->guardianRepository->delete($id, $schoolId);
    }

    /**
     * Memformat array dari frontend ke format yang diterima oleh fungsi sync() Eloquent
     */
    protected function formatSyncData(array $students): array
    {
        $syncData = [];
        foreach ($students as $student) {
            if (!empty($student['id'])) {
                $syncData[$student['id']] = ['relationship' => $student['relationship'] ?? 'Wali'];
            }
        }
        return $syncData;
    }
}
