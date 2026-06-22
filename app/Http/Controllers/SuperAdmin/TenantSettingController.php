<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\TenantSettingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TenantSettingController extends Controller
{
    protected $tenantSettingService;

    public function __construct(TenantSettingService $tenantSettingService)
    {
        $this->tenantSettingService = $tenantSettingService;
    }

    public function index()
    {
        $schools = $this->tenantSettingService->getSettingsPaginated(15);
        
        return Inertia::render('SuperAdmin/TenantSettings/Index', [
            'schools' => $schools
        ]);
    }

    public function update(Request $request, $schoolId)
    {
        $validated = $request->validate([
            'max_students' => 'required|integer|min:10',
            'storage_limit_mb' => 'required|integer|min:100',
            'custom_domain' => 'nullable|string|max:255',
            'enable_cbt' => 'required|boolean',
            'enable_ppdb' => 'required|boolean',
            'enable_lms' => 'required|boolean',
            'enable_finance' => 'required|boolean',
        ]);

        $this->tenantSettingService->applySettings($schoolId, $validated);

        return redirect()->back()->with('success', 'Konfigurasi fitur dan limit tenant berhasil diperbarui.');
    }
}