<?php

namespace App\Repositories\Contracts;

interface BlogRepositoryInterface
{
    public function getAllPaginated(int $perPage = 10, ?string $search = null, ?string $status = null);
    public function findById(string $id);
    public function create(array $data);
    public function update(string $id, array $data);
    public function delete(string $id);
}
