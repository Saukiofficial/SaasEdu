<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Buat Tabel Attempts Terlebih Dahulu
        Schema::create('exam_attempts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            $table->uuid('exam_id');
            $table->uuid('student_id');
            
            $table->foreign('exam_id')->references('id')->on('exams')->cascadeOnDelete();
            $table->foreign('student_id')->references('id')->on('students')->cascadeOnDelete();
            
            $table->dateTime('started_at')->nullable();
            $table->dateTime('finished_at')->nullable();
            $table->decimal('score', 5, 2)->default(0);
            $table->enum('status', ['pending', 'in_progress', 'completed'])->default('pending');
            
            $table->timestamps();
            
            $table->unique(['exam_id', 'student_id']);
        });

        // 2. Buat Tabel Answers (Bergantung pada Attempts)
        Schema::create('exam_answers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            $table->uuid('exam_attempt_id');
            $table->uuid('exam_question_id');
            $table->uuid('exam_option_id')->nullable();
            
            $table->foreign('exam_attempt_id')->references('id')->on('exam_attempts')->cascadeOnDelete();
            $table->foreign('exam_question_id')->references('id')->on('exam_questions')->cascadeOnDelete();
            $table->foreign('exam_option_id')->references('id')->on('exam_options')->nullOnDelete();
            
            $table->boolean('is_correct')->default(false);
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        // Drop dengan urutan terbalik (Answers dulu, baru Attempts)
        Schema::dropIfExists('exam_answers');
        Schema::dropIfExists('exam_attempts');
    }
};
