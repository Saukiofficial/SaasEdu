<?php

namespace App\Services;

use App\Repositories\Contracts\StudentAttendanceRepositoryInterface;

class StudentAttendanceService
{
    public function __construct(
        protected StudentAttendanceRepositoryInterface $attendanceRepository
    ) {}

    public function getAttendanceForm(string $schoolId, string $classroomId, string $date)
    {
        return $this->attendanceRepository->getAttendanceByClassroomAndDate($schoolId, $classroomId, $date);
    }

    public function saveBulkAttendance(string $schoolId, array $data)
    {
        return $this->attendanceRepository->upsertBulkAttendance(
            $schoolId,
            $data['classroom_id'],
            $data['date'],
            $data['attendances']
        );
    }
}
