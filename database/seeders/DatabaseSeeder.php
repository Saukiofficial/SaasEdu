<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Memanggil seeder custom yang sudah kita buat
        $this->call([
            RolePermissionSeeder::class,
        ]);
    }
}