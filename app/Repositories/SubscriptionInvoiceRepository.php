<?php

namespace App\Repositories;

use App\Models\SubscriptionInvoice;
use App\Repositories\Contracts\SubscriptionInvoiceRepositoryInterface;
use Carbon\Carbon;

class SubscriptionInvoiceRepository implements SubscriptionInvoiceRepositoryInterface
{
    public function getAllPaginatedWithSchool(int $perPage = 15)
    {
        return SubscriptionInvoice::with('school')
            ->orderByRaw("FIELD(status, 'unpaid', 'paid', 'canceled')")
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function findById(string $id)
    {
        return SubscriptionInvoice::with('school')->findOrFail($id);
    }

    public function create(array $data)
    {
        return SubscriptionInvoice::create($data);
    }

    public function updateStatus(string $id, string $status, ?string $paymentMethod = null)
    {
        $invoice = $this->findById($id);
        
        $updateData = ['status' => $status];
        
        // Jika status diubah menjadi paid, catat waktu dan metode pembayarannya
        if ($status === 'paid' && $invoice->status !== 'paid') {
            $updateData['paid_at'] = Carbon::now();
            if ($paymentMethod) {
                $updateData['payment_method'] = $paymentMethod;
            }
        } elseif ($status !== 'paid') {
            $updateData['paid_at'] = null; // Reset jika diubah ke unpaid/canceled
        }

        $invoice->update($updateData);
        return $invoice;
    }

    public function delete(string $id)
    {
        $invoice = $this->findById($id);
        return $invoice->delete();
    }
}