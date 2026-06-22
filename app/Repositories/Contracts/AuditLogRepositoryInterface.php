<?php

namespace App\Repositories\Contracts;

interface AuditLogRepositoryInterface
{
    public function getAllPaginatedWithUser(int $perPage = 20, array $filters = []);
    public function logEvent(array $data);
    // Tidak ada method update() atau delete() untuk menjaga integritas Log
}