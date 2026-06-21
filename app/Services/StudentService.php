<?php

namespace App\Services;

use App\Repositories\Contracts\StudentRepositoryInterface;

class StudentService extends BaseService
{
    protected StudentRepositoryInterface $studentRepository;

    public function __construct(StudentRepositoryInterface $studentRepository)
    {
        $this->studentRepository = $studentRepository;
    }

    public function getPaginatedStudents()
    {
        return $this->studentRepository->getPaginatedWithClassroom(10);
    }

    public function createStudent(array $data)
    {
        return $this->studentRepository->create($data);
    }

    public function updateStudent(string $id, array $data)
    {
        return $this->studentRepository->update($id, $data);
    }

    public function deleteStudent(string $id)
    {
        return $this->studentRepository->delete($id);
    }
}
