<?php

namespace App\Services;

use App\Repositories\Contracts\ExamRepositoryInterface;

class ExamService
{
    public function __construct(
        protected ExamRepositoryInterface $examRepository
    ) {}

    public function getExamsPaginated(string $schoolId, array $filters = [])
    {
        $perPage = $filters['per_page'] ?? 10;
        return $this->examRepository->getPaginatedBySchool($schoolId, $perPage, $filters);
    }

    public function createExam(string $schoolId, array $data)
    {
        $data['school_id'] = $schoolId;
        return $this->examRepository->create($data);
    }

    public function updateExam(string $id, string $schoolId, array $data)
    {
        return $this->examRepository->update($id, $schoolId, $data);
    }

    public function deleteExam(string $id, string $schoolId)
    {
        return $this->examRepository->delete($id, $schoolId);
    }
}
