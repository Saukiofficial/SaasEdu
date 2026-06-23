<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ip_accesses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('ip_address', 45)->unique(); // IPv4 atau IPv6
            $table->string('label')->nullable(); // Penamaan IP (Contoh: "Kantor Pusat", "Hacker")
            $table->enum('type', ['whitelist', 'blacklist'])->default('blacklist');
            $table->text('notes')->nullable(); // Keterangan tambahan
            $table->boolean('is_active')->default(true); // Status aktif/nonaktif aturan IP ini
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ip_accesses');
    }
};
