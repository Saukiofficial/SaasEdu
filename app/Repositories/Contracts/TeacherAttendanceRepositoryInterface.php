<?php

namespace App\Repositories\Contracts;

interface TeacherAttendanceRepositoryInterface
{
    // Mengambil data absensi semua guru aktif pada tanggal tertentu
    public function getAttendanceByDate(string $schoolId, string $date);
    
    // Menyimpan absensi masal (Insert or Update)
    public function upsertBulkAttendance(string $schoolId, string $date, array $attendances): bool;
}
