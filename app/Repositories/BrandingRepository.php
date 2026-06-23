<?php

namespace App\Repositories;

use App\Models\Branding;
use App\Repositories\Contracts\BrandingRepositoryInterface;

class BrandingRepository implements BrandingRepositoryInterface
{
    public function getGlobalBranding(): Branding
    {
        // Ambil data branding untuk Super Admin (school_id = null)
        // Jika belum ada, buatkan data default secara otomatis
        return Branding::firstOrCreate(
            ['school_id' => null],
            [
                'app_name' => 'AkademiaOS',
                'primary_color' => '#B8935F',
            ]
        );
    }

    public function updateGlobalBranding(array $data): Branding
    {
        $branding = $this->getGlobalBranding();
        $branding->update($data);
        return $branding;
    }
}