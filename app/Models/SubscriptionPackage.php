<?php

namespace App\Models;

use App\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SubscriptionPackage extends Model
{
    use HasFactory, UsesUuid;

    protected $fillable = [
        'name',
        'description',
        'price',
        'billing_cycle', // monthly, yearly, one-time
        'max_students',
        'storage_limit_mb',
        'features',      // JSON array
        'is_active',
        'is_popular',    // Untuk highlight paket terlaris
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'max_students' => 'integer',
        'storage_limit_mb' => 'integer',
        'features' => 'array',
        'is_active' => 'boolean',
        'is_popular' => 'boolean',
    ];
}