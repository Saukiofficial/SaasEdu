<?php

namespace App\Http\Controllers;

use App\Services\TeacherService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherController extends Controller
{
    protected TeacherService $teacherService;

    public function __construct(TeacherService $teacherService)
    {
        $this->teacherService = $teacherService;
    }

    public function index()
    {
        $teachers = $this->teacherService->getPaginatedTeachers();

        return Inertia::render('Teachers/Index', [
            'teachers' => $teachers
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nip' => 'nullable|string|max:50',
            'name' => 'required|string|max:255',
            'gender' => 'required|in:L,P',
            'birth_place' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'status' => 'required|in:active,inactive,retired',
        ]);

        $this->teacherService->createTeacher($validated);

        return redirect()->back()->with('message', 'Data guru berhasil ditambahkan.');
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'nip' => 'nullable|string|max:50',
            'name' => 'required|string|max:255',
            'gender' => 'required|in:L,P',
            'birth_place' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'status' => 'required|in:active,inactive,retired',
        ]);

        $this->teacherService->updateTeacher($id, $validated);

        return redirect()->back()->with('message', 'Data guru berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $this->teacherService->deleteTeacher($id);

        return redirect()->back()->with('message', 'Data guru berhasil dihapus.');
    }
}
