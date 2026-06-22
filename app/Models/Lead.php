<?php

namespace App\Models;

use App\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Lead extends Model
{
    // Menggunakan trait UsesUuid untuk Primary Key berupa UUID
    use HasFactory, UsesUuid;

    protected $fillable = [
        'school_name',
        'contact_person',
        'email',
        'phone',
        'status',
        'notes'
    ];
}