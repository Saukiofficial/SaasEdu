<?php

namespace App\Models;

use App\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prospect extends Model
{
    use HasFactory, UsesUuid;

    protected $fillable = [
        'name',
        'school_name',
        'email',
        'phone',
        'status',
        'notes',
    ];
}