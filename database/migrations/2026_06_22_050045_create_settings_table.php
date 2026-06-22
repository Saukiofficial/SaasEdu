<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('key')->unique(); // Contoh: 'app_name', 'maintenance_mode'
            $table->text('value')->nullable(); // Nilainya (bisa string, JSON, atau boolean berupa '1'/'0')
            $table->string('group')->default('general'); // Contoh: 'general', 'branding', 'contact'
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};