<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guardian_student', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('guardian_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('student_id')->constrained()->cascadeOnDelete();
            
            // Menyimpan status hubungan: Ayah, Ibu, atau Wali
            $table->enum('relationship', ['Ayah', 'Ibu', 'Wali'])->default('Wali');
            
            $table->timestamps();
            
            // Mencegah duplikasi data yang sama
            $table->unique(['guardian_id', 'student_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guardian_student');
    }
};