<?php

namespace App\Repositories;

use App\Models\Employee;
use App\Repositories\Contracts\EmployeeRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class EmployeeRepository implements EmployeeRepositoryInterface
{
    public function getPaginatedBySchool(string $schoolId, int $perPage = 10, ?string $search = null, ?string $status = null): LengthAwarePaginator
    {
        $query = Employee::where('school_id', $schoolId);

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nip_or_nik', 'like', "%{$search}%")
                  ->orWhere('position', 'like', "%{$search}%");
            });
        }

        if (!empty($status)) {
            $query->where('status', $status);
        }

        return $query->orderBy('name')->paginate($perPage);
    }

    public function findByIdAndSchool(string $id, string $schoolId): ?Employee
    {
        return Employee::where('school_id', $schoolId)->where('id', $id)->firstOrFail();
    }

    public function create(array $data): Employee
    {
        return Employee::create($data);
    }

    public function update(string $id, string $schoolId, array $data): bool
    {
        $employee = $this->findByIdAndSchool($id, $schoolId);
        return $employee->update($data);
    }

    public function delete(string $id, string $schoolId): bool
    {
        $employee = $this->findByIdAndSchool($id, $schoolId);
        return $employee->delete();
    }
}
