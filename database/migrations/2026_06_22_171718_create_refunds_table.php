<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('refunds', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('school_id')->constrained('schools')->cascadeOnDelete();
            $table->foreignUuid('subscription_invoice_id')->constrained('subscription_invoices')->cascadeOnDelete();
            $table->decimal('amount', 15, 2); // Nominal yang dikembalikan
            $table->text('reason'); // Alasan pengajuan refund
            $table->string('status')->default('pending'); // pending, approved, rejected, processed
            $table->timestamp('processed_at')->nullable(); // Waktu dana benar-benar dikembalikan
            $table->text('notes')->nullable(); // Catatan dari tim billing (misal: alasan penolakan/bukti transfer)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('refunds');
    }
};
