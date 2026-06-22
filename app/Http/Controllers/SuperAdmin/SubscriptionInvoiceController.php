<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Services\SubscriptionInvoiceService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionInvoiceController extends Controller
{
    protected $invoiceService;

    public function __construct(SubscriptionInvoiceService $invoiceService)
    {
        $this->invoiceService = $invoiceService;
    }

    public function index()
    {
        $invoices = $this->invoiceService->getAllInvoices(15);
        $schools = School::orderBy('name', 'asc')->get(['id', 'name']); // Untuk dropdown form buat tagihan
        
        return Inertia::render('SuperAdmin/SubscriptionInvoices/Index', [
            'invoices' => $invoices,
            'schools' => $schools
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'school_id' => 'required|exists:schools,id',
            'amount' => 'required|numeric|min:0',
            'description' => 'required|string|max:255',
            'due_date' => 'required|date',
        ]);

        $this->invoiceService->createInvoice($validated);

        return redirect()->back()->with('success', 'Tagihan SaaS berhasil dibuat dan dikirim ke tenant.');
    }

    public function markAsPaid(Request $request, $id)
    {
        $validated = $request->validate([
            'payment_method' => 'required|string|max:100',
        ]);

        $this->invoiceService->processPaymentManual($id, $validated['payment_method']);

        return redirect()->back()->with('success', 'Tagihan SaaS berhasil ditandai sebagai Lunas.');
    }

    public function cancel($id)
    {
        $this->invoiceService->cancelInvoice($id);
        
        return redirect()->back()->with('success', 'Tagihan SaaS berhasil dibatalkan.');
    }

    public function destroy($id)
    {
        try {
            $this->invoiceService->deleteInvoice($id);
            return redirect()->back()->with('success', 'Data tagihan berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
