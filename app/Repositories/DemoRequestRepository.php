<?php

namespace App\Repositories;

use App\Models\DemoRequest;
use App\Repositories\Contracts\DemoRequestRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class DemoRequestRepository implements DemoRequestRepositoryInterface
{
    public function getAllPaginated(int $perPage = 10, ?string $search = null, ?string $status = null): LengthAwarePaginator
    {
        $query = DemoRequest::query()->latest();

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

    public function findById(string $id): ?DemoRequest
    {
        return DemoRequest::findOrFail($id);
    }

    public function create(array $data): DemoRequest
    {
        return DemoRequest::create($data);
    }

    public function update(string $id, array $data): DemoRequest
    {
        $demoRequest = $this->findById($id);
        $demoRequest->update($data);
        return $demoRequest;
    }

    public function delete(string $id): bool
    {
        $demoRequest = $this->findById($id);
        return $demoRequest->delete();
    }

    public function updateStatus(string $id, string $status): DemoRequest
    {
        $demoRequest = $this->findById($id);
        $demoRequest->update(['status' => $status]);
        return $demoRequest;
    }
}
