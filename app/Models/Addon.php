<?php

namespace App\Models;

use App\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Addon extends Model
{
    use HasFactory, UsesUuid;

    protected $fillable = [
        'name',
        'description',
        'price',
        'billing_cycle',
        'type',
        'value',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'value' => 'integer',
        'is_active' => 'boolean',
    ];
}
