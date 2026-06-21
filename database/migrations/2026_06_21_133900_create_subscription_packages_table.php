<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscription_packages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            $table->string('name'); // Contoh: Basic, Pro, Enterprise
            $table->text('description')->nullable();
            $table->decimal('price', 12, 2)->default(0); // Harga paket
            $table->integer('duration_days')->default(30); // Durasi langganan (30 hari, 365 hari, dll)
            
            // Batasan (Limitasi)
            $table->integer('max_students')->nullable(); // Null = Unlimited
            $table->integer('max_users')->nullable(); // Total admin/guru
            
            $table->json('features')->nullable(); // Array fitur: ["Fitur 1", "Fitur 2"]
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_packages');
    }
};
