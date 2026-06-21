<?php

namespace App\Repositories;

use App\Models\Attendance;
use App\Repositories\Contracts\AttendanceRepositoryInterface;
use Illuminate\Support\Facades\Auth;

class AttendanceRepository extends BaseRepository implements AttendanceRepositoryInterface
{
    public function __construct(Attendance $model)
    {
        parent::__construct($model);
    }

    public function updateOrCreateBulk(array $attendancesData, string $date, string $academicYearId = null)
    {
        $schoolId = Auth::user()->school_id;

        foreach ($attendancesData as $data) {
            $this->model->updateOrCreate(
                [
                    'school_id' => $schoolId,
                    'student_id' => $data['student_id'],
                    'date' => $date,
                ],
                [
                    'academic_year_id' => $academicYearId,
                    'status' => $data['status'],
                    'note' => $data['note'] ?? null,
                ]
            );
        }

        return true;
    }

    public function getByDateAndStudents(string $date, array $studentIds)
    {
        return $this->model->where('date', $date)
                           ->whereIn('student_id', $studentIds)
                           ->get()
                           ->keyBy('student_id');
    }
}