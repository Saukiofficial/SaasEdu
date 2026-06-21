<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exams', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('school_id')->constrained('schools')->onDelete('cascade');
            $table->foreignUuid('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->foreignUuid('classroom_id')->constrained('classrooms')->onDelete('cascade');
            
            $table->string('title'); // Contoh: "UAS Semester Ganjil 2026"
            $table->dateTime('start_time'); // Waktu ujian dimulai
            $table->dateTime('end_time'); // Waktu ujian ditutup (batas akhir login/submit)
            $table->integer('duration_minutes')->default(60); // Durasi pengerjaan dalam menit
            $table->text('description')->nullable(); // Instruksi ujian
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};
