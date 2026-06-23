<?php

namespace App\Services;

use App\Repositories\Contracts\BrandingRepositoryInterface;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class BrandingService
{
    protected $brandingRepository;

    public function __construct(BrandingRepositoryInterface $brandingRepository)
    {
        $this->brandingRepository = $brandingRepository;
    }

    public function getGlobalBranding()
    {
        return $this->brandingRepository->getGlobalBranding();
    }

    public function updateBranding(array $data, $files)
    {
        try {
            $branding = $this->getGlobalBranding();
            $updateData = [
                'app_name' => $data['app_name'],
                'primary_color' => $data['primary_color'],
            ];

            // Proses Upload Gambar jika ada
            if (isset($files['logo'])) {
                if ($branding->logo_url) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $branding->logo_url));
                }
                $path = $files['logo']->store('branding', 'public');
                $updateData['logo_url'] = '/storage/' . $path;
            }

            if (isset($files['favicon'])) {
                if ($branding->favicon_url) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $branding->favicon_url));
                }
                $path = $files['favicon']->store('branding', 'public');
                $updateData['favicon_url'] = '/storage/' . $path;
            }

            if (isset($files['login_bg'])) {
                if ($branding->login_bg_url) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $branding->login_bg_url));
                }
                $path = $files['login_bg']->store('branding', 'public');
                $updateData['login_bg_url'] = '/storage/' . $path;
            }

            return $this->brandingRepository->updateGlobalBranding($updateData);
        } catch (\Exception $e) {
            Log::error("Gagal memperbarui Branding: " . $e->getMessage());
            throw $e;
        }
    }
}