<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            // Relasi ke tabel schools
            $table->foreignUuid('school_id')->constrained('schools')->onDelete('cascade');
            
            $table->string('plan_name'); // 'Free Trial', 'Bulanan', 'Tahunan'
            $table->date('start_date');
            $table->date('end_date');
            $table->string('status')->default('active'); // active, expired, cancelled
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
