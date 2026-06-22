<?php

namespace App\Models;

use App\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AuditLog extends Model
{
    use HasFactory, UsesUuid;

    // Supaya data audit log tidak bisa di-update (Read-Only dari segi aplikasi)
    const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'module',
        'action',
        'description',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
    ];

    // Relasi ke user yang melakukan aksi
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id')->select('id', 'name', 'email', 'school_id');
    }
}