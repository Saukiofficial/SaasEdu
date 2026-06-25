<?php

namespace App\Http\Controllers\TenantAdmin;

use App\Http\Controllers\Controller;
use App\Services\ExamService;
use App\Models\Classroom;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamController extends Controller
{
    public function __construct(
        protected ExamService $examService
    ) {}

    public function index(Request $request)
    {
        $schoolId = auth()->user()->school_id;
        
        $filters = $request->only(['search', 'classroom_id', 'subject_id']);
        $exams = $this->examService->getExamsPaginated($schoolId, $filters);

        // Load data referensi untuk form dropdown
        $classrooms = Classroom::where('school_id', $schoolId)->orderBy('level')->orderBy('name')->get(['id', 'name', 'level']);
        $subjects = Subject::where('school_id', $schoolId)->where('is_active', true)->orderBy('name')->get(['id', 'name']);
        $teachers = Teacher::where('school_id', $schoolId)->where('status', 'active')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('TenantAdmin/Exams/Index', [
            'exams' => $exams,
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
            'title' => 'required|string|max:255',
            'classroom_id' => 'required|uuid|exists:classrooms,id',
            'subject_id' => 'required|uuid|exists:subjects,id',
            'teacher_id' => 'required|uuid|exists:teachers,id',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'duration' => 'required|integer|min:1',
            'is_active' => 'boolean',
        ]);

        $this->examService->createExam($schoolId, $validated);

        return redirect()->back()->with('success', 'Ujian berhasil dibuat.');
    }

    public function update(Request $request, string $id)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'classroom_id' => 'required|uuid|exists:classrooms,id',
            'subject_id' => 'required|uuid|exists:subjects,id',
            'teacher_id' => 'required|uuid|exists:teachers,id',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'duration' => 'required|integer|min:1',
            'is_active' => 'boolean',
        ]);

        $this->examService->updateExam($id, $schoolId, $validated);

        return redirect()->back()->with('success', 'Ujian berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $schoolId = auth()->user()->school_id;
        
        $this->examService->deleteExam($id, $schoolId);

        return redirect()->back()->with('success', 'Ujian berhasil dihapus.');
    }
}
