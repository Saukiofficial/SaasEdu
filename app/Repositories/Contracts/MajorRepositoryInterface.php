<?php

namespace App\Repositories\Contracts;

use App\Models\Major;
use Illuminate\Pagination\LengthAwarePaginator;

interface MajorRepositoryInterface
{
    public function getPaginatedBySchool(string $schoolId, int $perPage = 10, ?string $search = null): LengthAwarePaginator;
    public function findByIdAndSchool(int $id, string $schoolId): ?Major;
    public function create(array $data): Major;
    public function update(int $id, string $schoolId, array $data): bool;
    public function delete(int $id, string $schoolId): bool;
}
