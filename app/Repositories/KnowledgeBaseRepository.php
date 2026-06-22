<?php

namespace App\Repositories;

use App\Models\KnowledgeBase;
use App\Repositories\Contracts\KnowledgeBaseRepositoryInterface;

class KnowledgeBaseRepository implements KnowledgeBaseRepositoryInterface
{
    public function getAllPaginated(int $perPage = 10)
    {
        return KnowledgeBase::orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function findById(string $id)
    {
        return KnowledgeBase::findOrFail($id);
    }

    public function create(array $data)
    {
        return KnowledgeBase::create($data);
    }

    public function update(string $id, array $data)
    {
        $article = $this->findById($id);
        $article->update($data);
        return $article;
    }

    public function delete(string $id)
    {
        $article = $this->findById($id);
        return $article->delete();
    }
}
