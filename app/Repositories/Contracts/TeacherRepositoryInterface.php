<?php

namespace App\Repositories\Contracts;

use App\Models\Teacher;
use Illuminate\Pagination\LengthAwarePaginator;

interface TeacherRepositoryInterface
{
    public function getPaginatedBySchool(string $schoolId, int $perPage = 10, ?string $search = null, ?string $status = null): LengthAwarePaginator;
    public function findByIdAndSchool(string $id, string $schoolId): ?Teacher;
    public function create(array $data): Teacher;
    public function update(string $id, string $schoolId, array $data): bool;
    public function delete(string $id, string $schoolId): bool;
}