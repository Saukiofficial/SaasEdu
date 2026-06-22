<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenant_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('school_id')->unique(); // Relasi ke tabel sekolah
            
            // Limit Configuration
            $table->integer('max_students')->default(500);
            $table->integer('storage_limit_mb')->default(1024); // 1 GB default
            $table->string('custom_domain')->nullable();
            
            // Feature Overrides (Toggles)
            $table->boolean('enable_cbt')->default(true);
            $table->boolean('enable_ppdb')->default(true);
            $table->boolean('enable_lms')->default(true);
            $table->boolean('enable_finance')->default(true);
            
            $table->timestamps();

            // Opsional: Jika tabel sekolah Anda bernama 'schools'
            // $table->foreign('school_id')->references('id')->on('schools')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenant_settings');
    }
};
