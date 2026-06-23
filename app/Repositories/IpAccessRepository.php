<?php

namespace App\Repositories;

use App\Models\IpAccess;
use App\Repositories\Contracts\IpAccessRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class IpAccessRepository implements IpAccessRepositoryInterface
{
    public function getAllPaginated(int $perPage = 15, ?string $search = null, ?string $type = null): LengthAwarePaginator
    {
        $query = IpAccess::query()->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('ip_address', 'like', "%{$search}%")
                  ->orWhere('label', 'like', "%{$search}%");
            });
        }

        if ($type) {
            $query->where('type', $type);
        }

        return $query->paginate($perPage);
    }

    public function findById(string $id): ?IpAccess
    {
        return IpAccess::findOrFail($id);
    }

    public function create(array $data): IpAccess
    {
        return IpAccess::create($data);
    }

    public function update(string $id, array $data): IpAccess
    {
        $ipAccess = $this->findById($id);
        $ipAccess->update($data);
        return $ipAccess;
    }

    public function delete(string $id): bool
    {
        $ipAccess = $this->findById($id);
        return $ipAccess->delete();
    }

    public function toggleStatus(string $id): IpAccess
    {
        $ipAccess = $this->findById($id);
        $ipAccess->update(['is_active' => !$ipAccess->is_active]);
        return $ipAccess;
    }
}