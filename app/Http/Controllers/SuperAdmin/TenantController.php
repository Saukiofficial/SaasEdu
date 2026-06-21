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

        // Ambil semua data sekolah beserta jumlah akun usernya, dan data langganan terakhir
        $tenants = School::withCount('users')
            ->with('latestSubscription') // Ambil relasi langganan untuk info paket
            ->latest()
            ->paginate(15);

        return Inertia::render('SuperAdmin/Tenants/Index', [
            'tenants' => $tenants
        ]);
    }

    public function updateStatus(Request $request, string $id)
    {
        // Proteksi Super Admin
        if (auth()->user()->school_id !== null) {
            abort(403, 'Anda bukan Super Admin.');
        }

        $validated = $request->validate([
            'status' => 'required|in:active,suspended',
        ]);

        $school = School::findOrFail($id);
        $school->update(['status' => $validated['status']]);

        $statusText = $validated['status'] === 'active' ? 'diaktifkan' : 'disuspend';

        return redirect()->back()->with('message', "Status tenant {$school->name} berhasil {$statusText}.");
    }
}
