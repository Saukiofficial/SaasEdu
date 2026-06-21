<?php

namespace App\Http\Controllers\Academic;

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
    protected ScheduleService $scheduleService;

    public function __construct(ScheduleService $scheduleService)
    {
        $this->scheduleService = $scheduleService;
    }

    public function index()
    {
        // Ambil data referensi untuk form dropdown
        $academicYears = AcademicYear::where('is_active', true)->get();
        $classrooms = Classroom::all();
        $subjects = Subject::where('is_active', true)->get();
        $teachers = Teacher::where('status', 'active')->get();
        
        $schedules = $this->scheduleService->getPaginatedSchedules();

        return Inertia::render('Academic/Schedules/Index', [
            'schedules' => $schedules,
            'academicYears' => $academicYears,
            'classrooms' => $classrooms,
            'subjects' => $subjects,
            'teachers' => $teachers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'classroom_id' => 'required|exists:classrooms,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'day' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $this->scheduleService->createSchedule($validated);

        return redirect()->back()->with('message', 'Jadwal berhasil ditambahkan.');
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'classroom_id' => 'required|exists:classrooms,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'day' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $this->scheduleService->updateSchedule($id, $validated);

        return redirect()->back()->with('message', 'Jadwal berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $this->scheduleService->deleteSchedule($id);

        return redirect()->back()->with('message', 'Jadwal berhasil dihapus.');
    }
}
