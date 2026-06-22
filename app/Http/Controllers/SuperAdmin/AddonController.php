<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\AddonService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AddonController extends Controller
{
    protected $addonService;

    public function __construct(AddonService $addonService)
    {
        $this->addonService = $addonService;
    }

    public function index()
    {
        $addons = $this->addonService->getAllAddons();
        
        return Inertia::render('SuperAdmin/Addons/Index', [
            'addons' => $addons
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'billing_cycle' => 'required|in:monthly,yearly,one-time',
            'type' => 'required|in:storage,student,feature,service',
            'value' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
        ]);

        $this->addonService->createAddon($validated);

        return redirect()->back()->with('success', 'Fitur tambahan (Addon) berhasil dibuat.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'billing_cycle' => 'required|in:monthly,yearly,one-time',
            'type' => 'required|in:storage,student,feature,service',
            'value' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
        ]);

        $this->addonService->updateAddon($id, $validated);

        return redirect()->back()->with('success', 'Fitur tambahan (Addon) berhasil diperbarui.');
    }

    public function destroy($id)
    {
        try {
            $this->addonService->deleteAddon($id);
            return redirect()->back()->with('success', 'Addon berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
