<?php

namespace App\Models;

use App\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class SourceCode extends Model
{
    use HasFactory, UsesUuid;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'price',
        'thumbnail',
        'file_path',
        'demo_url',
        'tech_stack',
        'features',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'tech_stack' => 'array',
        'features' => 'array',
        'is_active' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->title) . '-' . substr(uniqid(), -4);
            }
        });

        static::updating(function ($model) {
            if ($model->isDirty('title') && empty($model->slug)) {
                $model->slug = Str::slug($model->title) . '-' . substr(uniqid(), -4);
            }
        });
    }
}
