<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('brandings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('school_id')->nullable()->constrained('schools')->cascadeOnDelete(); // Null berarti ini adalah Branding Global (Super Admin)
            $table->string('app_name')->default('AkademiaOS');
            $table->string('primary_color')->default('#B8935F'); // Warna utama
            $table->string('logo_url')->nullable();
            $table->string('favicon_url')->nullable();
            $table->string('login_bg_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('brandings');
    }
};
