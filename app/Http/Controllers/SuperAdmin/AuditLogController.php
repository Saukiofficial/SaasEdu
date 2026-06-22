<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    protected $auditLogService;

    public function __construct(AuditLogService $auditLogService)
    {
        $this->auditLogService = $auditLogService;
    }

    public function index(Request $request)
    {
        $filters = [
            'search' => $request->input('search'),
            'action' => $request->input('action'),
            'module' => $request->input('module'),
        ];

        $logs = $this->auditLogService->getLogs(20, $filters);
        
        return Inertia::render('SuperAdmin/Security/AuditLogs/Index', [
            'logs' => $logs,
            'filters' => $filters
        ]);
    }
}
