<?php

namespace App\Repositories\Contracts;

interface DomainRepositoryInterface
{
    public function getAllPaginated(int $perPage = 15);
    public function updateCustomDomain(string $schoolId, ?string $customDomain);
}