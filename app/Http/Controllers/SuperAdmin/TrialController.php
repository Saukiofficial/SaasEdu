<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\TrialService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TrialController extends Controller
{
    protected $trialService;

    public function __construct(TrialService $trialService)
    {
        $this->trialService = $trialService;
    }

    public function index()
    {
        $trials = $this->trialService->getAllTrials();
        
        return Inertia::render('SuperAdmin/Trials/Index', [
            'trials' => $trials
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'school_name' => 'required|string|max:255',
            'contact_person' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'notes' => 'nullable|string'
        ]);

        $validated['status'] = 'active';

        $this->trialService->createTrial($validated);

        return redirect()->back()->with('success', 'Data trial berhasil ditambahkan.');
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,expired,converted,canceled'
        ]);

        $this->trialService->updateTrialStatus($id, $validated['status']);

        return redirect()->back()->with('success', 'Status trial berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $this->trialService->deleteTrial($id);
        return redirect()->back()->with('success', 'Data trial berhasil dihapus.');
    }
}
