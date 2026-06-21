<?php

namespace App\Repositories\Contracts;

interface InvoiceRepositoryInterface extends BaseRepositoryInterface
{
    public function generateInvoiceNumber(string $schoolId): string;
    public function getPaginatedInvoices(int $perPage = 15, array $filters = []);
}