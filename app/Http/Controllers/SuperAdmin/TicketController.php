<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\TicketService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketController extends Controller
{
    protected TicketService $ticketService;

    public function __construct(TicketService $ticketService)
    {
        $this->ticketService = $ticketService;
    }

    public function index(Request $request)
    {
        if (auth()->user()->school_id !== null) {
            abort(403, 'Akses ditolak.');
        }

        $filters = $request->only(['status', 'priority', 'search']);
        $tickets = $this->ticketService->getAllTickets($filters);

        return Inertia::render('SuperAdmin/Tickets/Index', [
            'tickets' => $tickets,
            'filters' => $filters
        ]);
    }

    public function update(Request $request, string $id)
    {
        if (auth()->user()->school_id !== null) abort(403);

        $validated = $request->validate([
            'admin_response' => 'required|string',
            'status' => 'required|in:open,in_progress,resolved,closed',
        ]);

        $this->ticketService->respondToTicket($id, $validated);

        return redirect()->back()->with('message', 'Respon tiket berhasil dikirim.');
    }

    public function destroy(string $id)
    {
        if (auth()->user()->school_id !== null) abort(403);

        $this->ticketService->deleteTicket($id);
        return redirect()->back()->with('message', 'Tiket berhasil dihapus.');
    }
}