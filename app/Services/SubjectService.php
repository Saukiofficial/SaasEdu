<?php

namespace App\Services;

use App\Repositories\Contracts\SubjectRepositoryInterface;
use Illuminate\Support\Facades\DB;

class SubjectService extends BaseService
{
    protected SubjectRepositoryInterface $subjectRepository;

    public function __construct(SubjectRepositoryInterface $subjectRepository)
    {
        $this->subjectRepository = $subjectRepository;
    }

    public function getAll()
    {
        return $this->subjectRepository->all();
    }

    public function createSubject(array $data)
    {
        return $this->subjectRepository->create($data);
    }

    public function updateSubject(string $id, array $data)
    {
        return $this->subjectRepository->update($id, $data);
    }

    public function deleteSubject(string $id)
    {
        return $this->subjectRepository->delete($id);
    }
}