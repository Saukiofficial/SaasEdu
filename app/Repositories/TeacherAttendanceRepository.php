<?php

namespace App\Repositories;

use App\Models\TeacherAttendance;
use App\Models\Teacher;
use App\Repositories\Contracts\TeacherAttendanceRepositoryInterface;
use Illuminate\Support\Facades\DB;

class TeacherAttendanceRepository implements TeacherAttendanceRepositoryInterface
{
    public function getAttendanceByDate(string $schoolId, string $date)
    {
        // 1. Ambil semua guru aktif di sekolah tersebut
        $teachers = Teacher::where('school_id', $schoolId)
                           ->where('status', 'active')
                           ->orderBy('name')
                           ->get(['id', 'name', 'nip']);

        // 2. Ambil data absensi yang sudah ada pada tanggal tersebut
        $attendances = TeacherAttendance::where('school_id', $schoolId)
                                        ->where('date', $date)
                                        ->get()
                                        ->keyBy('teacher_id');

        // 3. Gabungkan datanya (Jika belum absen, default 'present')
        return $teachers->map(function ($teacher) use ($attendances) {
            $existing = $attendances->get($teacher->id);
            return [
                'teacher_id' => $teacher->id,
                'name' => $teacher->name,
                'nip' => $teacher->nip,
                'status' => $existing ? $existing->status : 'present',
                'notes' => $existing ? $existing->notes : '',
            ];
        });
    }

    public function upsertBulkAttendance(string $schoolId, string $date, array $attendances): bool
    {
        DB::transaction(function () use ($schoolId, $date, $attendances) {
            foreach ($attendances as $att) {
                TeacherAttendance::updateOrCreate(
                    [
                        'school_id' => $schoolId,
                        'teacher_id' => $att['teacher_id'],
                        'date' => $date,
                    ],
                    [
                        'status' => $att['status'],
                        'notes' => $att['notes'] ?? null,
                    ]
                );
            }
        });

        return true;
    }
}
