<?php

namespace App\Http\Controllers\TenantAdmin;

use App\Http\Controllers\Controller;
use App\Services\StudyMaterialService;
use App\Models\Classroom;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudyMaterialController extends Controller
{
    public function __construct(
        protected StudyMaterialService $materialService
    ) {}

    public function index(Request $request)
    {
        $schoolId = auth()->user()->school_id;
        
        $filters = $request->only(['search', 'classroom_id', 'subject_id', 'type']);
        $materials = $this->materialService->getMaterialsPaginated($schoolId, $filters);

        // Load data referensi untuk form dropdown
        $classrooms = Classroom::where('school_id', $schoolId)->orderBy('level')->orderBy('name')->get(['id', 'name', 'level']);
        $subjects = Subject::where('school_id', $schoolId)->where('is_active', true)->orderBy('name')->get(['id', 'name']);
        $teachers = Teacher::where('school_id', $schoolId)->where('status', 'active')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('TenantAdmin/StudyMaterials/Index', [
            'materials' => $materials,
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
            'type' => 'required|in:material,assignment',
            'classroom_id' => 'required|uuid|exists:classrooms,id',
            'subject_id' => 'required|uuid|exists:subjects,id',
            'teacher_id' => 'required|uuid|exists:teachers,id',
            'description' => 'nullable|string',
            'file_url' => 'nullable|url|max:255',
            'due_date' => 'nullable|required_if:type,assignment|date',
        ]);

        $this->materialService->createMaterial($schoolId, $validated);

        return redirect()->back()->with('success', 'Materi/Tugas berhasil didistribusikan.');
    }

    public function update(Request $request, string $id)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:material,assignment',
            'classroom_id' => 'required|uuid|exists:classrooms,id',
            'subject_id' => 'required|uuid|exists:subjects,id',
            'teacher_id' => 'required|uuid|exists:teachers,id',
            'description' => 'nullable|string',
            'file_url' => 'nullable|url|max:255',
            'due_date' => 'nullable|required_if:type,assignment|date',
        ]);

        $this->materialService->updateMaterial($id, $schoolId, $validated);

        return redirect()->back()->with('success', 'Materi/Tugas berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $schoolId = auth()->user()->school_id;
        
        $this->materialService->deleteMaterial($id, $schoolId);

        return redirect()->back()->with('success', 'Materi/Tugas berhasil dihapus.');
    }
}
