<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentMutation extends Model
{
    use HasUuids;

    protected $fillable = [
        'school_id',
        'student_id',
        'type',
        'mutation_date',
        'reference_number',
        'origin_school',
        'destination_school',
        'reason',
    ];

    protected $casts = [
        'mutation_date' => 'date',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}