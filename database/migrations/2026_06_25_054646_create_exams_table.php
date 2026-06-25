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
            $table->foreignUuid('school_id')->constrained('schools')->cascadeOnDelete();
            
            // Relasi ekstra yang sangat penting untuk LMS
            $table->foreignUuid('teacher_id')->constrained('teachers')->cascadeOnDelete();
            $table->foreignUuid('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->foreignUuid('classroom_id')->constrained('classrooms')->cascadeOnDelete();
            
            $table->string('title'); // Judul ujian (UTS, UAS, Ulangan Harian)
            $table->text('description')->nullable(); // Deskripsi atau instruksi
            $table->dateTime('start_time'); // Waktu mulai ujian
            $table->dateTime('end_time'); // Waktu selesai ujian
            $table->integer('duration'); // Durasi ujian dalam menit
            $table->boolean('is_active')->default(false); // Status ujian (Default false/draft agar tidak langsung tayang)
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};
