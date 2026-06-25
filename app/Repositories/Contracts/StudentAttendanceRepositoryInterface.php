<?php

namespace App\Repositories\Contracts;

interface StudentAttendanceRepositoryInterface
{
    // Mengambil data absensi per kelas pada tanggal tertentu
    public function getAttendanceByClassroomAndDate(string $schoolId, string $classroomId, string $date);
    
    // Menyimpan absensi masal (Insert or Update)
    public function upsertBulkAttendance(string $schoolId, string $classroomId, string $date, array $attendances): bool;
}
