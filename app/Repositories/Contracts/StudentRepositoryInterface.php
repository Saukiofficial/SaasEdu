<?php

namespace App\Repositories\Contracts;

interface StudentRepositoryInterface extends BaseRepositoryInterface
{
    public function getPaginatedWithClassroom(int $perPage = 10);
}