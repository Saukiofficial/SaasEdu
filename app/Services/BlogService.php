<?php

namespace App\Services;

use App\Repositories\Contracts\BlogRepositoryInterface;
use Illuminate\Support\Facades\Log;

class BlogService
{
    protected $blogRepository;

    public function __construct(BlogRepositoryInterface $blogRepository)
    {
        $this->blogRepository = $blogRepository;
    }

    public function getPaginatedBlogs(int $perPage = 10, ?string $search = null, ?string $status = null)
    {
        return $this->blogRepository->getAllPaginated($perPage, $search, $status);
    }

    public function createBlog(array $data)
    {
        try {
            return $this->blogRepository->create($data);
        } catch (\Exception $e) {
            Log::error("Gagal membuat Blog: " . $e->getMessage());
            throw $e;
        }
    }

    public function updateBlog(string $id, array $data)
    {
        try {
            return $this->blogRepository->update($id, $data);
        } catch (\Exception $e) {
            Log::error("Gagal memperbarui Blog: " . $e->getMessage());
            throw $e;
        }
    }

    public function deleteBlog(string $id)
    {
        try {
            return $this->blogRepository->delete($id);
        } catch (\Exception $e) {
            Log::error("Gagal menghapus Blog: " . $e->getMessage());
            throw $e;
        }
    }
}