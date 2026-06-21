<?php

namespace App\Repositories;

use App\Models\Invoice;
use App\Repositories\Contracts\InvoiceRepositoryInterface;
use Illuminate\Support\Str;

class InvoiceRepository extends BaseRepository implements InvoiceRepositoryInterface
{
    public function __construct(Invoice $model)
    {
        parent::__construct($model);
    }

    public function generateInvoiceNumber(string $schoolId): string
    {
        $prefix = 'INV-' . date('Ym') . '-';
        do {
            $number = $prefix . strtoupper(Str::random(5));
        } while ($this->model->where('invoice_number', $number)->exists());

        return $number;
    }

    public function getPaginatedInvoices(int $perPage = 15, array $filters = [])
    {
        $query = $this->model->with(['student.classroom']);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['classroom_id'])) {
            $query->whereHas('student', function ($q) use ($filters) {
                $q->where('classroom_id', $filters['classroom_id']);
            });
        }

        return $query->latest()->paginate($perPage);
    }
}
