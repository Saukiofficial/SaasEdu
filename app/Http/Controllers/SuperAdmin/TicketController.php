<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\TicketService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketController extends Controller
{
    protected $ticketService;

    public function __construct(TicketService $ticketService)
    {
        $this->ticketService = $ticketService;
    }

    public function index()
    {
        $tickets = $this->ticketService->getAllTickets(15);
        
        return Inertia::render('SuperAdmin/Tickets/Index', [
            'tickets' => $tickets
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:open,in_progress,resolved,closed',
        ]);

        $this->ticketService->updateTicketStatus($id, $validated['status']);

        return redirect()->back()->with('success', 'Status tiket berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $this->ticketService->deleteTicket($id);
        
        return redirect()->back()->with('success', 'Tiket berhasil dihapus permanen.');
    }
}
