<?php

namespace App\Services;

use App\Repositories\Contracts\TeacherAttendanceRepositoryInterface;

class TeacherAttendanceService
{
    public function __construct(
        protected TeacherAttendanceRepositoryInterface $attendanceRepository
    ) {}

    public function getAttendanceForm(string $schoolId, string $date)
    {
        return $this->attendanceRepository->getAttendanceByDate($schoolId, $date);
    }

    public function saveBulkAttendance(string $schoolId, array $data)
    {
        return $this->attendanceRepository->upsertBulkAttendance(
            $schoolId,
            $data['date'],
            $data['attendances']
        );
    }
}
