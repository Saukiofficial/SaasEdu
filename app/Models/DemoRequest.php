<?php

namespace App\Models;

use App\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemoRequest extends Model
{
    use HasFactory, UsesUuid;

    protected $fillable = [
        'name',
        'school_name',
        'email',
        'phone',
        'requested_date',
        'status',
        'notes',
    ];

    protected $casts = [
        'requested_date' => 'date',
    ];
}
