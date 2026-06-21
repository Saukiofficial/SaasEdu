<?php

namespace App\Services;

use App\Repositories\Contracts\ExamRepositoryInterface;

class ExamService extends BaseService
{
    protected ExamRepositoryInterface $examRepository;

    public function __construct(ExamRepositoryInterface $examRepository)
    {
        $this->examRepository = $examRepository;
    }

    public function getExams(array $filters = [])
    {
        return $this->examRepository->getPaginatedWithRelations(10, $filters);
    }

    public function createExam(array $data)
    {
        return $this->examRepository->create($data);
    }

    public function updateExam(string $id, array $data)
    {
        return $this->examRepository->update($id, $data);
    }

    public function deleteExam(string $id)
    {
        return $this->examRepository->delete($id);
    }
}
