<?php

namespace App\Models;

use App\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class LandingProduct extends Model
{
    use HasFactory, UsesUuid;

    protected $fillable = [
        'name',
        'slug',
        'subtitle',
        'thumbnail_url',
        'screenshots',
        'features',
        'is_active',
    ];

    protected $casts = [
        'screenshots' => 'array',
        'features' => 'array',
        'is_active' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });
    }
}