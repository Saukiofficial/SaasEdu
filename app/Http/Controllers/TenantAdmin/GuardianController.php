<?php

namespace App\Http\Controllers\TenantAdmin;

use App\Http\Controllers\Controller;
use App\Services\GuardianService;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GuardianController extends Controller
{
    public function __construct(
        protected GuardianService $guardianService
    ) {}

    public function index(Request $request)
    {
        $schoolId = auth()->user()->school_id;
        
        $filters = $request->only(['search']);
        $guardians = $this->guardianService->getGuardiansPaginated($schoolId, $filters);
        
        // Load data siswa untuk dropdown "Hubungkan dengan Anak"
        $students = Student::where('school_id', $schoolId)
                           ->orderBy('name')
                           ->get(['id', 'name', 'nis']);

        return Inertia::render('TenantAdmin/Guardians/Index', [
            'guardians' => $guardians,
            'students' => $students,
            'filters' => $filters,
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:30',
            'job' => 'nullable|string|max:100',
            'address' => 'nullable|string',
            'students' => 'nullable|array',
            'students.*.id' => 'required|uuid|exists:students,id',
            'students.*.relationship' => 'required|in:Ayah,Ibu,Wali',
        ]);

        $this->guardianService->createGuardian($schoolId, $validated);

        return redirect()->back()->with('success', 'Data orang tua berhasil ditambahkan.');
    }

    public function update(Request $request, string $id)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:30',
            'job' => 'nullable|string|max:100',
            'address' => 'nullable|string',
            'students' => 'nullable|array',
            'students.*.id' => 'required|uuid|exists:students,id',
            'students.*.relationship' => 'required|in:Ayah,Ibu,Wali',
        ]);

        $this->guardianService->updateGuardian($id, $schoolId, $validated);

        return redirect()->back()->with('success', 'Data orang tua berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $schoolId = auth()->user()->school_id;
        
        $this->guardianService->deleteGuardian($id, $schoolId);

        return redirect()->back()->with('success', 'Data orang tua berhasil dihapus.');
    }
}
