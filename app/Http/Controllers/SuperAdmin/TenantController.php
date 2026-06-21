<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TenantController extends Controller
{
    public function index()
    {
        // Proteksi: Pastikan hanya Super Admin (school_id null) yang bisa akses
        if (auth()->user()->school_id !== null) {
            abort(403, 'Anda bukan Super Admin.');
        }

        // Ambil semua data sekolah beserta jumlah akun usernya
        $tenants = School::withCount('users')->latest()->paginate(10);

        return Inertia::render('SuperAdmin/Tenants/Index', [
            'tenants' => $tenants
        ]);
    }
}