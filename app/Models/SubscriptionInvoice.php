<?php

namespace App\Models;

use App\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SubscriptionInvoice extends Model
{
    use HasFactory, UsesUuid;

    protected $fillable = [
        'invoice_number',
        'school_id',
        'amount',
        'description',
        'status',
        'due_date',
        'paid_at',
        'payment_method',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'due_date' => 'date',
        'paid_at' => 'datetime',
    ];

    // Auto-generate nomor invoice
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            if (empty($model->invoice_number)) {
                $model->invoice_number = 'INV-SAAS-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -4));
            }
        });
    }

    public function school()
    {
        return $this->belongsTo(School::class, 'school_id');
    }
}
