<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grades', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('school_id')->constrained('schools')->cascadeOnDelete();
            $table->foreignUuid('academic_year_id')->constrained('academic_years')->cascadeOnDelete();
            $table->foreignUuid('teacher_id')->constrained('teachers')->cascadeOnDelete(); // Tambahan: Melacak guru
            $table->foreignUuid('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->foreignUuid('classroom_id')->constrained('classrooms')->cascadeOnDelete(); // Tambahan: Untuk kemudahan filter kelas
            $table->foreignUuid('student_id')->constrained('students')->cascadeOnDelete();
            
            $table->string('type'); // Contoh: 'Tugas 1', 'Tugas 2', 'UTS', 'UAS'
            $table->decimal('score', 5, 2)->default(0); // Nilai 0.00 hingga 100.00
            $table->text('description')->nullable(); // Catatan perbaikan dari guru
            
            $table->timestamps();

            // Memastikan 1 siswa hanya punya 1 nilai untuk jenis tes yang sama di mapel dan tahun ajaran yang sama
            $table->unique(['student_id', 'subject_id', 'academic_year_id', 'type'], 'grade_unique_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};