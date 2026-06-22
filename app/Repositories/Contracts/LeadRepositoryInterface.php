<?php

namespace App\Repositories\Contracts;

interface LeadRepositoryInterface
{
    public function getAllPaginated(int $perPage = 10);
    public function findById(string $id);
    public function create(array $data);
    public function update(string $id, array $data);
    public function delete(string $id);
    public function updateStatus(string $id, string $status);
}