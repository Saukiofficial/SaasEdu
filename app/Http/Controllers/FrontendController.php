<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\SettingService;
use App\Models\SubscriptionPackage;

class FrontendController extends Controller
{
    public function welcome(SettingService $settingService)
    {
        $settings = $settingService->getAllSettingsAsKeyValue();
        
        $landingData = [
            'hero_title' => $settings['hero_title'] ?? '',
            'hero_subtitle' => $settings['hero_subtitle'] ?? '',
        ];

        for ($i = 1; $i <= 5; $i++) {
            $landingData["partner_{$i}_name"] = $settings["partner_{$i}_name"] ?? "";
            $landingData["partner_{$i}_logo"] = $settings["partner_{$i}_logo"] ?? null;
        }

        for ($i = 1; $i <= 6; $i++) {
            $landingData["feature_{$i}_title"] = $settings["feature_{$i}_title"] ?? "";
            $landingData["feature_{$i}_desc"] = $settings["feature_{$i}_desc"] ?? "";
        }
        for ($i = 1; $i <= 4; $i++) {
            $landingData["stat_{$i}_value"] = $settings["stat_{$i}_value"] ?? "";
            $landingData["stat_{$i}_label"] = $settings["stat_{$i}_label"] ?? "";
        }
        for ($i = 1; $i <= 3; $i++) {
            $landingData["testi_{$i}_text"] = $settings["testi_{$i}_text"] ?? "";
            $landingData["testi_{$i}_author"] = $settings["testi_{$i}_author"] ?? "";
            $landingData["testi_{$i}_role"] = $settings["testi_{$i}_role"] ?? "";
        }

        $packages = SubscriptionPackage::where('is_active', true)
                                     ->orderBy('price', 'asc')
                                     ->get();

        return Inertia::render('Welcome', [
            'landingData' => $landingData,
            'packages' => $packages,
            'app_name' => $settings['app_name'] ?? 'AkademiaOS'
        ]);
    }
}