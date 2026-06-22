<?php

namespace App\Services;

use App\Repositories\Contracts\AddonRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class AddonService
{
    protected $addonRepo;

    public function __construct(AddonRepositoryInterface $addonRepo)
    {
        $this->addonRepo = $addonRepo;
    }

    public function getAllAddons()
    {
        return $this->addonRepo->getAll();
    }

    public function createAddon(array $data)
    {
        DB::beginTransaction();
        try {
            // Null-kan value jika tipenya bukan storage atau student yang butuh angka pasti
            if (!in_array($data['type'], ['storage', 'student'])) {
                $data['value'] = null;
            }

            $addon = $this->addonRepo->create($data);
            DB::commit();
            return $addon;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error creating addon: ' . $e->getMessage());
            throw $e;
        }
    }

    public function updateAddon(string $id, array $data)
    {
        DB::beginTransaction();
        try {
            if (!in_array($data['type'], ['storage', 'student'])) {
                $data['value'] = null;
            }

            $addon = $this->addonRepo->update($id, $data);
            DB::commit();
            return $addon;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error updating addon: ' . $e->getMessage());
            throw $e;
        }
    }

    public function deleteAddon(string $id)
    {
        return $this->addonRepo->delete($id);
    }
}