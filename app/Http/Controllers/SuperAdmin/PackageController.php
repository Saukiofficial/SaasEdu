<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\PackageService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PackageController extends Controller
{
    protected $packageService;

    public function __construct(PackageService $packageService)
    {
        $this->packageService = $packageService;
    }

    public function index()
    {
        $packages = $this->packageService->getAllPackages();
        
        return Inertia::render('SuperAdmin/Packages/Index', [
            'packages' => $packages
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'billing_cycle' => 'required|in:monthly,yearly,one-time',
            'max_students' => 'required|integer|min:0',
            'storage_limit_mb' => 'required|integer|min:0',
            'features' => 'nullable|array', // Sekarang diterima langsung sebagai Array dari React
            'features.*' => 'string',
            'is_active' => 'boolean',
            'is_popular' => 'boolean',
        ]);

        if (!isset($validated['features'])) {
            $validated['features'] = [];
        }

        $this->packageService->createPackage($validated);

        return redirect()->back()->with('success', 'Paket Langganan berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'billing_cycle' => 'required|in:monthly,yearly,one-time',
            'max_students' => 'required|integer|min:0',
            'storage_limit_mb' => 'required|integer|min:0',
            'features' => 'nullable|array',
            'features.*' => 'string',
            'is_active' => 'boolean',
            'is_popular' => 'boolean',
        ]);

        if (!isset($validated['features'])) {
            $validated['features'] = [];
        }

        $this->packageService->updatePackage($id, $validated);

        return redirect()->back()->with('success', 'Data Paket Langganan berhasil diperbarui.');
    }

    public function destroy($id)
    {
        try {
            $this->packageService->deletePackage($id);
            return redirect()->back()->with('success', 'Paket Langganan berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}