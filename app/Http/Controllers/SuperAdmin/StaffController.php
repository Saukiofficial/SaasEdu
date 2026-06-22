<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\StaffService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Validation\Rules;

class StaffController extends Controller
{
    protected $staffService;

    public function __construct(StaffService $staffService)
    {
        $this->staffService = $staffService;
    }

    public function index()
    {
        $staffs = $this->staffService->getAllStaff(15);
        
        // Mengambil semua role untuk ditampilkan di dropdown (kecuali role Tenant/Sekolah jika ada)
        $roles = Role::all();
        
        return Inertia::render('SuperAdmin/Staff/Index', [
            'staffs' => $staffs,
            'roles' => $roles
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', Rules\Password::defaults()],
            'role' => 'required|string|exists:roles,name',
        ]);

        $this->staffService->createStaff(
            $request->only(['name', 'email', 'password']), 
            $validated['role']
        );

        return redirect()->back()->with('success', 'Akun Staff berhasil dibuat.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'password' => ['nullable', Rules\Password::defaults()],
            'role' => 'required|string|exists:roles,name',
        ]);

        $this->staffService->updateStaff(
            $id,
            $request->only(['name', 'email', 'password']),
            $validated['role']
        );

        return redirect()->back()->with('success', 'Data Staff berhasil diperbarui.');
    }

    public function destroy($id)
    {
        try {
            $this->staffService->deleteStaff($id);
            return redirect()->back()->with('success', 'Akun Staff berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}