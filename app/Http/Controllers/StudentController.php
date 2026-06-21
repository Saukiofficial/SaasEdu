<?php

namespace App\Http\Controllers;

use App\Services\StudentService;
use App\Models\Classroom;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    protected StudentService $studentService;

    public function __construct(StudentService $studentService)
    {
        $this->studentService = $studentService;
    }

    public function index()
    {
        $students = $this->studentService->getPaginatedStudents();
        // Ambil data kelas untuk dropdown di form (Otomatis terfilter per sekolah berkat BelongsToTenant)
        $classrooms = Classroom::all(); 

        return Inertia::render('Students/Index', [
            'students' => $students,
            'classrooms' => $classrooms
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nis' => 'nullable|string|max:50',
            'nisn' => 'nullable|string|max:50',
            'name' => 'required|string|max:255',
            'gender' => 'required|in:L,P',
            'classroom_id' => 'nullable|exists:classrooms,id',
            'parent_name' => 'nullable|string|max:255',
            'parent_phone' => 'nullable|string|max:50',
            'status' => 'required|in:active,graduated,dropped_out',
        ]);

        $this->studentService->createStudent($validated);

        return redirect()->back()->with('message', 'Data siswa berhasil ditambahkan.');
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'nis' => 'nullable|string|max:50',
            'nisn' => 'nullable|string|max:50',
            'name' => 'required|string|max:255',
            'gender' => 'required|in:L,P',
            'classroom_id' => 'nullable|exists:classrooms,id',
            'parent_name' => 'nullable|string|max:255',
            'parent_phone' => 'nullable|string|max:50',
            'status' => 'required|in:active,graduated,dropped_out',
        ]);

        $this->studentService->updateStudent($id, $validated);

        return redirect()->back()->with('message', 'Data siswa berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $this->studentService->deleteStudent($id);

        return redirect()->back()->with('message', 'Data siswa berhasil dihapus.');
    }
}
