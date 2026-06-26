<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('source_code_orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('order_number')->unique(); // Misal: ORD-SC-12345
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete(); // Akun Pembeli (Customer)
            $table->foreignUuid('source_code_id')->constrained('source_codes')->cascadeOnDelete(); // Produk yang dibeli
            $table->decimal('amount', 15, 2); // Harga saat dibeli (untuk mencegah perubahan jika harga produk naik/turun)
            $table->string('payment_method')->nullable(); // bank_transfer, e_wallet, dll
            $table->string('status')->default('pending'); // pending, paid, failed, cancelled
            $table->string('payment_proof')->nullable(); // Opsional untuk upload bukti transfer manual
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('source_code_orders');
    }
};