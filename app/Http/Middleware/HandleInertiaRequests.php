<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Language;
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

        return [
            ...parent::share($request),
            
            // PERBARUI BAGIAN INI: Load relasi 'roles' dan 'school.tenantSetting'
            'auth' => [
                'user' => $request->user() ? $request->user()->load(['school.tenantSetting', 'roles']) : null,
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
