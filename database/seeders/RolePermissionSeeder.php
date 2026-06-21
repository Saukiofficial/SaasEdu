<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cache roles dan permission
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Buat Roles
        $roles = [
            'Super Admin',
            'Owner',
            'Kepala Sekolah',
            'Wakasek',
            'Guru',
            'Wali Kelas',
            'Bendahara',
            'Siswa',
            'Orang Tua'
        ];

        foreach ($roles as $role) {
            Role::create(['name' => $role]);
        }

        // 2. Buat Akun Super Admin Default
        $superAdmin = User::create([
            'name' => 'Super Administrator',
            'email' => 'admin@eduerp.com',
            'password' => Hash::make('password123'),
            'school_id' => null, // Super admin tidak terikat sekolah
        ]);

        $superAdmin->assignRole('Super Admin');
    }
}
