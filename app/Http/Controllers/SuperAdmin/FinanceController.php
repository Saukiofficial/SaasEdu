<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinanceController extends Controller
{
    public function index(Request $request)
    {
        // Proteksi: Pastikan hanya Super Admin yang bisa mengakses
        if (auth()->user()->school_id !== null) {
            abort(403, 'Akses ditolak.');
        }

        $search = $request->query('search');

        // Ambil data langganan beserta nama tenant (school)
        $subscriptions = Subscription::with('school')
            ->when($search, function ($query, $search) {
                $query->whereHas('school', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })->orWhere('plan_name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        // Hitung Statistik Dasar
        $activeCount = Subscription::where('status', 'active')->count();
        $expiredCount = Subscription::where('status', 'expired')->count();
        $trialCount = Subscription::where('plan_name', 'Free Trial')->where('status', 'active')->count();

        return Inertia::render('SuperAdmin/Finance/Index', [
            'subscriptions' => $subscriptions,
            'stats' => [
                'active' => $activeCount,
                'expired' => $expiredCount,
                'trial' => $trialCount,
            ],
            'filters' => ['search' => $search]
        ]);
    }

    public function updateStatus(Request $request, string $id)
    {
        if (auth()->user()->school_id !== null) abort(403);

        $validated = $request->validate([
            'status' => 'required|in:active,expired,cancelled',
        ]);

        $subscription = Subscription::findOrFail($id);
        $subscription->update(['status' => $validated['status']]);

        return redirect()->back()->with('message', 'Status langganan tenant berhasil diperbarui.');
    }
}
