<?php

// Perintah untuk membuat file ini:
// php artisan make:controller SuperAdmin/LeadController

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\LeadService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeadController extends Controller
{
    protected $leadService;

    public function __construct(LeadService $leadService)
    {
        $this->leadService = $leadService;
    }

    /**
     * Menampilkan daftar leads.
     */
    public function index()
    {
        $leads = $this->leadService->getAllLeads();
        
        return Inertia::render('SuperAdmin/Leads/Index', [
            'leads' => $leads
        ]);
    }

    /**
     * Menyimpan prospek (lead) baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'school_name' => 'required|string|max:255',
            'contact_person' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'notes' => 'nullable|string'
        ]);

        $this->leadService->createLead($validated);

        return redirect()->back()->with('success', 'Data prospek (lead) baru berhasil ditambahkan.');
    }

    /**
     * Memperbarui status lead (kanban/tahapan).
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:new,contacted,demo_scheduled,negotiation,converted,lost'
        ]);

        $this->leadService->updateLeadStatus($id, $validated['status']);

        return redirect()->back()->with('success', 'Status prospek berhasil diperbarui.');
    }

    /**
     * Menghapus lead.
     */
    public function destroy($id)
    {
        $this->leadService->deleteLead($id);
        
        return redirect()->back()->with('success', 'Data prospek berhasil dihapus.');
    }
}