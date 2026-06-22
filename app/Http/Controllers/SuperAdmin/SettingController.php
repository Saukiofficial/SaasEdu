<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\SettingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    protected $settingService;

    public function __construct(SettingService $settingService)
    {
        $this->settingService = $settingService;
    }

    public function index()
    {
        // Mengambil semua konfigurasi yang ada di database
        $settings = $this->settingService->getAllSettingsAsKeyValue();
        
        // Data default jika database masih kosong
        $defaultSettings = [
            'app_name' => $settings['app_name'] ?? 'AkademiaOS',
            'app_description' => $settings['app_description'] ?? 'Platform Manajemen Akademik Terpadu',
            'maintenance_mode' => $settings['maintenance_mode'] ?? '0',
            'contact_email' => $settings['contact_email'] ?? 'support@akademiaos.com',
            'contact_phone' => $settings['contact_phone'] ?? '+62 812 3456 7890',
            'contact_address' => $settings['contact_address'] ?? 'Jakarta, Indonesia',
            'brand_primary_color' => $settings['brand_primary_color'] ?? '#0F1729',
            'brand_secondary_color' => $settings['brand_secondary_color'] ?? '#B8935F',
        ];

        return Inertia::render('SuperAdmin/Settings/Index', [
            'settings' => $defaultSettings
        ]);
    }

    public function update(Request $request)
    {
        // Validasi bebas karena sifatnya key-value dinamis
        $validated = $request->validate([
            'app_name' => 'required|string|max:255',
            'app_description' => 'nullable|string',
            'maintenance_mode' => 'required|in:0,1',
            'contact_email' => 'required|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'contact_address' => 'nullable|string',
            'brand_primary_color' => 'required|string|max:20',
            'brand_secondary_color' => 'required|string|max:20',
        ]);

        $this->settingService->updateSettings($validated);

        return redirect()->back()->with('success', 'Pengaturan sistem berhasil diperbarui.');
    }
}