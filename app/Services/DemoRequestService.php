<?php

namespace App\Services;

use App\Repositories\Contracts\DemoRequestRepositoryInterface;
use Illuminate\Support\Facades\Log;

class DemoRequestService
{
    protected $demoRequestRepository;

    public function __construct(DemoRequestRepositoryInterface $demoRequestRepository)
    {
        $this->demoRequestRepository = $demoRequestRepository;
    }

    public function getPaginatedDemoRequests(int $perPage = 10, ?string $search = null, ?string $status = null)
    {
        return $this->demoRequestRepository->getAllPaginated($perPage, $search, $status);
    }

    public function updateStatus(string $id, string $status)
    {
        try {
            return $this->demoRequestRepository->updateStatus($id, $status);
        } catch (\Exception $e) {
            Log::error("Gagal memperbarui status Demo Request: " . $e->getMessage());
            throw $e;
        }
    }

    public function deleteDemoRequest(string $id)
    {
        try {
            return $this->demoRequestRepository->delete($id);
        } catch (\Exception $e) {
            Log::error("Gagal menghapus Demo Request: " . $e->getMessage());
            throw $e;
        }
    }
}
