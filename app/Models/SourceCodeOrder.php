<?php

namespace App\Models;

use App\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SourceCodeOrder extends Model
{
    use HasFactory, UsesUuid;

    protected $fillable = [
        'order_number',
        'user_id',
        'source_code_id',
        'amount',
        'payment_method',
        'status',
        'payment_proof',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();

        // Otomatis generate nomor order unik saat create
        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = 'ORD-SC-' . strtoupper(uniqid());
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function sourceCode(): BelongsTo
    {
        return $this->belongsTo(SourceCode::class);
    }
}
