<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\RoleService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    protected $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    public function index()
    {
        $roles = $this->roleService->getAllRoles(15);
        
        return Inertia::render('SuperAdmin/Roles/Index', [
            'roles' => $roles
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'description' => 'nullable|string|max:255',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string'
        ]);

        $this->roleService->createRole($validated);

        return redirect()->back()->with('success', 'Hak Akses (Role) berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $id,
            'description' => 'nullable|string|max:255',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string'
        ]);

        $this->roleService->updateRole($id, $validated);

        return redirect()->back()->with('success', 'Hak Akses (Role) berhasil diperbarui.');
    }

    public function destroy($id)
    {
        try {
            $this->roleService->deleteRole($id);
            return redirect()->back()->with('success', 'Role berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
