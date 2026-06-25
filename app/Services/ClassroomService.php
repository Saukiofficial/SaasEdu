<?php

namespace App\Services;

use App\Repositories\Contracts\ClassroomRepositoryInterface;

class ClassroomService
{
    public function __construct(
        protected ClassroomRepositoryInterface $classroomRepository
    ) {}

    public function getClassroomsPaginated(string $schoolId, array $filters = [])
    {
        $search = $filters['search'] ?? null;
        $perPage = $filters['per_page'] ?? 10;

        return $this->classroomRepository->getPaginatedBySchool($schoolId, $perPage, $search);
    }

    public function createClassroom(string $schoolId, array $data)
    {
        $data['school_id'] = $schoolId;
        return $this->classroomRepository->create($data);
    }

    public function updateClassroom(string $id, string $schoolId, array $data)
    {
        return $this->classroomRepository->update($id, $schoolId, $data);
    }

    public function deleteClassroom(string $id, string $schoolId)
    {
        return $this->classroomRepository->delete($id, $schoolId);
    }
}
