<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Services\ClassroomService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassroomController extends Controller
{
    protected ClassroomService $classroomService;

    public function __construct(ClassroomService $classroomService)
    {
        $this->classroomService = $classroomService;
    }

    public function index()
    {
        $classrooms = $this->classroomService->getAll();
        return Inertia::render('MasterData/Classrooms/Index', [
            'classrooms' => $classrooms
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'level' => 'nullable|string|max:50',
            'capacity' => 'required|integer|min:1',
        ]);

        $this->classroomService->createClassroom($validated);

        return redirect()->back()->with('message', 'Kelas berhasil ditambahkan.');
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'level' => 'nullable|string|max:50',
            'capacity' => 'required|integer|min:1',
        ]);

        $this->classroomService->updateClassroom($id, $validated);

        return redirect()->back()->with('message', 'Kelas berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $this->classroomService->deleteClassroom($id);

        return redirect()->back()->with('message', 'Kelas berhasil dihapus.');
    }
}