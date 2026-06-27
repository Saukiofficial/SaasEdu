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

        $userData = null;
        if ($request->user()) {
            $user = $request->user();
            // Gunakan loadMissing untuk efisiensi
            $user->loadMissing(['school.tenantSetting', 'roles']);
            $userData = $user->toArray();

            // PERBAIKAN MUTLAK: Mencegah Mismatch Key & Tipe Data
            if (isset($userData['school'])) {
                // Ambil data setting, entah Laravel merendernya sebagai snake_case atau camelCase
                $ts = $userData['school']['tenant_setting'] ?? $userData['school']['tenantSetting'] ?? [];

                // Paksa injeksi array tenant_setting dengan struktur yang 100% dipastikan boolean.
                // Jika data di DB adalah 0 atau "0", filter_var akan mengubahnya menjadi false (mati).
                $userData['school']['tenant_setting'] = [
                    'enable_ppdb' => filter_var($ts['enable_ppdb'] ?? true, FILTER_VALIDATE_BOOLEAN),
                    'enable_lms' => filter_var($ts['enable_lms'] ?? true, FILTER_VALIDATE_BOOLEAN),
                    'enable_cbt' => filter_var($ts['enable_cbt'] ?? true, FILTER_VALIDATE_BOOLEAN),
                    'enable_finance' => filter_var($ts['enable_finance'] ?? true, FILTER_VALIDATE_BOOLEAN),
                    'enable_student_affairs' => filter_var($ts['enable_student_affairs'] ?? true, FILTER_VALIDATE_BOOLEAN),
                    'enable_facilities' => filter_var($ts['enable_facilities'] ?? true, FILTER_VALIDATE_BOOLEAN),
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