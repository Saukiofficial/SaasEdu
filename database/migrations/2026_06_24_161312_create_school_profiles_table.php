<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('school_profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Foreign Key ke tabel schools. Harus unique() karena relasinya One-to-One
            $table->foreignUuid('school_id')->unique()->constrained('schools')->cascadeOnDelete();
            
            // Kolom-kolom profil spesifik
            $table->string('npsn', 20)->nullable();
            $table->string('principal_name', 100)->nullable(); // Nama Kepala Sekolah
            $table->string('website')->nullable();
            $table->text('vision')->nullable(); // Visi
            $table->text('mission')->nullable(); // Misi
            $table->string('logo')->nullable(); // Path logo sekolah
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('school_profiles');
    }
};
