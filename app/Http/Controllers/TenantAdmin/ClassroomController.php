<?php

namespace App\Http\Controllers\TenantAdmin;

use App\Http\Controllers\Controller;
use App\Services\ClassroomService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ClassroomController extends Controller
{
    public function __construct(
        protected ClassroomService $classroomService
    ) {}

    public function index(Request $request)
    {
        $schoolId = auth()->user()->school_id;
        
        $classrooms = $this->classroomService->getClassroomsPaginated($schoolId, $request->only(['search']));

        return Inertia::render('TenantAdmin/Classrooms/Index', [
            'classrooms' => $classrooms,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'name' => [
                'required', 'string', 'max:100',
                // Mencegah nama kelas yang sama dalam satu sekolah
                Rule::unique('classrooms')->where(fn ($query) => $query->where('school_id', $schoolId)),
            ],
            'level' => 'nullable|string|max:50',
            'capacity' => 'required|integer|min:1|max:100',
        ]);

        $this->classroomService->createClassroom($schoolId, $validated);

        return redirect()->back()->with('success', 'Kelas berhasil ditambahkan.');
    }

    public function update(Request $request, string $id)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'name' => [
                'required', 'string', 'max:100',
                Rule::unique('classrooms')
                    ->where(fn ($query) => $query->where('school_id', $schoolId))
                    ->ignore($id),
            ],
            'level' => 'nullable|string|max:50',
            'capacity' => 'required|integer|min:1|max:100',
        ]);

        $this->classroomService->updateClassroom($id, $schoolId, $validated);

        return redirect()->back()->with('success', 'Kelas berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $schoolId = auth()->user()->school_id;
        
        $this->classroomService->deleteClassroom($id, $schoolId);

        return redirect()->back()->with('success', 'Kelas berhasil dihapus.');
    }
}
