<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\SettingService;
use App\Models\SubscriptionPackage;
use App\Models\LandingProduct;
use App\Models\SourceCode;

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

        // AMBIL DATA PRODUK SAAS YANG AKTIF
        $products = LandingProduct::where('is_active', true)->get();

        // AMBIL DATA SOURCE CODE YANG AKTIF
        $sourceCodes = SourceCode::where('is_active', true)->latest()->take(3)->get();

        return Inertia::render('Welcome', [
            'landingData' => $landingData,
            'packages' => $packages,
            'products' => $products,
            'sourceCodes' => $sourceCodes, // Kirim ke Frontend
            'app_name' => $settings['app_name'] ?? 'AkademiaOS'
        ]);
    }

    public function productDetail(Request $request, $slug, SettingService $settingService)
    {
        $settings = $settingService->getAllSettingsAsKeyValue();
        
        // AMBIL DETAIL PRODUK BERDASARKAN SLUG
        $product = LandingProduct::where('slug', $slug)->where('is_active', true)->firstOrFail();
        
        return Inertia::render('ProductDetail', [
            'product' => $product,
            'app_name' => $settings['app_name'] ?? 'AkademiaOS'
        ]);
    }
}