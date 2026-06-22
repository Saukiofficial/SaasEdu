<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Contracts\StaffRepositoryInterface;

class StaffRepository implements StaffRepositoryInterface
{
    public function getAllPaginated(int $perPage = 15)
    {
        // Mengambil semua user yang school_id nya null (internal staff) beserta rolenya
        return User::with('roles')
            ->whereNull('school_id')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function findById(string $id)
    {
        return User::whereNull('school_id')->findOrFail($id);
    }

    public function create(array $data)
    {
        return User::create($data);
    }

    public function update(string $id, array $data)
    {
        $staff = $this->findById($id);
        $staff->update($data);
        return $staff;
    }

    public function delete(string $id)
    {
        $staff = $this->findById($id);
        return $staff->delete();
    }
}