<?php

namespace App\Services;

use App\Repositories\Contracts\SourceCodeOrderRepositoryInterface;
use Illuminate\Support\Facades\Log;

class SourceCodeOrderService
{
    protected $orderRepository;

    public function __construct(SourceCodeOrderRepositoryInterface $orderRepository)
    {
        $this->orderRepository = $orderRepository;
    }

    public function getPaginatedOrders(int $perPage = 15, ?string $search = null, ?string $status = null)
    {
        return $this->orderRepository->getAllPaginated($perPage, $search, $status);
    }

    public function updateOrderStatus(string $id, string $status)
    {
        try {
            return $this->orderRepository->updateStatus($id, $status);
        } catch (\Exception $e) {
            Log::error("Gagal memperbarui status order source code: " . $e->getMessage());
            throw $e;
        }
    }

    public function deleteOrder(string $id)
    {
        try {
            return $this->orderRepository->delete($id);
        } catch (\Exception $e) {
            Log::error("Gagal menghapus order source code: " . $e->getMessage());
            throw $e;
        }
    }
}
