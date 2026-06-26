<?php

namespace App\Repositories;

use App\Models\SourceCode;
use App\Repositories\Contracts\SourceCodeRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class SourceCodeRepository implements SourceCodeRepositoryInterface
{
    public function getAllPaginated(int $perPage = 10, ?string $search = null): LengthAwarePaginator
    {
        $query = SourceCode::query()->latest();

        if ($search) {
            $query->where('title', 'like', "%{$search}%");
        }

        return $query->paginate($perPage);
    }

    public function findById(string $id): ?SourceCode
    {
        return SourceCode::findOrFail($id);
    }

    public function create(array $data): SourceCode
    {
        return SourceCode::create($data);
    }

    public function update(string $id, array $data): SourceCode
    {
        $sourceCode = $this->findById($id);
        $sourceCode->update($data);
        return $sourceCode;
    }

    public function delete(string $id): bool
    {
        $sourceCode = $this->findById($id);
        return $sourceCode->delete();
    }
}
