<?php

namespace App\Repositories\Contracts;

interface PackageRepositoryInterface
{
    public function getAll();
    public function findById(string $id);
    public function create(array $data);
    public function update(string $id, array $data);
    public function delete(string $id);
}