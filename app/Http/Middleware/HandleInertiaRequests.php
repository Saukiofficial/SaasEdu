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

        // Mencegah Bug JavaScript: Jika Database/SQLite mengembalikan nilai "0" (String), 
        // JavaScript akan menganggapnya TRUE. Kita harus memaksa konversinya menjadi Boolean asli (false).
        $userData = null;
        if ($request->user()) {
            $user = clone $request->user();
            $user->load(['school.tenantSetting', 'roles']);
            $userData = $user->toArray();

            // Pengecekan ketat (Strict Cast)
            if (isset($userData['school']['tenant_setting'])) {
                $ts = &$userData['school']['tenant_setting'];
                $ts['enable_ppdb'] = filter_var($ts['enable_ppdb'] ?? true, FILTER_VALIDATE_BOOLEAN);
                $ts['enable_lms'] = filter_var($ts['enable_lms'] ?? true, FILTER_VALIDATE_BOOLEAN);
                $ts['enable_cbt'] = filter_var($ts['enable_cbt'] ?? true, FILTER_VALIDATE_BOOLEAN);
                $ts['enable_finance'] = filter_var($ts['enable_finance'] ?? true, FILTER_VALIDATE_BOOLEAN);
                $ts['enable_student_affairs'] = filter_var($ts['enable_student_affairs'] ?? true, FILTER_VALIDATE_BOOLEAN);
                $ts['enable_facilities'] = filter_var($ts['enable_facilities'] ?? true, FILTER_VALIDATE_BOOLEAN);
            }
        }

        return [
            ...parent::share($request),
            
            // PERBARUI BAGIAN INI: Mengirimkan data yang sudah dipastikan tipe booleannya
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