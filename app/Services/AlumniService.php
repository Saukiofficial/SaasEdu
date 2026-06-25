<?php

namespace App\Services;

use App\Repositories\Contracts\AlumniRepositoryInterface;
use App\Models\Student;
use Illuminate\Support\Facades\DB;

class AlumniService
{
    public function __construct(
        protected AlumniRepositoryInterface $alumniRepository
    ) {}

    public function getAlumnisPaginated(string $schoolId, array $filters = [])
    {
        $search = $filters['search'] ?? null;
        $activity = $filters['activity'] ?? null;
        $perPage = $filters['per_page'] ?? 10;

        return $this->alumniRepository->getPaginatedBySchool($schoolId, $perPage, $search, $activity);
    }

    public function createAlumni(string $schoolId, array $data)
    {
        return DB::transaction(function () use ($schoolId, $data) {
            $data['school_id'] = $schoolId;
            $alumni = $this->alumniRepository->create($data);

            // Otomatis ubah status siswa menjadi 'graduated' (Lulus)
            Student::where('id', $alumni->student_id)->update(['status' => 'graduated']);

            return $alumni;
        });
    }

    public function updateAlumni(string $id, string $schoolId, array $data)
    {
        return DB::transaction(function () use ($id, $schoolId, $data) {
            $updated = $this->alumniRepository->update($id, $schoolId, $data);
            
            // Memastikan status siswa tetap 'graduated' meskipun data diedit
            $alumni = $this->alumniRepository->findByIdAndSchool($id, $schoolId);
            Student::where('id', $alumni->student_id)->update(['status' => 'graduated']);

            return $updated;
        });
    }

    public function deleteAlumni(string $id, string $schoolId)
    {
        return $this->alumniRepository->delete($id, $schoolId);
    }
}
