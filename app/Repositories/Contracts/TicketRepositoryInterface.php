<?php

namespace App\Repositories\Contracts;

interface TicketRepositoryInterface
{
    public function getAllPaginatedWithSchool(int $perPage = 10);
    public function findById(string $id);
    public function updateStatus(string $id, string $status);
    public function delete(string $id);
}