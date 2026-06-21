<?php

namespace App\Traits;

use App\Models\School;
use App\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

trait BelongsToTenant
{
    /**
     * Boot trait untuk menambahkan global scope dan event model.
     */
    protected static function bootBelongsToTenant(): void
    {
        // 1. Tambahkan Global Scope secara otomatis saat model di-load
        static::addGlobalScope(new TenantScope);

        // 2. Set otomatis school_id saat proses 'creating' data baru
        static::creating(function ($model) {
            if (Auth::hasUser()) {
                $user = Auth::user();
                // Jika user login punya school_id dan model belum diset school_id-nya, maka isikan
                if ($user->school_id !== null && empty($model->school_id)) {
                    $model->school_id = $user->school_id;
                }
            }
        });
    }

    /**
     * Relasi default ke model School
     */
    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
}