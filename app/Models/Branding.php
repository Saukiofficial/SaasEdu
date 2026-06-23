<?php

namespace App\Models;

use App\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Branding extends Model
{
    use HasFactory, UsesUuid;

    protected $fillable = [
        'school_id',
        'app_name',
        'primary_color',
        'logo_url',
        'favicon_url',
        'login_bg_url',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class, 'school_id');
    }
}
