<?php

namespace App\Services;

use App\Repositories\Contracts\AcademicYearRepositoryInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AcademicYearService extends BaseService
{
    protected AcademicYearRepositoryInterface $academicYearRepository;

    public function __construct(AcademicYearRepositoryInterface $academicYearRepository)
    {
        $this->academicYearRepository = $academicYearRepository;
    }

    public function getAll()
    {
        // Trait BelongsToTenant otomatis memfilter berdasarkan school_id
        return $this->academicYearRepository->all();
    }

    public function createAcademicYear(array $data)
    {
        return DB::transaction(function () use ($data) {
            $schoolId = Auth::user()->school_id;

            if (isset($data['is_active']) && $data['is_active']) {
                $this->academicYearRepository->deactivateAllForSchool($schoolId);
            }

            return $this->academicYearRepository->create($data);
        });
    }

    public function updateAcademicYear(string $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $schoolId = Auth::user()->school_id;

            if (isset($data['is_active']) && $data['is_active']) {
                $this->academicYearRepository->deactivateAllForSchool($schoolId);
            }

            return $this->academicYearRepository->update($id, $data);
        });
    }

    public function deleteAcademicYear(string $id)
    {
        return $this->academicYearRepository->delete($id);
    }
}
