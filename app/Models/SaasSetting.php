<?php

namespace App\Models;

use App\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaasSetting extends Model
{
    use HasFactory, UsesUuid;

    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
    ];
}