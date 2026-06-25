<?php

namespace App\Services;

use App\Repositories\Contracts\EmployeeRepositoryInterface;

class EmployeeService
{
    public function __construct(
        protected EmployeeRepositoryInterface $employeeRepository
    ) {}

    public function getEmployeesPaginated(string $schoolId, array $filters = [])
    {
        $search = $filters['search'] ?? null;
        $status = $filters['status'] ?? null;
        $perPage = $filters['per_page'] ?? 10;

        return $this->employeeRepository->getPaginatedBySchool($schoolId, $perPage, $search, $status);
    }

    public function createEmployee(string $schoolId, array $data)
    {
        $data['school_id'] = $schoolId;
        return $this->employeeRepository->create($data);
    }

    public function updateEmployee(string $id, string $schoolId, array $data)
    {
        return $this->employeeRepository->update($id, $schoolId, $data);
    }

    public function deleteEmployee(string $id, string $schoolId)
    {
        return $this->employeeRepository->delete($id, $schoolId);
    }
}
