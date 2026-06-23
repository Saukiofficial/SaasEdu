<?php

namespace App\Services;

use App\Repositories\Contracts\IpAccessRepositoryInterface;
use Illuminate\Support\Facades\Log;

class IpAccessService
{
    protected $ipAccessRepository;

    public function __construct(IpAccessRepositoryInterface $ipAccessRepository)
    {
        $this->ipAccessRepository = $ipAccessRepository;
    }

    public function getPaginatedIpAccesses(int $perPage = 15, ?string $search = null, ?string $type = null)
    {
        return $this->ipAccessRepository->getAllPaginated($perPage, $search, $type);
    }

    public function createIpAccess(array $data)
    {
        try {
            return $this->ipAccessRepository->create($data);
        } catch (\Exception $e) {
            Log::error("Gagal menambahkan IP Access: " . $e->getMessage());
            throw $e;
        }
    }

    public function updateIpAccess(string $id, array $data)
    {
        try {
            return $this->ipAccessRepository->update($id, $data);
        } catch (\Exception $e) {
            Log::error("Gagal memperbarui IP Access: " . $e->getMessage());
            throw $e;
        }
    }

    public function deleteIpAccess(string $id)
    {
        try {
            return $this->ipAccessRepository->delete($id);
        } catch (\Exception $e) {
            Log::error("Gagal menghapus IP Access: " . $e->getMessage());
            throw $e;
        }
    }

    public function toggleStatus(string $id)
    {
        try {
            return $this->ipAccessRepository->toggleStatus($id);
        } catch (\Exception $e) {
            Log::error("Gagal mengubah status IP Access: " . $e->getMessage());
            throw $e;
        }
    }
}
