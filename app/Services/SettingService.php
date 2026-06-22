<?php

namespace App\Services;

use App\Repositories\Contracts\SettingRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class SettingService
{
    protected $settingRepo;

    public function __construct(SettingRepositoryInterface $settingRepo)
    {
        $this->settingRepo = $settingRepo;
    }

    public function getAllSettingsAsKeyValue()
    {
        return $this->settingRepo->getAll();
    }

    public function updateSettings(array $data)
    {
        DB::beginTransaction();
        try {
            // Data adalah array associative: ['app_name' => 'AkademiaOS', 'maintenance_mode' => '0']
            $this->settingRepo->updateMultiple($data);
            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error updating system settings: ' . $e->getMessage());
            throw $e;
        }
    }
}
