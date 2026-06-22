<?php

namespace App\Repositories;

use App\Models\Announcement;
use App\Repositories\Contracts\AnnouncementRepositoryInterface;

class AnnouncementRepository implements AnnouncementRepositoryInterface
{
    public function getAllPaginated(int $perPage = 10)
    {
        return Announcement::orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function findById(string $id)
    {
        return Announcement::findOrFail($id);
    }

    public function create(array $data)
    {
        return Announcement::create($data);
    }

    public function update(string $id, array $data)
    {
        $announcement = $this->findById($id);
        $announcement->update($data);
        return $announcement;
    }

    public function delete(string $id)
    {
        $announcement = $this->findById($id);
        return $announcement->delete();
    }

    public function updateStatus(string $id, bool $isActive)
    {
        $announcement = $this->findById($id);
        $announcement->update(['is_active' => $isActive]);
        return $announcement;
    }
}