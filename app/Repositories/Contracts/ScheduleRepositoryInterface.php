<?php

namespace App\Repositories\Contracts;

use App\Models\Schedule;
use Illuminate\Pagination\LengthAwarePaginator;

interface ScheduleRepositoryInterface
{
    public function getPaginatedBySchool(string $schoolId, int $perPage = 10, array $filters = []): LengthAwarePaginator;
    public function findByIdAndSchool(string $id, string $schoolId): ?Schedule;
    public function create(array $data): Schedule;
    public function update(string $id, string $schoolId, array $data): bool;
    public function delete(string $id, string $schoolId): bool;
}
