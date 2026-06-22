<?php

namespace App\Repositories;

use App\Models\Lead;
use App\Repositories\Contracts\LeadRepositoryInterface;

class LeadRepository implements LeadRepositoryInterface
{
    public function getAllPaginated(int $perPage = 10)
    {
        // Mengambil data prospek, diurutkan dari yang terbaru
        return Lead::orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function findById(string $id)
    {
        return Lead::findOrFail($id);
    }

    public function create(array $data)
    {
        return Lead::create($data);
    }

    public function update(string $id, array $data)
    {
        $lead = $this->findById($id);
        $lead->update($data);
        return $lead;
    }

    public function delete(string $id)
    {
        $lead = $this->findById($id);
        return $lead->delete();
    }

    public function updateStatus(string $id, string $status)
    {
        $lead = $this->findById($id);
        $lead->update(['status' => $status]);
        return $lead;
    }
}