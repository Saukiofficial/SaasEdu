<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Student extends Model
{
    use HasUuids;

    protected $fillable = [
        'school_id',
        'user_id',
        'classroom_id',
        'nis',
        'nisn',
        'name',
        'gender',
        'birth_place',
        'birth_date',
        'address',
        'parent_name',
        'parent_phone',
        'status',
    ];

    protected $casts = [
        'birth_date' => 'date',
    ];

     public function guardians()
    {
        return $this->belongsToMany(Guardian::class)
                    ->withPivot('relationship')
                    ->withTimestamps();
    }
    
    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function classroom(): BelongsTo
    {
        return $this->belongsTo(Classroom::class);
    }
}
