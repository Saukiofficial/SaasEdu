<?php

namespace App\Repositories;

use App\Models\StudentAttendance;
use App\Models\Student;
use App\Repositories\Contracts\StudentAttendanceRepositoryInterface;
use Illuminate\Support\Facades\DB;

class StudentAttendanceRepository implements StudentAttendanceRepositoryInterface
{
    public function getAttendanceByClassroomAndDate(string $schoolId, string $classroomId, string $date)
    {
        // 1. Ambil semua siswa aktif di kelas tersebut
        $students = Student::where('school_id', $schoolId)
                           ->where('classroom_id', $classroomId)
                           ->where('status', 'active')
                           ->orderBy('name')
                           ->get(['id', 'name', 'nis', 'gender']);

        // 2. Ambil data absensi yang sudah ada pada tanggal tersebut
        $attendances = StudentAttendance::where('school_id', $schoolId)
                                        ->where('classroom_id', $classroomId)
                                        ->where('date', $date)
                                        ->get()
                                        ->keyBy('student_id');

        // 3. Gabungkan datanya (Jika belum absen, default 'present')
        return $students->map(function ($student) use ($attendances) {
            $existing = $attendances->get($student->id);
            return [
                'student_id' => $student->id,
                'name' => $student->name,
                'nis' => $student->nis,
                'gender' => $student->gender,
                'status' => $existing ? $existing->status : 'present',
                'notes' => $existing ? $existing->notes : '',
            ];
        });
    }

    public function upsertBulkAttendance(string $schoolId, string $classroomId, string $date, array $attendances): bool
    {
        DB::transaction(function () use ($schoolId, $classroomId, $date, $attendances) {
            foreach ($attendances as $att) {
                // updateOrCreate akan mencari data berdasarkan kunci pertama, 
                // jika tidak ada maka akan dibuat baru dengan data gabungan kunci pertama & kedua.
                StudentAttendance::updateOrCreate(
                    [
                        'school_id' => $schoolId,
                        'student_id' => $att['student_id'],
                        'date' => $date,
                    ],
                    [
                        'classroom_id' => $classroomId,
                        'status' => $att['status'],
                        'notes' => $att['notes'] ?? null,
                    ]
                );
            }
        });

        return true;
    }
}
