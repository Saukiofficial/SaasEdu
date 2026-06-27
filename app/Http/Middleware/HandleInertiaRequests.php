<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Language;
use App\Models\TenantSetting; // Pastikan ini ditambahkan
use Illuminate\Support\Facades\Schema;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $activeLanguages = [];
        try {
            if (Schema::hasTable('languages')) {
                $activeLanguages = Language::where('is_active', true)
                    ->orderBy('name', 'asc')
                    ->get(['code', 'name']);
            }
        } catch (\Exception $e) {
            // Abaikan jika tabel belum ada
        }

        $userData = null;
        if ($request->user()) {
            $user = clone $request->user();
            $user->loadMissing(['school', 'roles']);
            $userData = $user->toArray();

            // PERBAIKAN FINAL: Ambil langsung dari Database agar 100% akurat
            if ($user->school_id) {
                $setting = TenantSetting::where('school_id', $user->school_id)->first();
                
                $userData['school']['tenant_setting'] = [
                    'enable_ppdb' => $setting ? (bool) $setting->enable_ppdb : true,
                    'enable_lms' => $setting ? (bool) $setting->enable_lms : true,
                    'enable_cbt' => $setting ? (bool) $setting->enable_cbt : true,
                    'enable_finance' => $setting ? (bool) $setting->enable_finance : true,
                    'enable_student_affairs' => $setting ? (bool) $setting->enable_student_affairs : true,
                    'enable_facilities' => $setting ? (bool) $setting->enable_facilities : true,
                ];
            }
        }

        return [
            ...parent::share($request),
            
            // Mengirimkan data yang sudah distandarisasi ke React
            'auth' => [
                'user' => $userData,
            ],
            
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'locale' => session('locale', app()->getLocale()),
            'available_languages' => $activeLanguages,
        ];
    }
}