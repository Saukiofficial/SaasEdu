<?php

namespace App\Repositories;

use App\Models\Blog;
use App\Repositories\Contracts\BlogRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class BlogRepository implements BlogRepositoryInterface
{
    public function getAllPaginated(int $perPage = 10, ?string $search = null, ?string $status = null): LengthAwarePaginator
    {
        $query = Blog::query()->latest();

        if ($search) {
            $query->where('title', 'like', "%{$search}%");
        }

        if ($status) {
            $query->where('status', $status);
        }

        return $query->paginate($perPage);
    }

    public function findById(string $id): ?Blog
    {
        return Blog::findOrFail($id);
    }

    public function create(array $data): Blog
    {
        // Pastikan slug unik
        if (isset($data['title']) && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']) . '-' . substr(uniqid(), -4);
        }
        return Blog::create($data);
    }

    public function update(string $id, array $data): Blog
    {
        $blog = $this->findById($id);
        
        if (isset($data['title']) && $blog->title !== $data['title'] && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']) . '-' . substr(uniqid(), -4);
        }

        $blog->update($data);
        return $blog;
    }

    public function delete(string $id): bool
    {
        $blog = $this->findById($id);
        return $blog->delete();
    }
}
