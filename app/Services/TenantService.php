<?php

namespace App\Services;

use App\Repositories\Contracts\TenantRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class TenantService
{
    protected $tenantRepo;

    public function __construct(TenantRepositoryInterface $tenantRepo)
    {
        $this->tenantRepo = $tenantRepo;
    }

    public function getAllTenants(int $perPage = 15)
    {
        return $this->tenantRepo->getAllPaginated($perPage);
    }

    public function updateTenantStatus(string $id, string $status)
    {
        DB::beginTransaction();
        try {
            $tenant = $this->tenantRepo->updateStatus($id, $status);
            
            // TODO: (Opsional) Kirim email notifikasi ke Admin Sekolah bahwa akun ditangguhkan / diaktifkan
            
            DB::commit();
            return $tenant;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error updating tenant status: ' . $e->getMessage());
            throw $e;
        }
    }
}