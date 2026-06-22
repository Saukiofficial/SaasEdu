<?php

namespace App\Services;

use App\Repositories\Contracts\TicketRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class TicketService
{
    protected $ticketRepo;

    public function __construct(TicketRepositoryInterface $ticketRepo)
    {
        $this->ticketRepo = $ticketRepo;
    }

    public function getAllTickets(int $perPage = 10)
    {
        return $this->ticketRepo->getAllPaginatedWithSchool($perPage);
    }

    public function updateTicketStatus(string $id, string $status)
    {
        DB::beginTransaction();
        try {
            $ticket = $this->ticketRepo->updateStatus($id, $status);
            
            // TODO: (Opsional) Kirim notifikasi/email ke admin sekolah bahwa status tiket berubah
            
            DB::commit();
            return $ticket;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error updating ticket status: ' . $e->getMessage());
            throw $e;
        }
    }

    public function deleteTicket(string $id)
    {
        return $this->ticketRepo->delete($id);
    }
}