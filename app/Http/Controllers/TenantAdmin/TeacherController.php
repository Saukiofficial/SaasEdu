<?php

namespace App\Http\Controllers\TenantAdmin;

use App\Http\Controllers\Controller;
use App\Services\TeacherService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function __construct(
        protected TeacherService $teacherService
    ) {}

    public function index(Request $request)
    {
        $schoolId = auth()->user()->school_id;
        
        $filters = $request->only(['search', 'status']);
        $teachers = $this->teacherService->getTeachersPaginated($schoolId, $filters);

        return Inertia::render('TenantAdmin/Teachers/Index', [
            'teachers' => $teachers,
            'filters' => $filters,
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'nip' => [
                'nullable', 'string', 'max:50',
                // Mencegah duplikasi NIP di sekolah yang sama
                Rule::unique('teachers')->where(fn ($query) => $query->where('school_id', $schoolId)),
            ],
            'name' => 'required|string|max:255',
            'gender' => 'required|in:L,P',
            'birth_place' => 'nullable|string|max:100',
            'birth_date' => 'nullable|date',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:30',
            'status' => 'required|in:active,inactive,retired',
        ]);

        $this->teacherService->createTeacher($schoolId, $validated);

        return redirect()->back()->with('success', 'Data guru berhasil ditambahkan.');
    }

    public function update(Request $request, string $id)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'nip' => [
                'nullable', 'string', 'max:50',
                Rule::unique('teachers')
                    ->where(fn ($query) => $query->where('school_id', $schoolId))
                    ->ignore($id),
            ],
            'name' => 'required|string|max:255',
            'gender' => 'required|in:L,P',
            'birth_place' => 'nullable|string|max:100',
            'birth_date' => 'nullable|date',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:30',
            'status' => 'required|in:active,inactive,retired',
        ]);

        $this->teacherService->updateTeacher($id, $schoolId, $validated);

        return redirect()->back()->with('success', 'Data guru berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $schoolId = auth()->user()->school_id;
        
        $this->teacherService->deleteTeacher($id, $schoolId);

        return redirect()->back()->with('success', 'Data guru berhasil dihapus.');
    }
}
