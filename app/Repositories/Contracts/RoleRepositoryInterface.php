<?php

namespace App\Repositories\Contracts;

interface RoleRepositoryInterface
{
    public function getAllPaginated(int $perPage = 15);
    public function findById(string $id);
    public function create(array $data);
    public function update(string $id, array $data);
    public function delete(string $id);
}