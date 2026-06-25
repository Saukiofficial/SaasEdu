<?php

namespace App\Services;

use App\Repositories\Contracts\StudentRepositoryInterface;

class StudentService
{
    public function __construct(
        protected StudentRepositoryInterface $studentRepository
    ) {}

    public function getStudentsPaginated(string $schoolId, array $filters = [])
    {
        $search = $filters['search'] ?? null;
        $classroomId = $filters['classroom_id'] ?? null;
        $perPage = $filters['per_page'] ?? 10;

        return $this->studentRepository->getPaginatedBySchool($schoolId, $perPage, $search, $classroomId);
    }

    public function createStudent(string $schoolId, array $data)
    {
        $data['school_id'] = $schoolId;
        return $this->studentRepository->create($data);
    }

    public function updateStudent(string $id, string $schoolId, array $data)
    {
        return $this->studentRepository->update($id, $schoolId, $data);
    }

    public function deleteStudent(string $id, string $schoolId)
    {
        return $this->studentRepository->delete($id, $schoolId);
    }
}
