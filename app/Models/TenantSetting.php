<?php

namespace App\Models;

use App\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TenantSetting extends Model
{
    use HasFactory, UsesUuid;

    protected $fillable = [
        'school_id',
        'max_students',
        'storage_limit_mb',
        'custom_domain',
        'enable_cbt',
        'enable_ppdb',
        'enable_lms',
        'enable_finance',
        'enable_student_affairs',
        'enable_facilities',
    ];

    protected $casts = [
        'enable_cbt' => 'boolean',
        'enable_ppdb' => 'boolean',
        'enable_lms' => 'boolean',
        'enable_finance' => 'boolean',
        'enable_student_affairs' => 'boolean', // Tambahan baru
        'enable_facilities' => 'boolean',
    ];

    // Relasi ke model School (Pastikan model School Anda sudah ada)
    public function school()
    {
        return $this->belongsTo(School::class, 'school_id');
    }
}
