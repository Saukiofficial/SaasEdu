<?php

namespace App\Repositories\Contracts;

use App\Models\SchoolProfile;

interface SchoolProfileRepositoryInterface
{
    public function findBySchoolId(string $schoolId): ?SchoolProfile;
    public function updateOrCreate(string $schoolId, array $data): SchoolProfile;
}