<?php

namespace App\Repositories\Contracts;

use App\Models\Classroom;
use Illuminate\Pagination\LengthAwarePaginator;

interface ClassroomRepositoryInterface
{
    public function getPaginatedBySchool(string $schoolId, int $perPage = 10, ?string $search = null): LengthAwarePaginator;
    public function findByIdAndSchool(string $id, string $schoolId): ?Classroom;
    public function create(array $data): Classroom;
    public function update(string $id, string $schoolId, array $data): bool;
    public function delete(string $id, string $schoolId): bool;
}
