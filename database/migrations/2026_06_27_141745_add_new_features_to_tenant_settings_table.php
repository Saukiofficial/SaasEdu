<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tenant_settings', function (Blueprint $table) {
            $table->boolean('enable_student_affairs')->default(true)->after('enable_finance'); // Kesiswaan
            $table->boolean('enable_facilities')->default(true)->after('enable_student_affairs'); // Fasilitas
        });
    }

    public function down(): void
    {
        Schema::table('tenant_settings', function (Blueprint $table) {
            $table->dropColumn(['enable_student_affairs', 'enable_facilities']);
        });
    }
};
