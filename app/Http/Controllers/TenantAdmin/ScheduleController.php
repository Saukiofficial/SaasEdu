<?php

namespace App\Http\Controllers\TenantAdmin;

use App\Http\Controllers\Controller;
use App\Services\ScheduleService;
use App\Models\AcademicYear;
use App\Models\Classroom;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function __construct(
        protected ScheduleService $scheduleService
    ) {}

    public function index(Request $request)
    {
        $schoolId = auth()->user()->school_id;
        
        $filters = $request->only(['classroom_id', 'day']);
        $schedules = $this->scheduleService->getSchedulesPaginated($schoolId, $filters);

        // Load data referensi untuk form dropdown
        $academicYears = AcademicYear::where('school_id', $schoolId)->where('is_active', true)->get(['id', 'name']);
        $classrooms = Classroom::where('school_id', $schoolId)->orderBy('level')->orderBy('name')->get(['id', 'name', 'level']);
        $subjects = Subject::where('school_id', $schoolId)->where('is_active', true)->orderBy('name')->get(['id', 'name', 'code']);
        $teachers = Teacher::where('school_id', $schoolId)->where('status', 'active')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('TenantAdmin/Schedules/Index', [
            'schedules' => $schedules,
            'academicYears' => $academicYears,
            'classrooms' => $classrooms,
            'subjects' => $subjects,
            'teachers' => $teachers,
            'filters' => $filters,
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'academic_year_id' => 'required|uuid|exists:academic_years,id',
            'classroom_id' => 'required|uuid|exists:classrooms,id',
            'subject_id' => 'required|uuid|exists:subjects,id',
            'teacher_id' => 'required|uuid|exists:teachers,id',
            'day' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $this->scheduleService->createSchedule($schoolId, $validated);

        return redirect()->back()->with('success', 'Jadwal pelajaran berhasil ditambahkan.');
    }

    public function update(Request $request, string $id)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'academic_year_id' => 'required|uuid|exists:academic_years,id',
            'classroom_id' => 'required|uuid|exists:classrooms,id',
            'subject_id' => 'required|uuid|exists:subjects,id',
            'teacher_id' => 'required|uuid|exists:teachers,id',
            'day' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $this->scheduleService->updateSchedule($id, $schoolId, $validated);

        return redirect()->back()->with('success', 'Jadwal pelajaran berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $schoolId = auth()->user()->school_id;
        
        $this->scheduleService->deleteSchedule($id, $schoolId);

        return redirect()->back()->with('success', 'Jadwal pelajaran berhasil dihapus.');
    }
}