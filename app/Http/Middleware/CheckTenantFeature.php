<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\TenantSetting;

class CheckTenantFeature
{
    public function handle(Request $request, Closure $next, string $feature): Response
    {
        $user = auth()->user();

        // Pastikan user sudah login dan dia adalah bagian dari Tenant (memiliki school_id)
        if ($user && $user->school_id) {
            $settings = TenantSetting::where('school_id', $user->school_id)->first();
            
            if ($settings) {
                // Mengecek kolom di database, contoh: 'enable_cbt', 'enable_lms'
                $featureColumn = 'enable_' . $feature;
                
                // Jika fiturnya bernilai false (dimatikan oleh Super Admin)
                if (isset($settings->$featureColumn) && !$settings->$featureColumn) {
                    // Blokir akses dan kembalikan error 403 (Forbidden)
                    abort(403, "Akses ditolak: Fitur $feature telah dinonaktifkan oleh Super Admin untuk institusi Anda.");
                }
            }
        }

        return $next($request);
    }
}
