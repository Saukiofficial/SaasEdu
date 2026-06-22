<?php

namespace App\Services;

use App\Repositories\Contracts\AnnouncementRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class AnnouncementService
{
    protected $announcementRepo;

    public function __construct(AnnouncementRepositoryInterface $announcementRepo)
    {
        $this->announcementRepo = $announcementRepo;
    }

    public function getAllAnnouncements(int $perPage = 10)
    {
        return $this->announcementRepo->getAllPaginated($perPage);
    }

    public function createAnnouncement(array $data)
    {
        DB::beginTransaction();
        try {
            $announcement = $this->announcementRepo->create($data);
            DB::commit();
            return $announcement;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error creating announcement: ' . $e->getMessage());
            throw $e;
        }
    }

    public function updateAnnouncement(string $id, array $data)
    {
        DB::beginTransaction();
        try {
            $announcement = $this->announcementRepo->update($id, $data);
            DB::commit();
            return $announcement;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error updating announcement: ' . $e->getMessage());
            throw $e;
        }
    }

    public function deleteAnnouncement(string $id)
    {
        return $this->announcementRepo->delete($id);
    }
}
