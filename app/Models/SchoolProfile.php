<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SchoolProfile extends Model
{
    use HasUuids;

    protected $fillable = [
        'school_id',
        'npsn',
        'principal_name',
        'website',
        'vision',
        'mission',
        'logo',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
}
