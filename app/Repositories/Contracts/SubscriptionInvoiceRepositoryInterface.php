<?php

namespace App\Repositories\Contracts;

interface SubscriptionInvoiceRepositoryInterface
{
    public function getAllPaginatedWithSchool(int $perPage = 15);
    public function findById(string $id);
    public function create(array $data);
    public function updateStatus(string $id, string $status, ?string $paymentMethod = null);
    public function delete(string $id);
}