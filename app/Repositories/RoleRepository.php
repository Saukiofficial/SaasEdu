<?php

namespace App\Repositories;

use App\Models\Role;
use App\Repositories\Contracts\RoleRepositoryInterface;

class RoleRepository implements RoleRepositoryInterface
{
    public function getAllPaginated(int $perPage = 15)
    {
        // Menampilkan role, bisa ditambahkan withCount('users') jika relasi user diaktifkan
        return Role::orderBy('created_at', 'asc')->paginate($perPage);
    }

    public function findById(string $id)
    {
        return Role::findOrFail($id);
    }

    public function create(array $data)
    {
        return Role::create($data);
    }

    public function update(string $id, array $data)
    {
        $role = $this->findById($id);
        $role->update($data);
        return $role;
    }

    public function delete(string $id)
    {
        $role = $this->findById($id);
        
        if ($role->is_system) {
            throw new \Exception("Role bawaan sistem tidak dapat dihapus.");
        }
        
        return $role->delete();
    }
}
