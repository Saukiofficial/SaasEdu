<?php

namespace App\Services;

use App\Repositories\Contracts\StaffRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Exception;

class StaffService
{
    protected $staffRepo;

    public function __construct(StaffRepositoryInterface $staffRepo)
    {
        $this->staffRepo = $staffRepo;
    }

    public function getAllStaff(int $perPage = 15)
    {
        return $this->staffRepo->getAllPaginated($perPage);
    }

    public function createStaff(array $data, string $roleName)
    {
        DB::beginTransaction();
        try {
            // Hash password
            $data['password'] = Hash::make($data['password']);
            $data['school_id'] = null; // Pastikan dia adalah internal staff

            $staff = $this->staffRepo->create($data);
            
            // Assign Spatie Role
            $staff->assignRole($roleName);

            DB::commit();
            return $staff;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error creating staff: ' . $e->getMessage());
            throw $e;
        }
    }

    public function updateStaff(string $id, array $data, string $roleName)
    {
        DB::beginTransaction();
        try {
            // Jika password diisi, maka update. Jika kosong, hapus dari array update.
            if (!empty($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            } else {
                unset($data['password']);
            }

            $staff = $this->staffRepo->update($id, $data);
            
            // Sync Spatie Role (Menghapus role lama dan mengganti dengan yang baru)
            $staff->syncRoles([$roleName]);

            DB::commit();
            return $staff;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error updating staff: ' . $e->getMessage());
            throw $e;
        }
    }

    public function deleteStaff(string $id)
    {
        // Cegah menghapus diri sendiri
        if (auth()->id() == $id) {
            throw new Exception("Anda tidak dapat menghapus akun Anda sendiri.");
        }

        return $this->staffRepo->delete($id);
    }
}
