<?php

namespace App\Repositories\Contracts;

interface SourceCodeOrderRepositoryInterface
{
    public function getAllPaginated(int $perPage = 15, ?string $search = null, ?string $status = null);
    public function findById(string $id);
    public function updateStatus(string $id, string $status);
    public function delete(string $id);
}
