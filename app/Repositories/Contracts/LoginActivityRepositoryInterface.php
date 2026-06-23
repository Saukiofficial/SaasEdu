<?php

namespace App\Repositories\Contracts;

interface LoginActivityRepositoryInterface
{
    public function getAllPaginated(int $perPage = 15, ?string $search = null, ?string $status = null);
    public function logActivity(array $data);
    public function clearOldLogs(int $daysToKeep = 30);
}