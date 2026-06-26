<?php

namespace App\Repositories;

use App\Models\SourceCodeOrder;
use App\Repositories\Contracts\SourceCodeOrderRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class SourceCodeOrderRepository implements SourceCodeOrderRepositoryInterface
{
    public function getAllPaginated(int $perPage = 15, ?string $search = null, ?string $status = null): LengthAwarePaginator
    {
        $query = SourceCodeOrder::with(['user', 'sourceCode'])->latest();

        if ($search) {
            $query->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  })
                  ->orWhereHas('sourceCode', function($q) use ($search) {
                      $q->where('title', 'like', "%{$search}%");
                  });
        }

        if ($status) {
            $query->where('status', $status);
        }

        return $query->paginate($perPage);
    }

    public function findById(string $id): ?SourceCodeOrder
    {
        return SourceCodeOrder::with(['user', 'sourceCode'])->findOrFail($id);
    }

    public function updateStatus(string $id, string $status): SourceCodeOrder
    {
        $order = $this->findById($id);
        $order->update(['status' => $status]);
        return $order;
    }

    public function delete(string $id): bool
    {
        $order = $this->findById($id);
        return $order->delete();
    }
}