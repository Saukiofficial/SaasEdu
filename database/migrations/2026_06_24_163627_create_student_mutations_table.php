<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_mutations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('school_id')->constrained('schools')->cascadeOnDelete();
            $table->foreignUuid('student_id')->constrained('students')->cascadeOnDelete();
            
            $table->enum('type', ['Masuk', 'Keluar']);
            $table->date('mutation_date');
            $table->string('reference_number')->nullable(); // Nomor Surat Mutasi
            $table->string('origin_school')->nullable(); // Sekolah Asal (untuk mutasi masuk)
            $table->string('destination_school')->nullable(); // Sekolah Tujuan (untuk mutasi keluar)
            $table->text('reason')->nullable(); // Alasan Mutasi
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_mutations');
    }
};
