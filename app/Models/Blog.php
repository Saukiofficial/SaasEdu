<?php

namespace App\Models;

use App\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Blog extends Model
{
    use HasFactory, UsesUuid;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'thumbnail',
        'status',
    ];

    // Otomatis membuat slug dari title saat pembuatan jika slug kosong
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($blog) {
            if (empty($blog->slug)) {
                $blog->slug = Str::slug($blog->title) . '-' . substr(uniqid(), -4);
            }
        });

        static::updating(function ($blog) {
            if ($blog->isDirty('title') && empty($blog->slug)) {
                $blog->slug = Str::slug($blog->title) . '-' . substr(uniqid(), -4);
            }
        });
    }
}
