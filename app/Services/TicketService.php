<?php

namespace App\Services;

use App\Repositories\Contracts\TicketRepositoryInterface;
use Illuminate\Support\Str;

class TicketService extends BaseService
{
    protected TicketRepositoryInterface $ticketRepository;

    public function __construct(TicketRepositoryInterface $ticketRepository)
    {
        $this->ticketRepository = $ticketRepository;
    }

    public function getAllTickets(array $filters = [])
    {
        return $this->ticketRepository->getPaginatedTickets(15, $filters);
    }

    public function respondToTicket(string $id, array $data)
    {
        return $this->ticketRepository->update($id, [
            'admin_response' => $data['admin_response'],
            'status' => $data['status']
        ]);
    }
    
    public function deleteTicket(string $id)
    {
        return $this->ticketRepository->delete($id);
    }
}
