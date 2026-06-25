<?php

namespace App\Services;

use App\Repositories\Contracts\StudyMaterialRepositoryInterface;

class StudyMaterialService
{
    public function __construct(
        protected StudyMaterialRepositoryInterface $materialRepository
    ) {}

    public function getMaterialsPaginated(string $schoolId, array $filters = [])
    {
        $perPage = $filters['per_page'] ?? 10;
        return $this->materialRepository->getPaginatedBySchool($schoolId, $perPage, $filters);
    }

    public function createMaterial(string $schoolId, array $data)
    {
        $data['school_id'] = $schoolId;
        // Kosongkan due_date jika tipenya materi
        if ($data['type'] === 'material') {
            $data['due_date'] = null;
        }
        return $this->materialRepository->create($data);
    }

    public function updateMaterial(string $id, string $schoolId, array $data)
    {
        if ($data['type'] === 'material') {
            $data['due_date'] = null;
        }
        return $this->materialRepository->update($id, $schoolId, $data);
    }

    public function deleteMaterial(string $id, string $schoolId)
    {
        return $this->materialRepository->delete($id, $schoolId);
    }
}
