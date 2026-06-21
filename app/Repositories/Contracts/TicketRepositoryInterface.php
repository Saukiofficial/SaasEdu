<?php

namespace App\Repositories\Contracts;

interface TicketRepositoryInterface extends BaseRepositoryInterface
{
    public function getPaginatedTickets(int $perPage = 15, array $filters = []);
}