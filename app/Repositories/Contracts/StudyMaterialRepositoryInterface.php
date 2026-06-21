<?php

namespace App\Repositories\Contracts;

interface StudyMaterialRepositoryInterface extends BaseRepositoryInterface
{
    public function getPaginatedWithRelations(int $perPage = 10, array $filters = []);
}