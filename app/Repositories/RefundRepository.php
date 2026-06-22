<?php

namespace App\Repositories;

use App\Models\Refund;
use App\Repositories\Contracts\RefundRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class RefundRepository implements RefundRepositoryInterface
{
    public function getAllPaginated(int $perPage = 10, ?string $search = null, ?string $status = null): LengthAwarePaginator
    {
        $query = Refund::with(['school', 'subscriptionInvoice'])->latest();

        if ($search) {
            $query->whereHas('school', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhereHas('subscriptionInvoice', function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        return $query->paginate($perPage);
    }

    public function findById(string $id): ?Refund
    {
        return Refund::with(['school', 'subscriptionInvoice'])->findOrFail($id);
    }

    public function create(array $data): Refund
    {
        return Refund::create($data);
    }

    public function update(string $id, array $data): Refund
    {
        $refund = $this->findById($id);
        $refund->update($data);
        return $refund;
    }

    public function delete(string $id): bool
    {
        $refund = $this->findById($id);
        return $refund->delete();
    }

    public function updateStatus(string $id, string $status, ?string $notes = null): Refund
    {
        $refund = $this->findById($id);
        
        $data = ['status' => $status];
        if ($notes) {
            $data['notes'] = $notes;
        }

        // Jika statusnya processed, catat waktunya
        if ($status === 'processed' && $refund->status !== 'processed') {
            $data['processed_at'] = now();
        }

        $refund->update($data);
        return $refund;
    }
}
