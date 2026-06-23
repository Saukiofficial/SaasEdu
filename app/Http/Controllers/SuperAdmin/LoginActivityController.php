<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\LoginActivityService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoginActivityController extends Controller
{
    protected $loginActivityService;

    public function __construct(LoginActivityService $loginActivityService)
    {
        $this->loginActivityService = $loginActivityService;
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        $status = $request->query('status');

        $activities = $this->loginActivityService->getPaginatedActivities(15, $search, $status);

        return Inertia::render('SuperAdmin/LoginActivity/Index', [
            'activities' => $activities,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ]
        ]);
    }

    public function destroy(Request $request)
    {
        // Opsional: Fitur untuk membersihkan riwayat login yang lebih dari 30 hari
        $this->loginActivityService->clearOldLogs(30);

        return redirect()->back()->with('success', 'Riwayat aktivitas login yang lebih dari 30 hari telah dibersihkan.');
    }
}
