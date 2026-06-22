<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('demo_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name'); // Nama pemohon
            $table->string('school_name'); // Nama sekolah/instansi
            $table->string('email');
            $table->string('phone');
            $table->date('requested_date'); // Tanggal pengajuan/pelaksanaan demo
            $table->string('status')->default('pending'); // pending, contacted, scheduled, completed, rejected
            $table->text('notes')->nullable(); // Catatan dari tim sales
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demo_requests');
    }
};