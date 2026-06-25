<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teacher_attendances', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('school_id')->constrained('schools')->cascadeOnDelete();
            $table->foreignUuid('teacher_id')->constrained('teachers')->cascadeOnDelete();
            
            $table->date('date'); // Tanggal absensi
            $table->enum('status', ['present', 'sick', 'leave', 'absent'])->default('present'); // Hadir, Sakit, Izin, Alpa
            $table->string('notes')->nullable(); // Keterangan tambahan (opsional)
            
            $table->timestamps();

            // Mencegah 1 guru diabsen 2 kali pada tanggal yang sama
            $table->unique(['teacher_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_attendances');
    }
};
