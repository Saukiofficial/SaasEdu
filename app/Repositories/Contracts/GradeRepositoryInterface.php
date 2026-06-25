<?php

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface GradeRepositoryInterface
{
    // Mengambil daftar form input nilai masal berdasarkan filter kelas, mapel, dsb
    public function getBulkGradeForm(string $schoolId, string $academicYearId, string $classroomId, string $subjectId, string $type): Collection;
    
    // Menyimpan absensi masal (Insert or Update)
    public function upsertBulkGrades(string $schoolId, array $data): bool;
}
