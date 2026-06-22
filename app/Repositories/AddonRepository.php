<?php

namespace App\Repositories;

use App\Models\Addon;
use App\Repositories\Contracts\AddonRepositoryInterface;

class AddonRepository implements AddonRepositoryInterface
{
    public function getAll()
    {
        // Mengurutkan berdasarkan tipe dan harga
        return Addon::orderBy('type', 'asc')->orderBy('price', 'asc')->get();
    }

    public function findById(string $id)
    {
        return Addon::findOrFail($id);
    }

    public function create(array $data)
    {
        return Addon::create($data);
    }

    public function update(string $id, array $data)
    {
        $addon = $this->findById($id);
        $addon->update($data);
        return $addon;
    }

    public function delete(string $id)
    {
        $addon = $this->findById($id);
        return $addon->delete();
    }
}
