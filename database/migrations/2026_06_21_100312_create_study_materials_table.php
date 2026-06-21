<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('study_materials', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('school_id')->constrained('schools')->onDelete('cascade');
            $table->foreignUuid('teacher_id')->constrained('teachers')->onDelete('cascade');
            $table->foreignUuid('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->foreignUuid('classroom_id')->constrained('classrooms')->onDelete('cascade');
            
            $table->string('title'); // Judul materi / tugas
            $table->enum('type', ['material', 'assignment'])->default('material'); // Jenis konten
            $table->text('description')->nullable(); // Deskripsi atau instruksi
            $table->string('file_url')->nullable(); // Link eksternal (G-Drive, Youtube, dll)
            $table->dateTime('due_date')->nullable(); // Batas waktu jika type = assignment
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('study_materials');
    }
};
