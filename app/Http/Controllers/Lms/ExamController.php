<?php

namespace App\Http\Controllers\Lms;

use App\Http\Controllers\Controller;
use App\Services\ExamService;
use App\Models\Classroom;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamController extends Controller
{
    protected ExamService $examService;

    public function __construct(ExamService $examService)
    {
        $this->examService = $examService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['classroom_id']);
        $exams = $this->examService->getExams($filters);

        $classrooms = Classroom::all();
        $subjects = Subject::where('is_active', true)->get();

        return Inertia::render('Lms/Exams/Index', [
            'exams' => $exams,
            'classrooms' => $classrooms,
            'subjects' => $subjects,
            'filters' => $filters
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'classroom_id' => 'required|exists:classrooms,id',
            'subject_id' => 'required|exists:subjects,id',
            'title' => 'required|string|max:255',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'duration_minutes' => 'required|integer|min:1',
            'description' => 'nullable|string',
        ]);

        $this->examService->createExam($validated);

        return redirect()->back()->with('message', 'Ujian online berhasil dijadwalkan.');
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'classroom_id' => 'required|exists:classrooms,id',
            'subject_id' => 'required|exists:subjects,id',
            'title' => 'required|string|max:255',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'duration_minutes' => 'required|integer|min:1',
            'description' => 'nullable|string',
        ]);

        $this->examService->updateExam($id, $validated);

        return redirect()->back()->with('message', 'Jadwal ujian berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $this->examService->deleteExam($id);
        return redirect()->back()->with('message', 'Jadwal ujian berhasil dihapus.');
    }
}
