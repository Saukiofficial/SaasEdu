<?php

namespace App\Services;

use App\Repositories\Contracts\ScheduleRepositoryInterface;

class ScheduleService extends BaseService
{
    protected ScheduleRepositoryInterface $scheduleRepository;

    public function __construct(ScheduleRepositoryInterface $scheduleRepository)
    {
        $this->scheduleRepository = $scheduleRepository;
    }

    public function getPaginatedSchedules()
    {
        return $this->scheduleRepository->getPaginatedWithRelations(15);
    }

    public function createSchedule(array $data)
    {
        // Logika validasi bentrok jadwal bisa ditambahkan di sini nantinya
        return $this->scheduleRepository->create($data);
    }

    public function updateSchedule(string $id, array $data)
    {
        return $this->scheduleRepository->update($id, $data);
    }

    public function deleteSchedule(string $id)
    {
        return $this->scheduleRepository->delete($id);
    }
}