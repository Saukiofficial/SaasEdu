<?php

namespace App\Http\Controllers\Lms;

use App\Http\Controllers\Controller;
use App\Services\StudyMaterialService;
use App\Models\Classroom;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudyMaterialController extends Controller
{
    protected StudyMaterialService $studyMaterialService;

    public function __construct(StudyMaterialService $studyMaterialService)
    {
        $this->studyMaterialService = $studyMaterialService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['classroom_id', 'type']);
        $materials = $this->studyMaterialService->getStudyMaterials($filters);

        $classrooms = Classroom::all();
        $subjects = Subject::where('is_active', true)->get();
        $teachers = Teacher::where('status', 'active')->get();

        return Inertia::render('Lms/StudyMaterials/Index', [
            'materials' => $materials,
            'classrooms' => $classrooms,
            'subjects' => $subjects,
            'teachers' => $teachers,
            'filters' => $filters
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'classroom_id' => 'required|exists:classrooms,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'title' => 'required|string|max:255',
            'type' => 'required|in:material,assignment',
            'description' => 'nullable|string',
            'file_url' => 'nullable|url|max:255',
            'due_date' => 'nullable|date',
        ]);

        $this->studyMaterialService->createStudyMaterial($validated);

        return redirect()->back()->with('message', 'Materi/Tugas berhasil ditambahkan.');
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'classroom_id' => 'required|exists:classrooms,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'title' => 'required|string|max:255',
            'type' => 'required|in:material,assignment',
            'description' => 'nullable|string',
            'file_url' => 'nullable|url|max:255',
            'due_date' => 'nullable|date',
        ]);

        $this->studyMaterialService->updateStudyMaterial($id, $validated);

        return redirect()->back()->with('message', 'Materi/Tugas berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $this->studyMaterialService->deleteStudyMaterial($id);
        return redirect()->back()->with('message', 'Materi/Tugas berhasil dihapus.');
    }
}
