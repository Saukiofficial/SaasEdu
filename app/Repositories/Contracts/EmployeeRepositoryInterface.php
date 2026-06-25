<?php

namespace App\Repositories\Contracts;

use App\Models\Employee;
use Illuminate\Pagination\LengthAwarePaginator;

interface EmployeeRepositoryInterface
{
    public function getPaginatedBySchool(string $schoolId, int $perPage = 10, ?string $search = null, ?string $status = null): LengthAwarePaginator;
    public function findByIdAndSchool(string $id, string $schoolId): ?Employee;
    public function create(array $data): Employee;
    public function update(string $id, string $schoolId, array $data): bool;
    public function delete(string $id, string $schoolId): bool;
}
