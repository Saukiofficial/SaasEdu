<?php

// Perintah: Buat manual file ini di dalam folder 'app/Services'

namespace App\Services;

use App\Repositories\Contracts\LeadRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class LeadService
{
    protected $leadRepository;

    public function __construct(LeadRepositoryInterface $leadRepository)
    {
        $this->leadRepository = $leadRepository;
    }

    public function getAllLeads(int $perPage = 10)
    {
        return $this->leadRepository->getAllPaginated($perPage);
    }

    public function createLead(array $data)
    {
        DB::beginTransaction();
        try {
            $lead = $this->leadRepository->create($data);
            DB::commit();
            return $lead;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Gagal membuat lead baru: ' . $e->getMessage());
            throw $e;
        }
    }

    public function updateLeadStatus(string $id, string $status)
    {
        DB::beginTransaction();
        try {
            $lead = $this->leadRepository->updateStatus($id, $status);
            
            // TODO: Tambahkan logic tambahan di sini.
            // Misalnya: Trigger notifikasi email ke sales jika status berubah menjadi 'demo_scheduled'
            
            DB::commit();
            return $lead;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Gagal memperbarui status lead: ' . $e->getMessage());
            throw $e;
        }
    }

    public function deleteLead(string $id)
    {
        return $this->leadRepository->delete($id);
    }
}