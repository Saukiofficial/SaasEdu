<?php

namespace App\Http\Controllers\TenantAdmin;

use App\Http\Controllers\Controller;
use App\Services\TeacherAttendanceService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherAttendanceController extends Controller
{
    public function __construct(
        protected TeacherAttendanceService $attendanceService
    ) {}

    public function index(Request $request)
    {
        $schoolId = auth()->user()->school_id;
        
        $date = $request->query('date', date('Y-m-d')); // Default hari ini

        $attendances = $this->attendanceService->getAttendanceForm($schoolId, $date);

        return Inertia::render('TenantAdmin/TeacherAttendances/Index', [
            'attendances' => $attendances,
            'filters' => [
                'date' => $date,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'date' => 'required|date',
            'attendances' => 'required|array',
            'attendances.*.teacher_id' => 'required|uuid|exists:teachers,id',
            'attendances.*.status' => 'required|in:present,sick,leave,absent',
            'attendances.*.notes' => 'nullable|string|max:255',
        ]);

        $this->attendanceService->saveBulkAttendance($schoolId, $validated);

        return redirect()->back()->with('success', 'Data absensi guru berhasil disimpan.');
    }
}
