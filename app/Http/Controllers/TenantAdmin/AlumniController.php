<?php

namespace App\Http\Controllers\TenantAdmin;

use App\Http\Controllers\Controller;
use App\Services\AlumniService;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AlumniController extends Controller
{
    public function __construct(
        protected AlumniService $alumniService
    ) {}

    public function index(Request $request)
    {
        $schoolId = auth()->user()->school_id;
        
        $filters = $request->only(['search', 'activity']);
        $alumnis = $this->alumniService->getAlumnisPaginated($schoolId, $filters);
        
        // Ambil data siswa (prioritaskan yang statusnya 'active' atau 'graduated') 
        // untuk dipilih di dropdown form
        $students = Student::where('school_id', $schoolId)
                           ->whereIn('status', ['active', 'graduated'])
                           ->orderBy('name')
                           ->get(['id', 'name', 'nis', 'status']);

        return Inertia::render('TenantAdmin/Alumnis/Index', [
            'alumnis' => $alumnis,
            'students' => $students,
            'filters' => $filters,
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'student_id' => [
                'required', 'uuid', 'exists:students,id',
                // Pastikan 1 siswa hanya bisa punya 1 record alumni
                Rule::unique('alumnis')->where(fn ($query) => $query->where('school_id', $schoolId)),
            ],
            'graduation_year' => 'required|digits:4|integer|min:2000|max:' . (date('Y') + 1),
            'current_activity' => 'required|in:Kuliah,Bekerja,Wirausaha,Mencari Kerja,Lainnya',
            'institution_name' => 'nullable|string|max:255',
            'major_or_position' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:30',
        ]);

        $this->alumniService->createAlumni($schoolId, $validated);

        return redirect()->back()->with('success', 'Data alumni berhasil dicatat. Status siswa otomatis menjadi Lulus.');
    }

    public function update(Request $request, string $id)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'student_id' => [
                'required', 'uuid', 'exists:students,id',
                Rule::unique('alumnis')
                    ->where(fn ($query) => $query->where('school_id', $schoolId))
                    ->ignore($id),
            ],
            'graduation_year' => 'required|digits:4|integer|min:2000|max:' . (date('Y') + 1),
            'current_activity' => 'required|in:Kuliah,Bekerja,Wirausaha,Mencari Kerja,Lainnya',
            'institution_name' => 'nullable|string|max:255',
            'major_or_position' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:30',
        ]);

        $this->alumniService->updateAlumni($id, $schoolId, $validated);

        return redirect()->back()->with('success', 'Data alumni berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $schoolId = auth()->user()->school_id;
        
        $this->alumniService->deleteAlumni($id, $schoolId);

        return redirect()->back()->with('success', 'Data tracer study alumni berhasil dihapus.');
    }
}
