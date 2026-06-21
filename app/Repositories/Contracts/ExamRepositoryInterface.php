<?php

namespace App\Repositories\Contracts;

interface ExamRepositoryInterface extends BaseRepositoryInterface
{
    public function getPaginatedWithRelations(int $perPage = 10, array $filters = []);
}