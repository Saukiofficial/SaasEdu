<?php

namespace App\Http\Controllers\TenantAdmin;

use App\Http\Controllers\Controller;
use App\Services\StudentService;
use App\Models\Classroom;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function __construct(
        protected StudentService $studentService
    ) {}

    public function index(Request $request)
    {
        $schoolId = auth()->user()->school_id;
        
        $filters = $request->only(['search', 'classroom_id']);
        $students = $this->studentService->getStudentsPaginated($schoolId, $filters);
        
        // Load data ruang kelas untuk dropdown filter & form create/edit
        $classrooms = Classroom::where('school_id', $schoolId)
                               ->orderBy('level')
                               ->orderBy('name')
                               ->get(['id', 'name', 'level']);

        return Inertia::render('TenantAdmin/Students/Index', [
            'students' => $students,
            'classrooms' => $classrooms,
            'filters' => $filters,
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'classroom_id' => 'nullable|uuid|exists:classrooms,id',
            'nis' => 'nullable|string|max:50',
            'nisn' => 'nullable|string|max:50',
            'name' => 'required|string|max:255',
            'gender' => 'required|in:L,P',
            'birth_place' => 'nullable|string|max:100',
            'birth_date' => 'nullable|date',
            'address' => 'nullable|string',
            'parent_name' => 'nullable|string|max:255',
            'parent_phone' => 'nullable|string|max:30',
            'status' => 'required|in:active,graduated,dropped_out',
        ]);

        $this->studentService->createStudent($schoolId, $validated);

        return redirect()->back()->with('success', 'Data siswa berhasil ditambahkan.');
    }

    public function update(Request $request, string $id)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'classroom_id' => 'nullable|uuid|exists:classrooms,id',
            'nis' => 'nullable|string|max:50',
            'nisn' => 'nullable|string|max:50',
            'name' => 'required|string|max:255',
            'gender' => 'required|in:L,P',
            'birth_place' => 'nullable|string|max:100',
            'birth_date' => 'nullable|date',
            'address' => 'nullable|string',
            'parent_name' => 'nullable|string|max:255',
            'parent_phone' => 'nullable|string|max:30',
            'status' => 'required|in:active,graduated,dropped_out',
        ]);

        $this->studentService->updateStudent($id, $schoolId, $validated);

        return redirect()->back()->with('success', 'Data siswa berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $schoolId = auth()->user()->school_id;
        
        $this->studentService->deleteStudent($id, $schoolId);

        return redirect()->back()->with('success', 'Data siswa berhasil dihapus.');
    }
}
