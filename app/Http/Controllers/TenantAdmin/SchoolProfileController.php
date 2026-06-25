<?php

namespace App\Http\Controllers\TenantAdmin;

use App\Http\Controllers\Controller;
use App\Services\SchoolProfileService;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolProfileController extends Controller
{
    public function __construct(
        protected SchoolProfileService $schoolProfileService
    ) {}

    public function index()
    {
        $schoolId = auth()->user()->school_id;
        
        $school = School::findOrFail($schoolId);
        $profile = $this->schoolProfileService->getProfile($schoolId);

        return Inertia::render('TenantAdmin/SchoolProfile/Index', [
            'school' => $school,
            'profile' => $profile ?? (object)[
                'npsn' => '',
                'principal_name' => '',
                'website' => '',
                'vision' => '',
                'mission' => '',
            ],
        ]);
    }

    public function update(Request $request)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'npsn' => 'nullable|string|max:20',
            'principal_name' => 'nullable|string|max:100',
            'website' => 'nullable|string|max:255', // Bisa diubah jadi url jika ingin wajib format http://
            'vision' => 'nullable|string',
            'mission' => 'nullable|string',
        ]);

        $this->schoolProfileService->updateProfile($schoolId, $validated);

        return redirect()->back()->with('success', 'Profil Sekolah berhasil disimpan.');
    }
}
