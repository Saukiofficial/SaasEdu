<?php

namespace App\Repositories\Contracts;

interface TeacherRepositoryInterface extends BaseRepositoryInterface
{
    public function getPaginatedTeachers(int $perPage = 10);
}