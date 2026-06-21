<?php

namespace App\Services;

use App\Repositories\Contracts\ClassroomRepositoryInterface;

class ClassroomService extends BaseService
{
    protected ClassroomRepositoryInterface $classroomRepository;

    public function __construct(ClassroomRepositoryInterface $classroomRepository)
    {
        $this->classroomRepository = $classroomRepository;
    }

    public function getAll()
    {
        return $this->classroomRepository->all();
    }

    public function createClassroom(array $data)
    {
        return $this->classroomRepository->create($data);
    }

    public function updateClassroom(string $id, array $data)
    {
        return $this->classroomRepository->update($id, $data);
    }

    public function deleteClassroom(string $id)
    {
        return $this->classroomRepository->delete($id);
    }
}