<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('classrooms', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('school_id')->constrained('schools')->onDelete('cascade');
            
            $table->string('name'); // Misal: "X MIPA 1" atau "Ruang A1"
            $table->string('level')->nullable(); // Misal: "10", "11", "12" atau "VII"
            $table->integer('capacity')->default(30); // Kapasitas maksimal siswa
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('classrooms');
    }
};