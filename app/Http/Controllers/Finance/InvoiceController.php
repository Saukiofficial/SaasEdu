<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Services\InvoiceService;
use App\Models\Classroom;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    protected InvoiceService $invoiceService;

    public function __construct(InvoiceService $invoiceService)
    {
        $this->invoiceService = $invoiceService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['status', 'classroom_id']);
        $invoices = $this->invoiceService->getInvoices($filters);
        $classrooms = Classroom::all();

        return Inertia::render('Finance/Invoices/Index', [
            'invoices' => $invoices,
            'classrooms' => $classrooms,
            'filters' => $filters
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'classroom_id' => 'required|exists:classrooms,id',
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'due_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        try {
            $this->invoiceService->generateBulkInvoices($validated);
            return redirect()->back()->with('message', 'Tagihan massal berhasil di-generate.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function destroy(string $id)
    {
        $this->invoiceService->deleteInvoice($id);
        return redirect()->back()->with('message', 'Tagihan berhasil dihapus.');
    }
}
