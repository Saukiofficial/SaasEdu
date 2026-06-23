<?php

namespace App\Repositories\Contracts;

interface IpAccessRepositoryInterface
{
    public function getAllPaginated(int $perPage = 15, ?string $search = null, ?string $type = null);
    public function findById(string $id);
    public function create(array $data);
    public function update(string $id, array $data);
    public function delete(string $id);
    public function toggleStatus(string $id);
}