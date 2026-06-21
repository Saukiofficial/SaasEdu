<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('school_id')->constrained('schools')->onDelete('cascade');
            $table->foreignUuid('academic_year_id')->nullable()->constrained('academic_years')->onDelete('set null');
            
            $table->string('registration_number')->unique();
            $table->string('full_name');
            $table->string('nisn')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('previous_school')->nullable();
            $table->text('address')->nullable();
            $table->string('status')->default('pending'); // pending, approved, rejected
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admissions');
    }
};