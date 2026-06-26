<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('source_codes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 15, 2)->default(0); // Harga beli putus
            $table->string('thumbnail')->nullable(); // Gambar cover (public)
            $table->string('file_path')->nullable(); // Path file ZIP (terproteksi/local)
            $table->string('demo_url')->nullable(); // Link demo (opsional)
            $table->json('tech_stack')->nullable(); // Array of strings (e.g., ['Laravel 11', 'React'])
            $table->json('features')->nullable(); // Array of strings
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('source_codes');
    }
};
