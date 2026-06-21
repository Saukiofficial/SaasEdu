<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\User;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        // Proteksi: Pastikan hanya Super Admin yang bisa mengakses
        if (auth()->user()->school_id !== null) {
            abort(403, 'Akses ditolak.');
        }

        // 1. Statistik Dasar Global
        $totalSchools = School::count();
        $activeSchools = School::where('status', 'active')->count();
        $totalUsers = User::count();

        // 2. Data Distribusi Paket Langganan (Pie Chart Data)
        $packageDistribution = Subscription::select('plan_name', DB::raw('count(*) as total'))
            ->where('status', 'active')
            ->groupBy('plan_name')
            ->get();

        // 3. Simulasi Data Pertumbuhan Bulanan (Bar Chart Data)
        // Dalam implementasi nyata, ini diambil dari data created_at yang di-group per bulan
        $monthlyGrowth = [
            ['month' => 'Jan', 'clients' => 25, 'revenue' => 15000000],
            ['month' => 'Feb', 'clients' => 42, 'revenue' => 28000000],
            ['month' => 'Mar', 'clients' => 58, 'revenue' => 35000000],
            ['month' => 'Apr', 'clients' => 76, 'revenue' => 42000000],
            ['month' => 'Mei', 'clients' => 95, 'revenue' => 58000000],
            ['month' => 'Jun', 'clients' => 128, 'revenue' => 84000000],
        ];

        return Inertia::render('SuperAdmin/Reports/Index', [
            'stats' => [
                'total_schools' => $totalSchools,
                'active_schools' => $activeSchools,
                'total_users' => $totalUsers,
            ],
            'packageDistribution' => $packageDistribution,
            'monthlyGrowth' => $monthlyGrowth,
        ]);
    }
}
