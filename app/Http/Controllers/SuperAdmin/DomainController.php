<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\DomainService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DomainController extends Controller
{
    protected $domainService;

    public function __construct(DomainService $domainService)
    {
        $this->domainService = $domainService;
    }

    public function index()
    {
        $schools = $this->domainService->getAllDomains(15);
        
        return Inertia::render('SuperAdmin/Domains/Index', [
            'schools' => $schools
        ]);
    }

    public function update(Request $request, $schoolId)
    {
        $validated = $request->validate([
            'custom_domain' => 'nullable|string|max:255',
        ]);

        $this->domainService->updateDomain($schoolId, $validated['custom_domain']);

        return redirect()->back()->with('success', 'Konfigurasi Custom Domain berhasil diperbarui.');
    }
}
