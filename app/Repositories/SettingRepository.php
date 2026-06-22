<?php

namespace App\Repositories;

use App\Models\Setting;
use App\Repositories\Contracts\SettingRepositoryInterface;

class SettingRepository implements SettingRepositoryInterface
{
    public function getAll()
    {
        // Mengembalikan semua setting dalam bentuk key-value array yang rapi
        return Setting::pluck('value', 'key')->toArray();
    }

    public function getByKey(string $key)
    {
        return Setting::where('key', $key)->first();
    }

    public function updateOrCreate(string $key, $value, string $group = 'general')
    {
        return Setting::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'group' => $group]
        );
    }

    public function updateMultiple(array $settings)
    {
        foreach ($settings as $key => $value) {
            // Tentukan group berdasarkan prefix key (opsional)
            $group = 'general';
            if (str_contains($key, 'brand_')) $group = 'branding';
            if (str_contains($key, 'contact_')) $group = 'contact';

            $this->updateOrCreate($key, $value, $group);
        }
        
        return true;
    }
}
