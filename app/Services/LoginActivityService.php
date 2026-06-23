<?php

namespace App\Services;

use App\Repositories\Contracts\LoginActivityRepositoryInterface;
use Illuminate\Support\Facades\Log;

class LoginActivityService
{
    protected $loginActivityRepository;

    public function __construct(LoginActivityRepositoryInterface $loginActivityRepository)
    {
        $this->loginActivityRepository = $loginActivityRepository;
    }

    public function getPaginatedActivities(int $perPage = 15, ?string $search = null, ?string $status = null)
    {
        return $this->loginActivityRepository->getAllPaginated($perPage, $search, $status);
    }

    public function recordLogin(array $data)
    {
        try {
            return $this->loginActivityRepository->logActivity($data);
        } catch (\Exception $e) {
            Log::error("Gagal mencatat Login Activity: " . $e->getMessage());
        }
    }

    public function clearOldLogs(int $daysToKeep = 30)
    {
        try {
            return $this->loginActivityRepository->clearOldLogs($daysToKeep);
        } catch (\Exception $e) {
            Log::error("Gagal membersihkan log lama: " . $e->getMessage());
            throw $e;
        }
    }
}