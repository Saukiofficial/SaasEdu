<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prospects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name'); // Nama PIC / Prospek
            $table->string('school_name'); // Nama Institusi / Sekolah
            $table->string('email');
            $table->string('phone');
            $table->string('status')->default('new'); // new, contacted, in_progress, qualified, lost
            $table->text('notes')->nullable(); // Catatan interaksi sales
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prospects');
    }
};
