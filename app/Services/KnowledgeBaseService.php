<?php

namespace App\Services;

use App\Repositories\Contracts\KnowledgeBaseRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;
use Illuminate\Support\Str;

class KnowledgeBaseService
{
    protected $kbRepository;

    public function __construct(KnowledgeBaseRepositoryInterface $kbRepository)
    {
        $this->kbRepository = $kbRepository;
    }

    public function getAllArticles(int $perPage = 10)
    {
        return $this->kbRepository->getAllPaginated($perPage);
    }

    public function createArticle(array $data)
    {
        DB::beginTransaction();
        try {
            // Memastikan slug valid
            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['title']) . '-' . substr(uniqid(), -5);
            }

            $article = $this->kbRepository->create($data);
            DB::commit();
            return $article;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error creating knowledge base article: ' . $e->getMessage());
            throw $e;
        }
    }

    public function updateArticle(string $id, array $data)
    {
        DB::beginTransaction();
        try {
            if (!empty($data['title']) && empty($data['slug'])) {
                $data['slug'] = Str::slug($data['title']) . '-' . substr(uniqid(), -5);
            }

            $article = $this->kbRepository->update($id, $data);
            DB::commit();
            return $article;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error updating knowledge base article: ' . $e->getMessage());
            throw $e;
        }
    }

    public function deleteArticle(string $id)
    {
        return $this->kbRepository->delete($id);
    }
}