<?php

namespace App\Services;

use App\Repositories\Contracts\TeacherRepositoryInterface;

class TeacherService
{
    public function __construct(
        protected TeacherRepositoryInterface $teacherRepository
    ) {}

    public function getTeachersPaginated(string $schoolId, array $filters = [])
    {
        $search = $filters['search'] ?? null;
        $status = $filters['status'] ?? null;
        $perPage = $filters['per_page'] ?? 10;

        return $this->teacherRepository->getPaginatedBySchool($schoolId, $perPage, $search, $status);
    }

    public function createTeacher(string $schoolId, array $data)
    {
        $data['school_id'] = $schoolId;
        return $this->teacherRepository->create($data);
    }

    public function updateTeacher(string $id, string $schoolId, array $data)
    {
        return $this->teacherRepository->update($id, $schoolId, $data);
    }

    public function deleteTeacher(string $id, string $schoolId)
    {
        return $this->teacherRepository->delete($id, $schoolId);
    }
}
