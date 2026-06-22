<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\TenantService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TenantController extends Controller
{
    protected $tenantService;

    public function __construct(TenantService $tenantService)
    {
        $this->tenantService = $tenantService;
    }

    public function index()
    {
        $tenants = $this->tenantService->getAllTenants(15);
        
        return Inertia::render('SuperAdmin/Tenants/Index', [
            'tenants' => $tenants
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,suspended,inactive'
        ]);

        $this->tenantService->updateTenantStatus($id, $validated['status']);

        $message = $validated['status'] === 'suspended' 
            ? 'Akses institusi (tenant) berhasil ditangguhkan.' 
            : 'Institusi berhasil diaktifkan kembali.';

        return redirect()->back()->with('success', $message);
    }
}
