<?php

namespace App\Repositories\Contracts;

use App\Models\Alumni;
use Illuminate\Pagination\LengthAwarePaginator;

interface AlumniRepositoryInterface
{
    public function getPaginatedBySchool(string $schoolId, int $perPage = 10, ?string $search = null, ?string $activity = null): LengthAwarePaginator;
    public function findByIdAndSchool(string $id, string $schoolId): ?Alumni;
    public function create(array $data): Alumni;
    public function update(string $id, string $schoolId, array $data): bool;
    public function delete(string $id, string $schoolId): bool;
}