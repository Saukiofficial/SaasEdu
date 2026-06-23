<?php

namespace App\Repositories;

use App\Models\LoginActivity;
use App\Repositories\Contracts\LoginActivityRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Carbon\Carbon;

class LoginActivityRepository implements LoginActivityRepositoryInterface
{
    public function getAllPaginated(int $perPage = 15, ?string $search = null, ?string $status = null): LengthAwarePaginator
    {
        // Eager load relasi user dan school agar efisien
        $query = LoginActivity::with(['user.school'])->latest('login_at');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('email', 'like', "%{$search}%")
                  ->orWhere('ip_address', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        return $query->paginate($perPage);
    }

    public function logActivity(array $data): LoginActivity
    {
        return LoginActivity::create($data);
    }

    public function clearOldLogs(int $daysToKeep = 30): int
    {
        $date = Carbon::now()->subDays($daysToKeep);
        return LoginActivity::where('login_at', '<', $date)->delete();
    }
}