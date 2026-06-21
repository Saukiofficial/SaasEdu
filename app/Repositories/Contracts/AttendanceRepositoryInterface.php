<?php

namespace App\Repositories\Contracts;

interface AttendanceRepositoryInterface extends BaseRepositoryInterface
{
    public function updateOrCreateBulk(array $attendancesData, string $date, string $academicYearId = null);
    public function getByDateAndStudents(string $date, array $studentIds);
}