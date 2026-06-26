<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\SourceCodeOrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SourceCodeOrderController extends Controller
{
    protected $orderService;

    public function __construct(SourceCodeOrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        $status = $request->query('status');

        $orders = $this->orderService->getPaginatedOrders(15, $search, $status);

        return Inertia::render('SuperAdmin/SourceCodeOrder/Index', [
            'orders' => $orders,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ]
        ]);
    }

    public function updateStatus(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|in:pending,paid,failed,cancelled',
        ]);

        $this->orderService->updateOrderStatus($id, $request->status);

        return redirect()->back()->with('success', 'Status Transaksi berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $this->orderService->deleteOrder($id);

        return redirect()->back()->with('success', 'Data Transaksi berhasil dihapus.');
    }
}
