<?php

namespace App\Services;

use App\Repositories\Contracts\TeacherRepositoryInterface;

class TeacherService extends BaseService
{
    protected TeacherRepositoryInterface $teacherRepository;

    public function __construct(TeacherRepositoryInterface $teacherRepository)
    {
        $this->teacherRepository = $teacherRepository;
    }

    public function getPaginatedTeachers()
    {
        return $this->teacherRepository->getPaginatedTeachers(10);
    }

    public function createTeacher(array $data)
    {
        return $this->teacherRepository->create($data);
    }

    public function updateTeacher(string $id, array $data)
    {
        return $this->teacherRepository->update($id, $data);
    }

    public function deleteTeacher(string $id)
    {
        return $this->teacherRepository->delete($id);
    }
}