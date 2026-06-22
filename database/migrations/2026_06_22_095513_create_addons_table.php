<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('addons', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 15, 2)->default(0);
            $table->enum('billing_cycle', ['monthly', 'yearly', 'one-time'])->default('one-time');
            
            // Tipe addon: 'storage', 'student', 'feature', 'service'
            $table->string('type')->default('feature'); 
            
            // Nilai penambahan. Misal type 'storage' valuenya 5120 (5GB). type 'student' valuenya 100.
            $table->integer('value')->nullable(); 
            
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('addons');
    }
};