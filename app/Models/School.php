<?php

namespace App\Models;
use App\Models\TenantSetting;
use App\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class School extends Model
{
    use HasFactory, UsesUuid;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'status',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    // Mengambil data subscription yang paling baru
    public function latestSubscription(): HasOne
    {
        return $this->hasOne(Subscription::class)->latestOfMany();
    }

        public function tenantSetting(): HasOne
    {
        return $this->hasOne(TenantSetting::class, 'school_id');
    }
}
