<?php

namespace App\Repositories\Contracts;

interface ScheduleRepositoryInterface extends BaseRepositoryInterface
{
    public function getPaginatedWithRelations(int $perPage = 10);
}