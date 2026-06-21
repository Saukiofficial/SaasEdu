<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Services\AcademicYearService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicYearController extends Controller
{
    protected AcademicYearService $academicYearService;

    public function __construct(AcademicYearService $academicYearService)
    {
        $this->academicYearService = $academicYearService;
    }

    public function index()
    {
        $academicYears = $this->academicYearService->getAll();
        return Inertia::render('MasterData/AcademicYears/Index', [
            'academicYears' => $academicYears
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ]);

        $this->academicYearService->createAcademicYear($validated);

        return redirect()->back()->with('message', 'Tahun Ajaran berhasil ditambahkan.');
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ]);

        $this->academicYearService->updateAcademicYear($id, $validated);

        return redirect()->back()->with('message', 'Tahun Ajaran berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $this->academicYearService->deleteAcademicYear($id);

        return redirect()->back()->with('message', 'Tahun Ajaran berhasil dihapus.');
    }
}