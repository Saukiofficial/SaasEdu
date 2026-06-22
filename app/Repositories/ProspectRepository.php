<?php

namespace App\Repositories;

use App\Models\Prospect;
use App\Repositories\Contracts\ProspectRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class ProspectRepository implements ProspectRepositoryInterface
{
    public function getAllPaginated(int $perPage = 10, ?string $search = null, ?string $status = null): LengthAwarePaginator
    {
        $query = Prospect::query()->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('school_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        return $query->paginate($perPage);
    }

    public function findById(string $id): ?Prospect
    {
        return Prospect::findOrFail($id);
    }

    public function create(array $data): Prospect
    {
        return Prospect::create($data);
    }

    public function update(string $id, array $data): Prospect
    {
        $prospect = $this->findById($id);
        $prospect->update($data);
        return $prospect;
    }

    public function delete(string $id): bool
    {
        $prospect = $this->findById($id);
        return $prospect->delete();
    }

    public function updateStatus(string $id, string $status): Prospect
    {
        $prospect = $this->findById($id);
        $prospect->update(['status' => $status]);
        return $prospect;
    }
}