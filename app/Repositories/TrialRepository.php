<?php

namespace App\Repositories;

use App\Models\Trial;
use App\Repositories\Contracts\TrialRepositoryInterface;

class TrialRepository implements TrialRepositoryInterface
{
    public function getAllPaginated(int $perPage = 10)
    {
        return Trial::orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function findById(string $id)
    {
        return Trial::findOrFail($id);
    }

    public function create(array $data)
    {
        return Trial::create($data);
    }

    public function update(string $id, array $data)
    {
        $trial = $this->findById($id);
        $trial->update($data);
        return $trial;
    }

    public function delete(string $id)
    {
        $trial = $this->findById($id);
        return $trial->delete();
    }

    public function updateStatus(string $id, string $status)
    {
        $trial = $this->findById($id);
        $trial->update(['status' => $status]);
        return $trial;
    }
}
