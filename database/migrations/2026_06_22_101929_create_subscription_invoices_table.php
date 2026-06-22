<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscription_invoices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('invoice_number')->unique(); // Format misal: INV-20260701-001
            $table->uuid('school_id'); // Relasi ke tenant (sekolah)
            $table->decimal('amount', 15, 2); // Jumlah tagihan
            $table->string('description')->nullable(); // Deskripsi tagihan (Misal: Tagihan Premium Plan Juli 2026)
            $table->enum('status', ['unpaid', 'paid', 'canceled'])->default('unpaid');
            $table->date('due_date'); // Jatuh tempo
            $table->timestamp('paid_at')->nullable(); // Tanggal dibayar
            $table->string('payment_method')->nullable(); // Metode pembayaran (Manual Transfer, Payment Gateway, dll)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_invoices');
    }
};