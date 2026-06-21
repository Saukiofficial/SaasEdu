<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\SubscriptionPackageService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PackageController extends Controller
{
    protected SubscriptionPackageService $packageService;

    public function __construct(SubscriptionPackageService $packageService)
    {
        $this->packageService = $packageService;
    }

    public function index()
    {
        if (auth()->user()->school_id !== null) abort(403, 'Akses ditolak.');

        $packages = $this->packageService->getPaginatedPackages();

        return Inertia::render('SuperAdmin/Packages/Index', [
            'packages' => $packages
        ]);
    }

    public function store(Request $request)
    {
        if (auth()->user()->school_id !== null) abort(403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'max_students' => 'nullable|integer|min:1',
            'max_users' => 'nullable|integer|min:1',
            'features' => 'nullable|string', // Dikirim sebagai string dipisah koma
            'is_active' => 'boolean',
        ]);

        $this->packageService->createPackage($validated);

        return redirect()->back()->with('message', 'Paket berlangganan berhasil dibuat.');
    }

    public function update(Request $request, string $id)
    {
        if (auth()->user()->school_id !== null) abort(403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'max_students' => 'nullable|integer|min:1',
            'max_users' => 'nullable|integer|min:1',
            'features' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $this->packageService->updatePackage($id, $validated);

        return redirect()->back()->with('message', 'Paket berlangganan berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        if (auth()->user()->school_id !== null) abort(403);

        $this->packageService->deletePackage($id);
        return redirect()->back()->with('message', 'Paket berlangganan berhasil dihapus.');
    }
}
