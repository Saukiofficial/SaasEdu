<?php

namespace App\Models;

use App\Traits\UsesUuid;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admission extends Model
{
    use HasFactory, UsesUuid, BelongsToTenant;

    protected $fillable = [
        'school_id',
        'academic_year_id',
        'registration_number',
        'full_name',
        'nisn',
        'email',
        'phone',
        'previous_school',
        'address',
        'status',
    ];
}