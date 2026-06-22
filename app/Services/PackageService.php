<?php

namespace App\Services;

use App\Repositories\Contracts\PackageRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class PackageService
{
    protected $packageRepo;

    public function __construct(PackageRepositoryInterface $packageRepo)
    {
        $this->packageRepo = $packageRepo;
    }

    public function getAllPackages()
    {
        return $this->packageRepo->getAll();
    }

    public function createPackage(array $data)
    {
        DB::beginTransaction();
        try {
            // Memastikan features tersimpan sebagai array
            if (!isset($data['features']) || !is_array($data['features'])) {
                $data['features'] = [];
            }

            $package = $this->packageRepo->create($data);
            DB::commit();
            return $package;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error creating package: ' . $e->getMessage());
            throw $e;
        }
    }

    public function updatePackage(string $id, array $data)
    {
        DB::beginTransaction();
        try {
            if (!isset($data['features']) || !is_array($data['features'])) {
                $data['features'] = [];
            }

            $package = $this->packageRepo->update($id, $data);
            DB::commit();
            return $package;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error updating package: ' . $e->getMessage());
            throw $e;
        }
    }

    public function deletePackage(string $id)
    {
        return $this->packageRepo->delete($id);
    }
}
