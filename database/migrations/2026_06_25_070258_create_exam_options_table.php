<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exam_options', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('exam_question_id')->constrained('exam_questions')->cascadeOnDelete();
            
            $table->string('option_text'); // Teks pilihan ganda (A, B, C, D)
            $table->boolean('is_correct')->default(false); // Penanda kunci jawaban
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_options');
    }
};