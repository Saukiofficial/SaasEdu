<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\BrandingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BrandingController extends Controller
{
    protected $brandingService;

    public function __construct(BrandingService $brandingService)
    {
        $this->brandingService = $brandingService;
    }

    public function index()
    {
        $branding = $this->brandingService->getGlobalBranding();

        return Inertia::render('SuperAdmin/Branding/Index', [
            'branding' => $branding,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'app_name' => 'required|string|max:255',
            'primary_color' => 'required|string|max:7', // Hex color (e.g., #FFFFFF)
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'favicon' => 'nullable|image|mimes:ico,png,jpg|max:1024',
            'login_bg' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
        ]);

        $this->brandingService->updateBranding($validated, $request->allFiles());

        return redirect()->back()->with('success', 'Pengaturan Branding berhasil diperbarui.');
    }
}
