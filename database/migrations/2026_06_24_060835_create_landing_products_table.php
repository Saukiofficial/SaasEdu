<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('landing_products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('subtitle')->nullable();
            $table->string('thumbnail_url')->nullable(); // Gambar untuk Card di Landing Page
            $table->json('screenshots')->nullable(); // Array gambar untuk Slider Laptop
            $table->json('features')->nullable(); // Array fitur-fitur
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('landing_products');
    }
};
