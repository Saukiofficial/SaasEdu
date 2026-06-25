<?php

namespace App\Http\Controllers\TenantAdmin;

use App\Http\Controllers\Controller;
use App\Services\EmployeeService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function __construct(
        protected EmployeeService $employeeService
    ) {}

    public function index(Request $request)
    {
        $schoolId = auth()->user()->school_id;
        
        $filters = $request->only(['search', 'status']);
        $employees = $this->employeeService->getEmployeesPaginated($schoolId, $filters);

        return Inertia::render('TenantAdmin/Employees/Index', [
            'employees' => $employees,
            'filters' => $filters,
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'nip_or_nik' => [
                'nullable', 'string', 'max:50',
                Rule::unique('employees')->where(fn ($query) => $query->where('school_id', $schoolId)),
            ],
            'name' => 'required|string|max:255',
            'gender' => 'required|in:L,P',
            'position' => 'required|string|max:100',
            'birth_place' => 'nullable|string|max:100',
            'birth_date' => 'nullable|date',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:30',
            'status' => 'required|in:active,inactive,retired',
        ]);

        $this->employeeService->createEmployee($schoolId, $validated);

        return redirect()->back()->with('success', 'Data pegawai berhasil ditambahkan.');
    }

    public function update(Request $request, string $id)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'nip_or_nik' => [
                'nullable', 'string', 'max:50',
                Rule::unique('employees')
                    ->where(fn ($query) => $query->where('school_id', $schoolId))
                    ->ignore($id),
            ],
            'name' => 'required|string|max:255',
            'gender' => 'required|in:L,P',
            'position' => 'required|string|max:100',
            'birth_place' => 'nullable|string|max:100',
            'birth_date' => 'nullable|date',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:30',
            'status' => 'required|in:active,inactive,retired',
        ]);

        $this->employeeService->updateEmployee($id, $schoolId, $validated);

        return redirect()->back()->with('success', 'Data pegawai berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $schoolId = auth()->user()->school_id;
        
        $this->employeeService->deleteEmployee($id, $schoolId);

        return redirect()->back()->with('success', 'Data pegawai berhasil dihapus.');
    }
}