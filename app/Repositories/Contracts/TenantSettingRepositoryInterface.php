<?php

namespace App\Repositories\Contracts;

interface TenantSettingRepositoryInterface
{
    public function getSchoolsWithSettings(int $perPage = 10);
    public function updateOrCreateSettings(string $schoolId, array $data);
}