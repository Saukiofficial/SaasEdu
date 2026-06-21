<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Services\AdmissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PPDBController extends Controller
{
    protected AdmissionService $admissionService;

    public function __construct(AdmissionService $admissionService)
    {
        $this->admissionService = $admissionService;
    }

    // Menampilkan halaman Landing Page PPDB sekolah tertentu
    public function showLanding(string $schoolId)
    {
        $school = School::findOrFail($schoolId);

        return Inertia::render('PPDB/Landing', [
            'school' => [
                'id' => $school->id,
                'name' => $school->name,
                'address' => $school->address,
            ]
        ]);
    }

    // Memproses data pendaftaran dari form publik
    public function store(Request $request, string $schoolId)
    {
        $school = School::findOrFail($schoolId);

        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'nisn' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'phone' => 'required|string|max:20',
            'previous_school' => 'nullable|string|max:255',
            'address' => 'nullable|string',
        ]);

        $admission = $this->admissionService->createPublicRegistration($school->id, $validated);

        return redirect()->back()->with('message', 'Pendaftaran Berhasil! Nomor Registrasi Anda: ' . $admission->registration_number);
    }
}
