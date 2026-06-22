<?php

namespace App\Services;

use App\Repositories\Contracts\TrialRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class TrialService
{
    protected $trialRepository;

    public function __construct(TrialRepositoryInterface $trialRepository)
    {
        $this->trialRepository = $trialRepository;
    }

    public function getAllTrials(int $perPage = 10)
    {
        return $this->trialRepository->getAllPaginated($perPage);
    }

    public function createTrial(array $data)
    {
        DB::beginTransaction();
        try {
            $trial = $this->trialRepository->create($data);
            DB::commit();
            return $trial;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error creating trial: ' . $e->getMessage());
            throw $e;
        }
    }

    public function updateTrialStatus(string $id, string $status)
    {
        DB::beginTransaction();
        try {
            $trial = $this->trialRepository->updateStatus($id, $status);
            DB::commit();
            return $trial;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error updating trial status: ' . $e->getMessage());
            throw $e;
        }
    }

    public function deleteTrial(string $id)
    {
        return $this->trialRepository->delete($id);
    }
}