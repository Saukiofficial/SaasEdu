<?php

namespace App\Services;

use App\Repositories\Contracts\AttendanceRepositoryInterface;
use App\Models\Student;
use App\Models\AcademicYear;

class AttendanceService extends BaseService
{
    protected AttendanceRepositoryInterface $attendanceRepository;

    public function __construct(AttendanceRepositoryInterface $attendanceRepository)
    {
        $this->attendanceRepository = $attendanceRepository;
    }

    public function getAttendanceDataForm(string $classroomId = null, string $date = null)
    {
        $students = [];
        $attendances = [];

        if ($classroomId && $date) {
            // Ambil semua siswa di kelas tersebut (sudah difilter per tenant)
            $students = Student::where('classroom_id', $classroomId)
                               ->where('status', 'active')
                               ->orderBy('name')
                               ->get();

            $studentIds = $students->pluck('id')->toArray();
            $attendances = $this->attendanceRepository->getByDateAndStudents($date, $studentIds);
        }

        return [
            'students' => $students,
            'existing_attendances' => $attendances,
        ];
    }

    public function saveBulkAttendance(array $data)
    {
        // Cari active academic year
        $activeYear = AcademicYear::where('is_active', true)->first();
        $academicYearId = $activeYear ? $activeYear->id : null;

        return $this->attendanceRepository->updateOrCreateBulk(
            $data['attendances'], 
            $data['date'], 
            $academicYearId
        );
    }
}