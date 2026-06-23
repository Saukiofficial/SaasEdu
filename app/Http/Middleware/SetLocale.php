<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use App\Models\Language;
use Illuminate\Support\Facades\Schema;

class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        if (Session::has('locale')) {
            // Jika user sudah pernah memilih bahasa, gunakan bahasa dari session
            App::setLocale(Session::get('locale'));
        } else {
            // Jika belum ada di session, cari bahasa default dari database
            try {
                if (Schema::hasTable('languages')) {
                    $defaultLang = Language::where('is_default', true)->where('is_active', true)->first();
                    if ($defaultLang) {
                        App::setLocale($defaultLang->code);
                        Session::put('locale', $defaultLang->code);
                    }
                }
            } catch (\Exception $e) {
                // Abaikan jika database/tabel belum siap
            }
        }

        return $next($request);
    }
}
