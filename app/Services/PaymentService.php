<?php

namespace App\Services;

use App\Repositories\Contracts\PaymentRepositoryInterface;
use App\Models\Invoice;
use Illuminate\Support\Facades\DB;

class PaymentService extends BaseService
{
    protected PaymentRepositoryInterface $paymentRepository;

    public function __construct(PaymentRepositoryInterface $paymentRepository)
    {
        $this->paymentRepository = $paymentRepository;
    }

    public function processPayment(array $data)
    {
        return DB::transaction(function () use ($data) {
            // 1. Simpan data pembayaran
            $payment = $this->paymentRepository->create($data);

            // 2. Ambil invoice yang dibayar
            $invoice = Invoice::findOrFail($data['invoice_id']);

            // 3. Hitung total yang sudah dibayar untuk invoice ini
            $totalPaid = $invoice->payments()->sum('amount');

            // 4. Update status invoice
            if ($totalPaid >= $invoice->amount) {
                $invoice->update(['status' => 'paid']);
            } elseif ($totalPaid > 0) {
                $invoice->update(['status' => 'partial']);
            }

            return $payment;
        });
    }
}
