<?php

namespace App\Repositories;

use App\Models\Exam;
use App\Repositories\Contracts\ExamRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class ExamRepository implements ExamRepositoryInterface
{
    public function getPaginatedBySchool(string $schoolId, int $perPage = 10, array $filters = []): LengthAwarePaginator
    {
        $query = Exam::with(['teacher', 'subject', 'classroom'])
                     ->where('school_id', $schoolId);

        if (!empty($filters['search'])) {
            $query->where('title', 'like', "%{$filters['search']}%");
        }

        if (!empty($filters['classroom_id'])) {
            $query->where('classroom_id', $filters['classroom_id']);
        }
        
        if (!empty($filters['subject_id'])) {
            $query->where('subject_id', $filters['subject_id']);
        }

        return $query->latest('start_time')->paginate($perPage);
    }

    public function findByIdAndSchool(string $id, string $schoolId): ?Exam
    {
        return Exam::where('school_id', $schoolId)->where('id', $id)->firstOrFail();
    }

    public function create(array $data): Exam
    {
        return Exam::create($data);
    }

    public function update(string $id, string $schoolId, array $data): bool
    {
        $exam = $this->findByIdAndSchool($id, $schoolId);
        return $exam->update($data);
    }

    public function delete(string $id, string $schoolId): bool
    {
        $exam = $this->findByIdAndSchool($id, $schoolId);
        return $exam->delete();
    }
}
