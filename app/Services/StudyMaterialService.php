<?php

namespace App\Services;

use App\Repositories\Contracts\StudyMaterialRepositoryInterface;

class StudyMaterialService extends BaseService
{
    protected StudyMaterialRepositoryInterface $studyMaterialRepository;

    public function __construct(StudyMaterialRepositoryInterface $studyMaterialRepository)
    {
        $this->studyMaterialRepository = $studyMaterialRepository;
    }

    public function getStudyMaterials(array $filters = [])
    {
        return $this->studyMaterialRepository->getPaginatedWithRelations(10, $filters);
    }

    public function createStudyMaterial(array $data)
    {
        // Jika type bukan assignment, pastikan due_date null
        if ($data['type'] === 'material') {
            $data['due_date'] = null;
        }
        return $this->studyMaterialRepository->create($data);
    }

    public function updateStudyMaterial(string $id, array $data)
    {
        if ($data['type'] === 'material') {
            $data['due_date'] = null;
        }
        return $this->studyMaterialRepository->update($id, $data);
    }

    public function deleteStudyMaterial(string $id)
    {
        return $this->studyMaterialRepository->delete($id);
    }
}