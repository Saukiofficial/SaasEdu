<?php

namespace App\Repositories;

use App\Models\LandingProduct;
use App\Repositories\Contracts\LandingProductRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class LandingProductRepository implements LandingProductRepositoryInterface
{
    public function getAllPaginated(int $perPage = 10, ?string $search = null): LengthAwarePaginator
    {
        $query = LandingProduct::query()->latest();

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        return $query->paginate($perPage);
    }

    public function findById(string $id): ?LandingProduct
    {
        return LandingProduct::findOrFail($id);
    }

    public function create(array $data): LandingProduct
    {
        return LandingProduct::create($data);
    }

    public function update(string $id, array $data): LandingProduct
    {
        $product = $this->findById($id);
        $product->update($data);
        return $product;
    }

    public function delete(string $id): bool
    {
        $product = $this->findById($id);
        return $product->delete();
    }
}