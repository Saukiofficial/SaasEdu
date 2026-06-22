<?php

namespace App\Repositories;

use App\Models\School;
use App\Repositories\Contracts\TenantRepositoryInterface;

class TenantRepository implements TenantRepositoryInterface
{
    public function getAllPaginated(int $perPage = 15)
    {
        // Memuat sekolah beserta jumlah user, relasi setting, dan subscription terbaru
        return School::withCount('users')
            ->with(['latestSubscription', 'tenantSetting'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function findById(string $id)
    {
        return School::findOrFail($id);
    }

    public function updateStatus(string $id, string $status)
    {
        $school = $this->findById($id);
        $school->update(['status' => $status]);
        return $school;
    }
}
