<?php

namespace App\Services;

use App\Repositories\Contracts\SubscriptionInvoiceRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class SubscriptionInvoiceService
{
    protected $invoiceRepo;

    public function __construct(SubscriptionInvoiceRepositoryInterface $invoiceRepo)
    {
        $this->invoiceRepo = $invoiceRepo;
    }

    public function getAllInvoices(int $perPage = 15)
    {
        return $this->invoiceRepo->getAllPaginatedWithSchool($perPage);
    }

    public function createInvoice(array $data)
    {
        DB::beginTransaction();
        try {
            $invoice = $this->invoiceRepo->create($data);
            DB::commit();
            return $invoice;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error creating subscription invoice: ' . $e->getMessage());
            throw $e;
        }
    }

    public function processPaymentManual(string $id, string $paymentMethod)
    {
        DB::beginTransaction();
        try {
            $invoice = $this->invoiceRepo->updateStatus($id, 'paid', $paymentMethod);
            
            // TODO: (Opsional) Trigger event/notifikasi kwitansi pembayaran ke email sekolah
            
            DB::commit();
            return $invoice;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error processing manual payment: ' . $e->getMessage());
            throw $e;
        }
    }

    public function cancelInvoice(string $id)
    {
        return $this->invoiceRepo->updateStatus($id, 'canceled');
    }

    public function deleteInvoice(string $id)
    {
        return $this->invoiceRepo->delete($id);
    }
}
