<?php

namespace App\Http\Controllers\Academic;

use App\Http\Controllers\Controller;
use App\Services\AttendanceService;
use App\Models\Classroom;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    protected AttendanceService $attendanceService;

    public function __construct(AttendanceService $attendanceService)
    {
        $this->attendanceService = $attendanceService;
    }

    public function index(Request $request)
    {
        $classroomId = $request->query('classroom_id');
        $date = $request->query('date', Carbon::today()->toDateString());

        $classrooms = Classroom::all();
        $data = $this->attendanceService->getAttendanceDataForm($classroomId, $date);

        return Inertia::render('Academic/Attendances/Index', [
            'classrooms' => $classrooms,
            'students' => $data['students'],
            'existing_attendances' => $data['existing_attendances'],
            'filters' => [
                'classroom_id' => $classroomId,
                'date' => $date,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'classroom_id' => 'required|exists:classrooms,id',
            'attendances' => 'required|array',
            'attendances.*.student_id' => 'required|exists:students,id',
            'attendances.*.status' => 'required|in:hadir,izin,sakit,alpa',
            'attendances.*.note' => 'nullable|string|max:255',
        ]);

        $this->attendanceService->saveBulkAttendance($validated);

        return redirect()->back()->with('message', 'Data absensi berhasil disimpan.');
    }
}
