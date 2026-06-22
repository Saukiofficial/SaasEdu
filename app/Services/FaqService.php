<?php

namespace App\Services;

use App\Repositories\Contracts\FaqRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class FaqService
{
    protected $faqRepo;

    public function __construct(FaqRepositoryInterface $faqRepo)
    {
        $this->faqRepo = $faqRepo;
    }

    public function getAllFaqs(int $perPage = 10)
    {
        return $this->faqRepo->getAllPaginated($perPage);
    }

    public function createFaq(array $data)
    {
        DB::beginTransaction();
        try {
            $faq = $this->faqRepo->create($data);
            DB::commit();
            return $faq;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error creating FAQ: ' . $e->getMessage());
            throw $e;
        }
    }

    public function updateFaq(string $id, array $data)
    {
        DB::beginTransaction();
        try {
            $faq = $this->faqRepo->update($id, $data);
            DB::commit();
            return $faq;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error updating FAQ: ' . $e->getMessage());
            throw $e;
        }
    }

    public function deleteFaq(string $id)
    {
        return $this->faqRepo->delete($id);
    }
}