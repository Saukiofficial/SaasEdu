<?php

namespace App\Services;

use App\Repositories\Contracts\RefundRepositoryInterface;
use Illuminate\Support\Facades\Log;

class RefundService
{
    protected $refundRepository;

    public function __construct(RefundRepositoryInterface $refundRepository)
    {
        $this->refundRepository = $refundRepository;
    }

    public function getPaginatedRefunds(int $perPage = 10, ?string $search = null, ?string $status = null)
    {
        return $this->refundRepository->getAllPaginated($perPage, $search, $status);
    }

    public function updateStatus(string $id, string $status, ?string $notes = null)
    {
        try {
            return $this->refundRepository->updateStatus($id, $status, $notes);
        } catch (\Exception $e) {
            Log::error("Gagal memperbarui status Refund: " . $e->getMessage());
            throw $e;
        }
    }

    public function deleteRefund(string $id)
    {
        try {
            return $this->refundRepository->delete($id);
        } catch (\Exception $e) {
            Log::error("Gagal menghapus data Refund: " . $e->getMessage());
            throw $e;
        }
    }
}
