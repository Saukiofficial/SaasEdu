<?php

namespace App\Http\Controllers\TenantAdmin;

use App\Http\Controllers\Controller;
use App\Services\StudentAttendanceService;
use App\Models\Classroom;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentAttendanceController extends Controller
{
    public function __construct(
        protected StudentAttendanceService $attendanceService
    ) {}

    public function index(Request $request)
    {
        $schoolId = auth()->user()->school_id;
        
        $date = $request->query('date', date('Y-m-d')); // Default hari ini
        $classroomId = $request->query('classroom_id');

        // Ambil daftar kelas untuk dropdown filter
        $classrooms = Classroom::where('school_id', $schoolId)
                               ->orderBy('level')
                               ->orderBy('name')
                               ->get(['id', 'name', 'level']);

        $attendances = [];
        if ($classroomId) {
            $attendances = $this->attendanceService->getAttendanceForm($schoolId, $classroomId, $date);
        }

        return Inertia::render('TenantAdmin/StudentAttendances/Index', [
            'classrooms' => $classrooms,
            'attendances' => $attendances,
            'filters' => [
                'date' => $date,
                'classroom_id' => $classroomId ?? '',
            ],
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'classroom_id' => 'required|uuid|exists:classrooms,id',
            'date' => 'required|date',
            'attendances' => 'required|array',
            'attendances.*.student_id' => 'required|uuid|exists:students,id',
            'attendances.*.status' => 'required|in:present,sick,leave,absent',
            'attendances.*.notes' => 'nullable|string|max:255',
        ]);

        $this->attendanceService->saveBulkAttendance($schoolId, $validated);

        return redirect()->back()->with('success', 'Data absensi berhasil disimpan.');
    }
}
