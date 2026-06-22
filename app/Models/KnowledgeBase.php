<?php

namespace App\Models;

use App\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class KnowledgeBase extends Model
{
    use HasFactory, UsesUuid;

    protected $fillable = [
        'title',
        'slug',
        'category',
        'content',
        'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
    ];

    // Otomatis membuat slug saat artikel disimpan jika slug kosong
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->title) . '-' . substr(uniqid(), -5);
            }
        });
    }
}
