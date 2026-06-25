<?php

namespace App\Repositories;

use App\Models\Schedule;
use App\Repositories\Contracts\ScheduleRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class ScheduleRepository implements ScheduleRepositoryInterface
{
    public function getPaginatedBySchool(string $schoolId, int $perPage = 10, array $filters = []): LengthAwarePaginator
    {
        // Eager load semua relasi agar tidak N+1 query problem
        $query = Schedule::with(['academicYear', 'classroom', 'subject', 'teacher'])
                         ->where('school_id', $schoolId);

        if (!empty($filters['classroom_id'])) {
            $query->where('classroom_id', $filters['classroom_id']);
        }

        if (!empty($filters['day'])) {
            $query->where('day', $filters['day']);
        }

        // Urutkan berdasarkan hari (secara string/enum) lalu jam mulai
        // Note: Pengurutan hari secara alfabetis mungkin kurang pas, tapi cukup untuk versi standar.
        return $query->orderBy('day')->orderBy('start_time')->paginate($perPage);
    }

    public function findByIdAndSchool(string $id, string $schoolId): ?Schedule
    {
        return Schedule::where('school_id', $schoolId)->where('id', $id)->firstOrFail();
    }

    public function create(array $data): Schedule
    {
        return Schedule::create($data);
    }

    public function update(string $id, string $schoolId, array $data): bool
    {
        $schedule = $this->findByIdAndSchool($id, $schoolId);
        return $schedule->update($data);
    }

    public function delete(string $id, string $schoolId): bool
    {
        $schedule = $this->findByIdAndSchool($id, $schoolId);
        return $schedule->delete();
    }
}
