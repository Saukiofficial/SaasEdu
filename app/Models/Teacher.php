<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Teacher extends Model
{
    use HasUuids;

    protected $fillable = [
        'school_id',
        'user_id',
        'nip',
        'name',
        'gender',
        'birth_place',
        'birth_date',
        'address',
        'phone',
        'status',
    ];

    protected $casts = [
        'birth_date' => 'date',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
