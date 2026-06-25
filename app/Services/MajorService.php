<?php

namespace App\Services;

use App\Repositories\Contracts\MajorRepositoryInterface;

class MajorService
{
    public function __construct(
        protected MajorRepositoryInterface $majorRepository
    ) {}

    public function getMajorsPaginated(string $schoolId, array $filters = [])
    {
        $search = $filters['search'] ?? null;
        $perPage = $filters['per_page'] ?? 10;

        return $this->majorRepository->getPaginatedBySchool($schoolId, $perPage, $search);
    }

    public function createMajor(string $schoolId, array $data)
    {
        $data['school_id'] = $schoolId;
        return $this->majorRepository->create($data);
    }

    public function updateMajor(int $id, string $schoolId, array $data)
    {
        return $this->majorRepository->update($id, $schoolId, $data);
    }

    public function deleteMajor(int $id, string $schoolId)
    {
        return $this->majorRepository->delete($id, $schoolId);
    }
}
