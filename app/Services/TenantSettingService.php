<?php

namespace App\Services;

use App\Repositories\Contracts\TenantSettingRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class TenantSettingService
{
    protected $tenantSettingRepo;

    public function __construct(TenantSettingRepositoryInterface $tenantSettingRepo)
    {
        $this->tenantSettingRepo = $tenantSettingRepo;
    }

    public function getSettingsPaginated(int $perPage = 10)
    {
        return $this->tenantSettingRepo->getSchoolsWithSettings($perPage);
    }

    public function applySettings(string $schoolId, array $data)
    {
        DB::beginTransaction();
        try {
            $settings = $this->tenantSettingRepo->updateOrCreateSettings($schoolId, $data);
            DB::commit();
            return $settings;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Gagal memperbarui Tenant Settings: ' . $e->getMessage());
            throw $e;
        }
    }
}