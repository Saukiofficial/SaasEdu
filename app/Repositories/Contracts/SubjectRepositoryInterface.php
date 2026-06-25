<?php

namespace App\Repositories\Contracts;

use App\Models\Subject;
use Illuminate\Pagination\LengthAwarePaginator;

interface SubjectRepositoryInterface
{
    public function getPaginatedBySchool(string $schoolId, int $perPage = 10, ?string $search = null): LengthAwarePaginator;
    public function findByIdAndSchool(string $id, string $schoolId): ?Subject;
    public function create(array $data): Subject;
    public function update(string $id, string $schoolId, array $data): bool;
    public function delete(string $id, string $schoolId): bool;
}
