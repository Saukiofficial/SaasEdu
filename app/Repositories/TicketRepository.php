<?php

namespace App\Repositories;

use App\Models\Ticket;
use App\Repositories\Contracts\TicketRepositoryInterface;

class TicketRepository extends BaseRepository implements TicketRepositoryInterface
{
    public function __construct(Ticket $model)
    {
        parent::__construct($model);
    }

    public function getPaginatedTickets(int $perPage = 15, array $filters = [])
    {
        $query = $this->model->with(['school', 'user']);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }
        if (!empty($filters['search'])) {
            $query->where('ticket_number', 'like', "%{$filters['search']}%")
                  ->orWhere('subject', 'like', "%{$filters['search']}%");
        }

        // Urutkan tiket yang masih open dan prioritas tinggi ke atas
        return $query->orderByRaw("FIELD(status, 'open', 'in_progress', 'resolved', 'closed')")
                     ->orderByRaw("FIELD(priority, 'urgent', 'high', 'medium', 'low')")
                     ->latest()
                     ->paginate($perPage);
    }
}
