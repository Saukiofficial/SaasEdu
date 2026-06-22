<?php

namespace App\Services;

use App\Repositories\Contracts\RoleRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class RoleService
{
    protected $roleRepo;

    public function __construct(RoleRepositoryInterface $roleRepo)
    {
        $this->roleRepo = $roleRepo;
    }

    public function getAllRoles(int $perPage = 15)
    {
        return $this->roleRepo->getAllPaginated($perPage);
    }

    public function createRole(array $data)
    {
        DB::beginTransaction();
        try {
            // Pastikan permissions tersimpan sebagai array
            if (!isset($data['permissions'])) {
                $data['permissions'] = [];
            }
            $data['is_system'] = false; // Role buatan user selalu false

            $role = $this->roleRepo->create($data);
            DB::commit();
            return $role;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error creating Role: ' . $e->getMessage());
            throw $e;
        }
    }

    public function updateRole(string $id, array $data)
    {
        DB::beginTransaction();
        try {
            if (!isset($data['permissions'])) {
                $data['permissions'] = [];
            }

            $role = $this->roleRepo->update($id, $data);
            DB::commit();
            return $role;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error updating Role: ' . $e->getMessage());
            throw $e;
        }
    }

    public function deleteRole(string $id)
    {
        return $this->roleRepo->delete($id);
    }
}