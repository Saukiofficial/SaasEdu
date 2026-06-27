<?php

namespace App\Models;

use App\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str; // PENTING: Tambahkan ini

class School extends Model
{
    use HasFactory, UsesUuid;

    // Pastikan 'subdomain' masuk ke dalam array fillable
    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'status',
        'subdomain' // PENTING: Tambahkan ini
    ];

    // Relasi yang sudah ada...
    public function users() {
        return $this->hasMany(User::class, 'school_id');
    }

    public function latestSubscription() {
        return $this->hasOne(Subscription::class, 'school_id')->latestOfMany();
    }

    public function tenantSetting() {
        return $this->hasOne(TenantSetting::class, 'school_id');
    }

    // --- PENTING: Tambahkan Fungsi Boot Ini ---
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($school) {
            // Jika subdomain kosong saat dibuat, generate otomatis dari nama sekolah
            if (empty($school->subdomain)) {
                // Contoh: "SMAN 1 Jakarta" -> "sman1jakarta"
                $baseSubdomain = Str::slug($school->name, '');
                $subdomain = $baseSubdomain;
                $counter = 1;
                
                // Pengecekan agar tidak ada subdomain yang sama persis di database
                while (static::where('subdomain', $subdomain)->exists()) {
                    $subdomain = $baseSubdomain . $counter;
                    $counter++;
                }
                
                $school->subdomain = $subdomain;
            }
        });
    }
}