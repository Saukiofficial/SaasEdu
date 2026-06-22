<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\ProspectService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProspectController extends Controller
{
    protected $prospectService;

    public function __construct(ProspectService $prospectService)
    {
        $this->prospectService = $prospectService;
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        $status = $request->query('status');

        $prospects = $this->prospectService->getPaginatedProspects(10, $search, $status);

        return Inertia::render('SuperAdmin/Prospect/Index', [
            'prospects' => $prospects,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ]
        ]);
    }

    public function updateStatus(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|in:new,contacted,in_progress,qualified,lost',
        ]);

        $this->prospectService->updateStatus($id, $request->status);

        return redirect()->back()->with('success', 'Status Prospect berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $this->prospectService->deleteProspect($id);

        return redirect()->back()->with('success', 'Data Prospect berhasil dihapus.');
    }
}
