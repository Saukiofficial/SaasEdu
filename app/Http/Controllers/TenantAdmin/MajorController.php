<?php

namespace App\Http\Controllers\TenantAdmin;

use App\Http\Controllers\Controller;
use App\Services\MajorService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MajorController extends Controller
{
    public function __construct(
        protected MajorService $majorService
    ) {}

    public function index(Request $request)
    {
        $schoolId = auth()->user()->school_id;
        
        $majors = $this->majorService->getMajorsPaginated($schoolId, $request->only(['search']));

        return Inertia::render('TenantAdmin/Majors/Index', [
            'majors' => $majors,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'code' => [
                'required', 'string', 'max:50',
                Rule::unique('majors')->where(fn ($query) => $query->where('school_id', $schoolId)),
            ],
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $this->majorService->createMajor($schoolId, $validated);

        return redirect()->back()->with('success', 'Data jurusan berhasil ditambahkan.');
    }

    public function update(Request $request, string $id)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'code' => [
                'required', 'string', 'max:50',
                Rule::unique('majors')
                    ->where(fn ($query) => $query->where('school_id', $schoolId))
                    ->ignore($id),
            ],
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $this->majorService->updateMajor((int)$id, $schoolId, $validated);

        return redirect()->back()->with('success', 'Data jurusan berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $schoolId = auth()->user()->school_id;
        
        $this->majorService->deleteMajor((int)$id, $schoolId);

        return redirect()->back()->with('success', 'Data jurusan berhasil dihapus.');
    }
}
