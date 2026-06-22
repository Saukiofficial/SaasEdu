<?php

namespace App\Repositories;

use App\Models\Faq;
use App\Repositories\Contracts\FaqRepositoryInterface;

class FaqRepository implements FaqRepositoryInterface
{
    public function getAllPaginated(int $perPage = 10)
    {
        // Diurutkan berdasarkan kategori lalu berdasarkan urutan (order_num)
        return Faq::orderBy('category', 'asc')->orderBy('order_num', 'asc')->paginate($perPage);
    }

    public function findById(string $id)
    {
        return Faq::findOrFail($id);
    }

    public function create(array $data)
    {
        return Faq::create($data);
    }

    public function update(string $id, array $data)
    {
        $faq = $this->findById($id);
        $faq->update($data);
        return $faq;
    }

    public function delete(string $id)
    {
        $faq = $this->findById($id);
        return $faq->delete();
    }

    public function updateStatus(string $id, bool $isActive)
    {
        $faq = $this->findById($id);
        $faq->update(['is_active' => $isActive]);
        return $faq;
    }
}
