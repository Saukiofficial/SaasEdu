<?php

namespace App\Repositories;

use App\Models\School;
use App\Models\TenantSetting;
use App\Repositories\Contracts\DomainRepositoryInterface;

class DomainRepository implements DomainRepositoryInterface
{
    public function getAllPaginated(int $perPage = 15)
    {
        // Mengambil daftar sekolah beserta pengaturan domainnya
        return School::with('tenantSetting')->orderBy('name', 'asc')->paginate($perPage);
    }

    public function updateCustomDomain(string $schoolId, ?string $customDomain)
    {
        // Update atau buat baris baru di tenant_settings jika belum ada
        return TenantSetting::updateOrCreate(
            ['school_id' => $schoolId],
            ['custom_domain' => $customDomain]
        );
    }
}
