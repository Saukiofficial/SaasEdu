<?php

namespace App\Services;

use App\Repositories\Contracts\ProspectRepositoryInterface;
use Illuminate\Support\Facades\Log;

class ProspectService
{
    protected $prospectRepository;

    public function __construct(ProspectRepositoryInterface $prospectRepository)
    {
        $this->prospectRepository = $prospectRepository;
    }

    public function getPaginatedProspects(int $perPage = 10, ?string $search = null, ?string $status = null)
    {
        return $this->prospectRepository->getAllPaginated($perPage, $search, $status);
    }

    public function updateStatus(string $id, string $status)
    {
        try {
            return $this->prospectRepository->updateStatus($id, $status);
        } catch (\Exception $e) {
            Log::error("Gagal memperbarui status Prospect: " . $e->getMessage());
            throw $e;
        }
    }

    public function deleteProspect(string $id)
    {
        try {
            return $this->prospectRepository->delete($id);
        } catch (\Exception $e) {
            Log::error("Gagal menghapus Prospect: " . $e->getMessage());
            throw $e;
        }
    }
}
