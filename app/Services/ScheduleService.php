<?php

namespace App\Services;

use App\Repositories\Contracts\ScheduleRepositoryInterface;

class ScheduleService
{
    public function __construct(
        protected ScheduleRepositoryInterface $scheduleRepository
    ) {}

    public function getSchedulesPaginated(string $schoolId, array $filters = [])
    {
        $perPage = $filters['per_page'] ?? 10;
        return $this->scheduleRepository->getPaginatedBySchool($schoolId, $perPage, $filters);
    }

    public function createSchedule(string $schoolId, array $data)
    {
        $data['school_id'] = $schoolId;
        return $this->scheduleRepository->create($data);
    }

    public function updateSchedule(string $id, string $schoolId, array $data)
    {
        return $this->scheduleRepository->update($id, $schoolId, $data);
    }

    public function deleteSchedule(string $id, string $schoolId)
    {
        return $this->scheduleRepository->delete($id, $schoolId);
    }
}
