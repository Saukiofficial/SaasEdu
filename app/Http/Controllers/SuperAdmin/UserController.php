<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        // Proteksi: Pastikan hanya Super Admin yang bisa mengakses
        if (auth()->user()->school_id !== null) {
            abort(403, 'Akses ditolak.');
        }

        $search = $request->query('search');

        // Ambil data user beserta relasi school (tenant) dan roles-nya
        $users = User::with(['school', 'roles'])
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('SuperAdmin/Users/Index', [
            'users' => $users,
            'filters' => ['search' => $search]
        ]);
    }

    public function destroy(string $id)
    {
        if (auth()->user()->school_id !== null) abort(403);

        $user = User::findOrFail($id);
        
        // Cegah Super Admin menghapus akun SaaS miliknya sendiri
        if ($user->school_id === null) {
            return redirect()->back()->withErrors(['error' => 'Tidak dapat menghapus akun utama Super Admin.']);
        }

        $user->delete();

        return redirect()->back()->with('message', 'Pengguna berhasil dihapus dari sistem.');
    }
}