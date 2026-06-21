<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('saas_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('key')->unique(); // Contoh: 'app_name', 'support_email', 'maintenance_mode'
            $table->text('value')->nullable();
            $table->string('type')->default('string'); // string, boolean, json, integer
            $table->string('group')->default('general'); // general, integration, security
            $table->timestamps();
        });

        // Insert Default Settings (Seeder Langsung)
        DB::table('saas_settings')->insert([
            ['id' => Str::uuid(), 'key' => 'app_name', 'value' => 'SaaSEdu', 'type' => 'string', 'group' => 'general', 'created_at' => now(), 'updated_at' => now()],
            ['id' => Str::uuid(), 'key' => 'support_email', 'value' => 'support@saasedu.com', 'type' => 'string', 'group' => 'general', 'created_at' => now(), 'updated_at' => now()],
            ['id' => Str::uuid(), 'key' => 'company_address', 'value' => 'Jl. Teknologi No. 1, Jakarta', 'type' => 'string', 'group' => 'general', 'created_at' => now(), 'updated_at' => now()],
            ['id' => Str::uuid(), 'key' => 'currency', 'value' => 'IDR', 'type' => 'string', 'group' => 'general', 'created_at' => now(), 'updated_at' => now()],
            ['id' => Str::uuid(), 'key' => 'maintenance_mode', 'value' => 'false', 'type' => 'boolean', 'group' => 'security', 'created_at' => now(), 'updated_at' => now()],
            ['id' => Str::uuid(), 'key' => 'midtrans_client_key', 'value' => '', 'type' => 'string', 'group' => 'integration', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('saas_settings');
    }
};
