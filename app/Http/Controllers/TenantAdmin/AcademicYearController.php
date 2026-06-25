<?php

namespace App\Http\Controllers\TenantAdmin;

use App\Http\Controllers\Controller;
use App\Services\AcademicYearService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicYearController extends Controller
{
    public function __construct(
        protected AcademicYearService $academicYearService
    ) {}

    public function index(Request $request)
    {
        $schoolId = auth()->user()->school_id;
        
        $academicYears = $this->academicYearService->getAcademicYearsPaginated($schoolId, $request->only(['search']));

        return Inertia::render('TenantAdmin/AcademicYears/Index', [
            'academicYears' => $academicYears,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'name' => 'required|string|max:100', // Contoh: 2024/2025 Genap
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ]);

        $this->academicYearService->createAcademicYear($schoolId, $validated);

        return redirect()->back()->with('success', 'Tahun Ajaran berhasil ditambahkan.');
    }

    public function update(Request $request, string $id)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ]);

        $this->academicYearService->updateAcademicYear($id, $schoolId, $validated);

        return redirect()->back()->with('success', 'Tahun Ajaran berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $schoolId = auth()->user()->school_id;
        
        $this->academicYearService->deleteAcademicYear($id, $schoolId);

        return redirect()->back()->with('success', 'Tahun Ajaran berhasil dihapus.');
    }
}