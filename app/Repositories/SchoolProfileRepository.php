<?php

namespace App\Repositories;

use App\Models\SchoolProfile;
use App\Repositories\Contracts\SchoolProfileRepositoryInterface;

class SchoolProfileRepository implements SchoolProfileRepositoryInterface
{
    public function findBySchoolId(string $schoolId): ?SchoolProfile
    {
        return SchoolProfile::where('school_id', $schoolId)->first();
    }

    public function updateOrCreate(string $schoolId, array $data): SchoolProfile
    {
        return SchoolProfile::updateOrCreate(
            ['school_id' => $schoolId], // Kriteria pencarian
            $data // Data yang akan di-update / di-create
        );
    }
}
