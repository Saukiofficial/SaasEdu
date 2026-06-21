<?php

namespace App\Models;

use App\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionPackage extends Model
{
    use HasFactory, UsesUuid;

    protected $fillable = [
        'name',
        'description',
        'price',
        'duration_days',
        'max_students',
        'max_users',
        'features',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'duration_days' => 'integer',
            'max_students' => 'integer',
            'max_users' => 'integer',
            'features' => 'array',
            'is_active' => 'boolean',
        ];
    }
}