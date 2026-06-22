<?php

namespace App\Repositories;

use App\Models\SubscriptionPackage;
use App\Repositories\Contracts\PackageRepositoryInterface;

class PackageRepository implements PackageRepositoryInterface
{
    public function getAll()
    {
        // Mengambil semua paket, urut berdasarkan harga
        return SubscriptionPackage::orderBy('price', 'asc')->get();
    }

    public function findById(string $id)
    {
        return SubscriptionPackage::findOrFail($id);
    }

    public function create(array $data)
    {
        return SubscriptionPackage::create($data);
    }

    public function update(string $id, array $data)
    {
        $package = $this->findById($id);
        $package->update($data);
        return $package;
    }

    public function delete(string $id)
    {
        $package = $this->findById($id);
        return $package->delete();
    }
}