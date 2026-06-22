<?php

namespace App\Services;

use App\Repositories\Contracts\DomainRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class DomainService
{
    protected $domainRepo;

    public function __construct(DomainRepositoryInterface $domainRepo)
    {
        $this->domainRepo = $domainRepo;
    }

    public function getAllDomains(int $perPage = 15)
    {
        return $this->domainRepo->getAllPaginated($perPage);
    }

    public function updateDomain(string $schoolId, ?string $customDomain)
    {
        DB::beginTransaction();
        try {
            // Jika string kosong, ubah menjadi null agar database bersih
            $cleanDomain = empty(trim($customDomain)) ? null : trim($customDomain);
            
            // Format validasi sederhana: Hapus 'http://' atau 'https://' jika user salah input
            if ($cleanDomain) {
                $cleanDomain = preg_replace('#^https?://#', '', $cleanDomain);
                $cleanDomain = rtrim($cleanDomain, '/');
            }

            $setting = $this->domainRepo->updateCustomDomain($schoolId, $cleanDomain);
            
            DB::commit();
            return $setting;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error updating Custom Domain: ' . $e->getMessage());
            throw $e;
        }
    }
}