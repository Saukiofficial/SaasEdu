<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\DemoRequestService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DemoRequestController extends Controller
{
    protected $demoRequestService;

    public function __construct(DemoRequestService $demoRequestService)
    {
        $this->demoRequestService = $demoRequestService;
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        $status = $request->query('status');

        $demoRequests = $this->demoRequestService->getPaginatedDemoRequests(10, $search, $status);

        return Inertia::render('SuperAdmin/DemoRequest/Index', [
            'demoRequests' => $demoRequests,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ]
        ]);
    }

    public function updateStatus(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|in:pending,contacted,scheduled,completed,rejected',
        ]);

        $this->demoRequestService->updateStatus($id, $request->status);

        return redirect()->back()->with('success', 'Status Demo Request berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $this->demoRequestService->deleteDemoRequest($id);

        return redirect()->back()->with('success', 'Data Demo Request berhasil dihapus.');
    }
}
