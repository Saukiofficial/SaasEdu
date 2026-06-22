<?php

namespace App\Repositories\Contracts;

interface TenantRepositoryInterface
{
    public function getAllPaginated(int $perPage = 15);
    public function findById(string $id);
    public function updateStatus(string $id, string $status);
}