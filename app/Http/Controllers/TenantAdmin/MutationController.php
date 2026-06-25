<?php

namespace App\Http\Controllers\TenantAdmin;

use App\Http\Controllers\Controller;
use App\Services\StudentMutationService;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MutationController extends Controller
{
    public function __construct(
        protected StudentMutationService $mutationService
    ) {}

    public function index(Request $request)
    {
        $schoolId = auth()->user()->school_id;
        
        $filters = $request->only(['search', 'type']);
        $mutations = $this->mutationService->getMutationsPaginated($schoolId, $filters);
        
        // Load data siswa untuk dropdown "Pilih Siswa"
        $students = Student::where('school_id', $schoolId)
                           ->orderBy('name')
                           ->get(['id', 'name', 'nis']);

        return Inertia::render('TenantAdmin/Mutations/Index', [
            'mutations' => $mutations,
            'students' => $students,
            'filters' => $filters,
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'student_id' => 'required|uuid|exists:students,id',
            'type' => 'required|in:Masuk,Keluar',
            'mutation_date' => 'required|date',
            'reference_number' => 'nullable|string|max:100',
            'origin_school' => 'nullable|string|max:255',
            'destination_school' => 'nullable|string|max:255',
            'reason' => 'nullable|string',
        ]);

        $this->mutationService->createMutation($schoolId, $validated);

        return redirect()->back()->with('success', 'Data mutasi berhasil dicatat dan status siswa otomatis diperbarui.');
    }

    public function update(Request $request, string $id)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'student_id' => 'required|uuid|exists:students,id',
            'type' => 'required|in:Masuk,Keluar',
            'mutation_date' => 'required|date',
            'reference_number' => 'nullable|string|max:100',
            'origin_school' => 'nullable|string|max:255',
            'destination_school' => 'nullable|string|max:255',
            'reason' => 'nullable|string',
        ]);

        $this->mutationService->updateMutation($id, $schoolId, $validated);

        return redirect()->back()->with('success', 'Data mutasi berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $schoolId = auth()->user()->school_id;
        
        $this->mutationService->deleteMutation($id, $schoolId);

        return redirect()->back()->with('success', 'Riwayat mutasi berhasil dihapus.');
    }
}
