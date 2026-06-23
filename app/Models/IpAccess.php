<?php

namespace App\Models;

use App\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IpAccess extends Model
{
    use HasFactory, UsesUuid;

    protected $table = 'ip_accesses';

    protected $fillable = [
        'ip_address',
        'label',
        'type',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
