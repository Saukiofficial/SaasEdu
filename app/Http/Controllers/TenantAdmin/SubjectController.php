<?php

namespace App\Http\Controllers\TenantAdmin;

use App\Http\Controllers\Controller;
use App\Services\SubjectService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SubjectController extends Controller
{
    public function __construct(
        protected SubjectService $subjectService
    ) {}

    public function index(Request $request)
    {
        $schoolId = auth()->user()->school_id;
        
        $subjects = $this->subjectService->getSubjectsPaginated($schoolId, $request->only(['search']));

        return Inertia::render('TenantAdmin/Subjects/Index', [
            'subjects' => $subjects,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'code' => [
                'nullable', 'string', 'max:50',
                Rule::unique('subjects')->where(fn ($query) => $query->where('school_id', $schoolId)),
            ],
            'name' => 'required|string|max:100',
            'type' => 'required|string|in:Wajib,Peminatan,Muatan Lokal',
            'is_active' => 'boolean',
        ]);

        $this->subjectService->createSubject($schoolId, $validated);

        return redirect()->back()->with('success', 'Mata pelajaran berhasil ditambahkan.');
    }

    public function update(Request $request, string $id)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'code' => [
                'nullable', 'string', 'max:50',
                Rule::unique('subjects')
                    ->where(fn ($query) => $query->where('school_id', $schoolId))
                    ->ignore($id),
            ],
            'name' => 'required|string|max:100',
            'type' => 'required|string|in:Wajib,Peminatan,Muatan Lokal',
            'is_active' => 'boolean',
        ]);

        $this->subjectService->updateSubject($id, $schoolId, $validated);

        return redirect()->back()->with('success', 'Mata pelajaran berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $schoolId = auth()->user()->school_id;
        
        $this->subjectService->deleteSubject($id, $schoolId);

        return redirect()->back()->with('success', 'Mata pelajaran berhasil dihapus.');
    }
}
