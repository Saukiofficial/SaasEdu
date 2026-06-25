<?php

namespace App\Repositories\Contracts;

use App\Models\StudentMutation;
use Illuminate\Pagination\LengthAwarePaginator;

interface StudentMutationRepositoryInterface
{
    public function getPaginatedBySchool(string $schoolId, int $perPage = 10, ?string $search = null, ?string $type = null): LengthAwarePaginator;
    public function findByIdAndSchool(string $id, string $schoolId): ?StudentMutation;
    public function create(array $data): StudentMutation;
    public function update(string $id, string $schoolId, array $data): bool;
    public function delete(string $id, string $schoolId): bool;
}
