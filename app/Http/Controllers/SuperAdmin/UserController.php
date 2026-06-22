<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index()
    {
        $users = $this->userService->getAllUsers(15);
        
        return Inertia::render('SuperAdmin/Users/Index', [
            'users' => $users
        ]);
    }

    public function store(Request $request)
    {
        // Validasi khusus untuk menambah akun Staff internal SaaS
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', Rules\Password::defaults()],
        ]);

        $this->userService->createSaaSStaff($validated);

        return redirect()->back()->with('success', 'Akun Staff SaaS baru berhasil ditambahkan.');
    }

    public function destroy($id)
    {
        // Mencegah user menghapus akunnya sendiri (opsional namun sangat disarankan)
        if (auth()->id() == $id) {
            return redirect()->back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $this->userService->deleteUser($id);
        
        return redirect()->back()->with('success', 'Akun pengguna berhasil dihapus.');
    }
}
