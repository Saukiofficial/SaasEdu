<?php

namespace App\Repositories;

use App\Models\Ticket;
use App\Repositories\Contracts\TicketRepositoryInterface;

class TicketRepository implements TicketRepositoryInterface
{
    public function getAllPaginatedWithSchool(int $perPage = 10)
    {
        // Menampilkan tiket terbaru terlebih dahulu, dan mengambil relasi nama sekolah
        return Ticket::with('school')
                ->orderByRaw("FIELD(status, 'open', 'in_progress', 'resolved', 'closed')")
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);
    }

    public function findById(string $id)
    {
        return Ticket::with('school')->findOrFail($id);
    }

    public function updateStatus(string $id, string $status)
    {
        $ticket = $this->findById($id);
        $ticket->update(['status' => $status]);
        return $ticket;
    }

    public function delete(string $id)
    {
        $ticket = $this->findById($id);
        return $ticket->delete();
    }
}
