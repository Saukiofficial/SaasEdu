<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Siapa yang melakukan (Bisa null jika aksi dilakukan sistem/cron)
            $table->uuid('user_id')->nullable();
            
            // Nama modul atau model yang diubah (misal: 'SubscriptionInvoice', 'Tenant', 'User')
            $table->string('module');
            
            // Aksi yang dilakukan
            $table->enum('action', ['created', 'updated', 'deleted', 'login', 'logout', 'failed_login', 'system_event']);
            
            // Penjelasan singkat yang mudah dibaca (misal: "Super Admin menghapus Invoice INV-001")
            $table->text('description');
            
            // Menyimpan data lama dan data baru dalam format JSON (Sangat berguna untuk melacak perubahan spesifik)
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            
            // Informasi tambahan
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable(); // Browser / Device info
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
