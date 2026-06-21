<?php

namespace App\Services;

use App\Repositories\Contracts\AdmissionRepositoryInterface;
use App\Models\AcademicYear;
use Illuminate\Support\Facades\Auth;

class AdmissionService extends BaseService
{
    protected AdmissionRepositoryInterface $admissionRepository;

    public function __construct(AdmissionRepositoryInterface $admissionRepository)
    {
        $this->admissionRepository = $admissionRepository;
    }

    public function createPublicRegistration(string $schoolId, array $data)
    {
        $activeYear = AcademicYear::withoutGlobalScopes()
            ->where('school_id', $schoolId)
            ->where('is_active', true)
            ->first();

        $data['school_id'] = $schoolId;
        $data['academic_year_id'] = $activeYear ? $activeYear->id : null;
        $data['registration_number'] = $this->admissionRepository->generateRegistrationNumber($schoolId);
        $data['status'] = 'pending';

        // Perbaikan: Hapus withoutEvents() agar trait UUID tetap berjalan
        return $this->admissionRepository->create($data);
    }

    public function getAdminAdmissions()
    {
        $schoolId = Auth::user()->school_id;
        return $this->admissionRepository->getPaginatedBySchool($schoolId);
    }

    public function updateStatus(string $id, string $status)
    {
        return $this->admissionRepository->update($id, ['status' => $status]);
    }
}