<?php

namespace App\Services;

use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Exception;

class UserService
{
    protected $userRepo;

    public function __construct(UserRepositoryInterface $userRepo)
    {
        $this->userRepo = $userRepo;
    }

    public function getAllUsers(int $perPage = 15)
    {
        return $this->userRepo->getAllPaginatedWithSchool($perPage);
    }

    public function createSaaSStaff(array $data)
    {
        DB::beginTransaction();
        try {
            // Hash password sebelum disimpan
            $data['password'] = Hash::make($data['password']);
            
            // Memastikan staff SaaS tidak terikat ke sekolah mana pun
            $data['school_id'] = null;

            $user = $this->userRepo->create($data);
            
            DB::commit();
            return $user;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error creating SaaS Staff: ' . $e->getMessage());
            throw $e;
        }
    }

    public function deleteUser(string $id)
    {
        return $this->userRepo->delete($id);
    }
}
