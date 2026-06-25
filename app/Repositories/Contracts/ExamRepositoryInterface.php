<?php

namespace App\Repositories\Contracts;

use App\Models\Exam;
use Illuminate\Pagination\LengthAwarePaginator;

interface ExamRepositoryInterface
{
    public function getPaginatedBySchool(string $schoolId, int $perPage = 10, array $filters = []): LengthAwarePaginator;
    public function findByIdAndSchool(string $id, string $schoolId): ?Exam;
    public function create(array $data): Exam;
    public function update(string $id, string $schoolId, array $data): bool;
    public function delete(string $id, string $schoolId): bool;
}
