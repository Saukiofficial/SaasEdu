<?php

namespace App\Services;

use App\Repositories\Contracts\SubscriptionPackageRepositoryInterface;

class SubscriptionPackageService extends BaseService
{
    protected SubscriptionPackageRepositoryInterface $packageRepository;

    public function __construct(SubscriptionPackageRepositoryInterface $packageRepository)
    {
        $this->packageRepository = $packageRepository;
    }

    public function getPaginatedPackages()
    {
        return $this->packageRepository->getPaginated(10);
    }

    public function createPackage(array $data)
    {
        // Pastikan array features diformat dengan benar
        if (isset($data['features']) && is_string($data['features'])) {
            $data['features'] = array_map('trim', explode(',', $data['features']));
        }
        return $this->packageRepository->create($data);
    }

    public function updatePackage(string $id, array $data)
    {
        if (isset($data['features']) && is_string($data['features'])) {
            $data['features'] = array_map('trim', explode(',', $data['features']));
        }
        return $this->packageRepository->update($id, $data);
    }

    public function deletePackage(string $id)
    {
        return $this->packageRepository->delete($id);
    }
}
