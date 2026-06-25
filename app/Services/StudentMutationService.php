<?php

namespace App\Services;

use App\Repositories\Contracts\StudentMutationRepositoryInterface;
use App\Models\Student;
use Illuminate\Support\Facades\DB;

class StudentMutationService
{
    public function __construct(
        protected StudentMutationRepositoryInterface $mutationRepository
    ) {}

    public function getMutationsPaginated(string $schoolId, array $filters = [])
    {
        $search = $filters['search'] ?? null;
        $type = $filters['type'] ?? null;
        $perPage = $filters['per_page'] ?? 10;

        return $this->mutationRepository->getPaginatedBySchool($schoolId, $perPage, $search, $type);
    }

    public function createMutation(string $schoolId, array $data)
    {
        return DB::transaction(function () use ($schoolId, $data) {
            $data['school_id'] = $schoolId;
            $mutation = $this->mutationRepository->create($data);

            // Update status siswa otomatis berdasarkan tipe mutasi
            $this->syncStudentStatus($mutation->student_id, $mutation->type);

            return $mutation;
        });
    }

    public function updateMutation(string $id, string $schoolId, array $data)
    {
        return DB::transaction(function () use ($id, $schoolId, $data) {
            $updated = $this->mutationRepository->update($id, $schoolId, $data);
            
            $mutation = $this->mutationRepository->findByIdAndSchool($id, $schoolId);
            $this->syncStudentStatus($mutation->student_id, $mutation->type);

            return $updated;
        });
    }

    public function deleteMutation(string $id, string $schoolId)
    {
        // Opsional: Jika mutasi dihapus, apakah status siswa dikembalikan? 
        // Untuk amannya, kita biarkan statusnya dan minta Admin membetulkan manual di Data Siswa.
        return $this->mutationRepository->delete($id, $schoolId);
    }

    /**
     * Helper untuk mengupdate status student di database
     */
    protected function syncStudentStatus(string $studentId, string $mutationType): void
    {
        $student = Student::find($studentId);
        if ($student) {
            if ($mutationType === 'Keluar') {
                $student->update(['status' => 'dropped_out']);
            } elseif ($mutationType === 'Masuk') {
                $student->update(['status' => 'active']);
            }
        }
    }
}
