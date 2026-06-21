<?php

namespace App\Repositories\Contracts;

interface AdmissionRepositoryInterface extends BaseRepositoryInterface
{
    public function generateRegistrationNumber(string $schoolId): string;
    public function getPaginatedBySchool(string $schoolId, int $perPage = 10);
}