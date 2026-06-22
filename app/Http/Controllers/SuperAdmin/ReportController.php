<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\User;
use App\Models\Ticket;
use App\Models\Lead;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        // Mengagregasi (rekap) data statistik utama untuk bisnis SaaS
        $stats = [
            'total_schools' => School::count(),
            'active_schools' => School::where('status', 'active')->count(),
            'suspended_schools' => School::where('status', 'suspended')->count(),
            
            'total_users' => User::count(),
            'tenant_users' => User::whereNotNull('school_id')->count(),
            'saas_staff' => User::whereNull('school_id')->count(),
            
            'total_leads' => Lead::count(),
            'converted_leads' => Lead::where('status', 'converted')->count(),
            
            'open_tickets' => Ticket::whereIn('status', ['open', 'in_progress'])->count(),
            'resolved_tickets' => Ticket::whereIn('status', ['resolved', 'closed'])->count(),
        ];

        return Inertia::render('SuperAdmin/Reports/Index', [
            'stats' => $stats
        ]);
    }
}
