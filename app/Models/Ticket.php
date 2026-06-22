<?php

namespace App\Models;

use App\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ticket extends Model
{
    use HasFactory, UsesUuid;

    protected $fillable = [
        'ticket_number',
        'school_id',
        'subject',
        'description',
        'priority',
        'status',
    ];

    // Membuat nomor tiket otomatis saat create
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            if (empty($model->ticket_number)) {
                $model->ticket_number = 'TKT-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -4));
            }
        });
    }

    public function school()
    {
        return $this->belongsTo(School::class, 'school_id');
    }
}
