<?php

namespace App\Repositories\Contracts;

interface LanguageRepositoryInterface
{
    public function getAllPaginated(int $perPage = 15, ?string $search = null);
    public function findById(string $id);
    public function create(array $data);
    public function update(string $id, array $data);
    public function delete(string $id);
    public function resetDefaultLanguage();
}