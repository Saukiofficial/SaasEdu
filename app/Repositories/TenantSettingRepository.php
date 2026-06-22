<?php

namespace App\Repositories;

use App\Models\School;
use App\Models\TenantSetting;
use App\Repositories\Contracts\TenantSettingRepositoryInterface;

class TenantSettingRepository implements TenantSettingRepositoryInterface
{
    public function getSchoolsWithSettings(int $perPage = 10)
    {
        // Mengambil daftar sekolah beserta pengaturannya
        return School::with('tenantSetting')->orderBy('name', 'asc')->paginate($perPage);
    }

    public function updateOrCreateSettings(string $schoolId, array $data)
    {
        // Menggunakan method updateOrCreate agar jika belum ada setting, akan dibuat baru
        return TenantSetting::updateOrCreate(
            ['school_id' => $schoolId],
            $data
        );
    }
}