<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\SettingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingPageController extends Controller
{
    protected $settingService;

    public function __construct(SettingService $settingService)
    {
        $this->settingService = $settingService;
    }

    public function index()
    {
        $settings = $this->settingService->getAllSettingsAsKeyValue();
        
        $landingSettings = [
            'hero_title' => $settings['hero_title'] ?? '',
            'hero_subtitle' => $settings['hero_subtitle'] ?? '',
        ];

        // Looping untuk Partners
        for ($i = 1; $i <= 5; $i++) {
            $landingSettings["partner_{$i}_name"] = $settings["partner_{$i}_name"] ?? "";
            $landingSettings["partner_{$i}_logo"] = $settings["partner_{$i}_logo"] ?? null;
        }

        // Looping untuk 6 Fitur, 4 Statistik, dan 3 Testimoni
        for ($i = 1; $i <= 6; $i++) {
            $landingSettings["feature_{$i}_title"] = $settings["feature_{$i}_title"] ?? "";
            $landingSettings["feature_{$i}_desc"] = $settings["feature_{$i}_desc"] ?? "";
        }
        for ($i = 1; $i <= 4; $i++) {
            $landingSettings["stat_{$i}_value"] = $settings["stat_{$i}_value"] ?? "";
            $landingSettings["stat_{$i}_label"] = $settings["stat_{$i}_label"] ?? "";
        }
        for ($i = 1; $i <= 3; $i++) {
            $landingSettings["testi_{$i}_text"] = $settings["testi_{$i}_text"] ?? "";
            $landingSettings["testi_{$i}_author"] = $settings["testi_{$i}_author"] ?? "";
            $landingSettings["testi_{$i}_role"] = $settings["testi_{$i}_role"] ?? "";
        }

        return Inertia::render('SuperAdmin/LandingPage/Index', [
            'landingSettings' => $landingSettings
        ]);
    }

    public function update(Request $request)
    {
        $rules = [
            'hero_title' => 'required|string|max:255',
            'hero_subtitle' => 'nullable|string',
        ];

        for ($i = 1; $i <= 5; $i++) {
            $rules["partner_{$i}_name"] = 'nullable|string|max:255';
            $rules["partner_{$i}_logo"] = 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048'; // Validasi File
        }

        for ($i = 1; $i <= 6; $i++) {
            $rules["feature_{$i}_title"] = 'nullable|string|max:255';
            $rules["feature_{$i}_desc"] = 'nullable|string';
        }
        for ($i = 1; $i <= 4; $i++) {
            $rules["stat_{$i}_value"] = 'nullable|string|max:50';
            $rules["stat_{$i}_label"] = 'nullable|string|max:50';
        }
        for ($i = 1; $i <= 3; $i++) {
            $rules["testi_{$i}_text"] = 'nullable|string';
            $rules["testi_{$i}_author"] = 'nullable|string|max:100';
            $rules["testi_{$i}_role"] = 'nullable|string|max:100';
        }

        $validated = $request->validate($rules);

        // Menangani Upload File Logo Partner
        for ($i = 1; $i <= 5; $i++) {
            if ($request->hasFile("partner_{$i}_logo")) {
                // Simpan ke storage/app/public/partners
                $path = $request->file("partner_{$i}_logo")->store('partners', 'public');
                $validated["partner_{$i}_logo"] = '/storage/' . $path;
            } else {
                // Jangan override jika tidak ada file baru diunggah
                unset($validated["partner_{$i}_logo"]);
            }
        }

        $this->settingService->updateSettings($validated);

        return redirect()->back()->with('success', 'Konten Landing Page berhasil diperbarui.');
    }
}
