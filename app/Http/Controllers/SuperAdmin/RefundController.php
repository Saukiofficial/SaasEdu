<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\RefundService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RefundController extends Controller
{
    protected $refundService;

    public function __construct(RefundService $refundService)
    {
        $this->refundService = $refundService;
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        $status = $request->query('status');

        $refunds = $this->refundService->getPaginatedRefunds(10, $search, $status);

        return Inertia::render('SuperAdmin/Refund/Index', [
            'refunds' => $refunds,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ]
        ]);
    }

    public function updateStatus(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected,processed',
            'notes' => 'nullable|string'
        ]);

        $this->refundService->updateStatus($id, $request->status, $request->notes);

        return redirect()->back()->with('success', 'Status Refund berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $this->refundService->deleteRefund($id);

        return redirect()->back()->with('success', 'Data Refund berhasil dihapus.');
    }
}
