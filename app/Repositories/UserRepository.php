<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;

class UserRepository implements UserRepositoryInterface
{
    public function getAllPaginatedWithSchool(int $perPage = 15)
    {
        // Memuat relasi school (sekolah) dan mengurutkan user terbaru
        return User::with('school')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function findById(string $id)
    {
        return User::findOrFail($id);
    }

    public function create(array $data)
    {
        return User::create($data);
    }

    public function update(string $id, array $data)
    {
        $user = $this->findById($id);
        $user->update($data);
        return $user;
    }

    public function delete(string $id)
    {
        $user = $this->findById($id);
        return $user->delete();
    }
}