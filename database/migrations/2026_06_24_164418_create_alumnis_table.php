<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alumnis', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('school_id')->constrained('schools')->cascadeOnDelete();
            
            // Relasi One-to-One dengan tabel students (satu siswa = satu record alumni)
            $table->foreignUuid('student_id')->unique()->constrained('students')->cascadeOnDelete();
            
            $table->year('graduation_year');
            $table->enum('current_activity', ['Kuliah', 'Bekerja', 'Wirausaha', 'Mencari Kerja', 'Lainnya'])->default('Mencari Kerja');
            $table->string('institution_name')->nullable(); // Nama Kampus / Perusahaan
            $table->string('major_or_position')->nullable(); // Jurusan (jika kuliah) atau Jabatan (jika bekerja)
            $table->string('contact_number')->nullable(); // Kontak terbaru (HP/WA)
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alumnis');
    }
};