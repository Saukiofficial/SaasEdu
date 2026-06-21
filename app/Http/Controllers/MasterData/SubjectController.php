<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Services\SubjectService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubjectController extends Controller
{
    protected SubjectService $subjectService;

    public function __construct(SubjectService $subjectService)
    {
        $this->subjectService = $subjectService;
    }

    public function index()
    {
        $subjects = $this->subjectService->getAll();
        return Inertia::render('MasterData/Subjects/Index', [
            'subjects' => $subjects
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'nullable|string|max:50',
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:Wajib,Peminatan,Muatan Lokal',
            'is_active' => 'boolean',
        ]);

        $this->subjectService->createSubject($validated);

        return redirect()->back()->with('message', 'Mata Pelajaran berhasil ditambahkan.');
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'code' => 'nullable|string|max:50',
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:Wajib,Peminatan,Muatan Lokal',
            'is_active' => 'boolean',
        ]);

        $this->subjectService->updateSubject($id, $validated);

        return redirect()->back()->with('message', 'Mata Pelajaran berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $this->subjectService->deleteSubject($id);

        return redirect()->back()->with('message', 'Mata Pelajaran berhasil dihapus.');
    }
}
