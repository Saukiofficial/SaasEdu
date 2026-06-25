<?php

namespace App\Services;

use App\Repositories\Contracts\SubjectRepositoryInterface;

class SubjectService
{
    public function __construct(
        protected SubjectRepositoryInterface $subjectRepository
    ) {}

    public function getSubjectsPaginated(string $schoolId, array $filters = [])
    {
        $search = $filters['search'] ?? null;
        $perPage = $filters['per_page'] ?? 10;

        return $this->subjectRepository->getPaginatedBySchool($schoolId, $perPage, $search);
    }

    public function createSubject(string $schoolId, array $data)
    {
        $data['school_id'] = $schoolId;
        return $this->subjectRepository->create($data);
    }

    public function updateSubject(string $id, string $schoolId, array $data)
    {
        return $this->subjectRepository->update($id, $schoolId, $data);
    }

    public function deleteSubject(string $id, string $schoolId)
    {
        return $this->subjectRepository->delete($id, $schoolId);
    }
}