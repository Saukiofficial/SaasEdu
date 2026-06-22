<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\School;
use App\Models\User;
use App\Models\TenantSetting;
use App\Models\SubscriptionPackage;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DummyTenantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Buat Paket Langganan Dummy (Sesuai dengan kolom di Canvas)
        $package = SubscriptionPackage::updateOrCreate(
            ['name' => 'Premium Plan'],
            [
                'description' => 'Paket lengkap untuk operasional sekolah menengah.',
                'price' => 1500000,
                'billing_cycle' => 'monthly',
                'max_students' => 1000,
                'storage_limit_mb' => 5120, // 5 GB
                'features' => [
                    'Dashboard Utama',
                    'PPDB (Pendaftar, Verifikasi, Pengumuman)',
                    'Master Data Lengkap',
                    'Manajemen Siswa & Alumni',
                    'Guru, Pegawai & Absensi',
                    'Akademik, Jadwal & Rapor',
                    'E-Learning (LMS) & Ujian (CBT)',
                    'Kesiswaan (BK, Prestasi, Ekstrakurikuler)',
                    'Keuangan & SPP',
                    'Perpustakaan & Sarpras',
                    'Komunikasi & Manajemen Surat Menyurat',
                    'Laporan Lengkap & Pengaturan'
                ],
                'is_active' => true,
                'is_popular' => true,
            ]
        );

        // 2. Buat Data Institusi / Sekolah (Tenant)
        $school = School::updateOrCreate(
            ['email' => 'info@sman1jakarta.sch.id'],
            [
                'name' => 'SMA Negeri 1 Jakarta',
                'phone' => '021-12345678',
                'address' => 'Jl. Pendidikan No. 1, Jakarta Pusat',
                'status' => 'active',
            ]
        );

        // 3. Buat Pengaturan Tenant (Tenant Settings) untuk sekolah tersebut
        TenantSetting::updateOrCreate(
            ['school_id' => $school->id],
            [
                'max_students' => $package->max_students,
                'storage_limit_mb' => $package->storage_limit_mb,
                'custom_domain' => 'portal.sman1jakarta.sch.id',
                'enable_cbt' => true,
                'enable_ppdb' => true,
                'enable_lms' => true,
                'enable_finance' => true,
            ]
        );

        // 4. Buat Akun Pengguna sebagai Admin Sekolah
        $adminSekolah = User::updateOrCreate(
            ['email' => 'admin@sman1jakarta.sch.id'],
            [
                'name' => 'Budi Santoso (Admin SMAN 1)',
                'password' => Hash::make('password123'),
                'school_id' => $school->id, // Mengikat user ini ke tenant
            ]
        );

        // 5. Berikan Hak Akses (Role) kepada Admin Sekolah
        // Pastikan role 'Kepala Sekolah' atau 'Owner' sudah dibuat di RolePermissionSeeder
        $roleExists = Role::where('name', 'Kepala Sekolah')->exists();
        if ($roleExists) {
            $adminSekolah->assignRole('Kepala Sekolah');
        }
        
        $this->command->info('Dummy Tenant dan Admin Sekolah berhasil dibuat!');
    }
}