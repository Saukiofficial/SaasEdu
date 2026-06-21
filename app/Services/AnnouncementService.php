<?php

namespace App\Services;

use App\Repositories\Contracts\AnnouncementRepositoryInterface;

class AnnouncementService extends BaseService
{
    protected AnnouncementRepositoryInterface $announcementRepository;

    public function __construct(AnnouncementRepositoryInterface $announcementRepository)
    {
        $this->announcementRepository = $announcementRepository;
    }

    public function getAnnouncements(string $search = null)
    {
        return $this->announcementRepository->getPaginated(10, $search);
    }

    public function createAnnouncement(array $data)
    {
        return $this->announcementRepository->create($data);
    }

    public function updateAnnouncement(string $id, array $data)
    {
        return $this->announcementRepository->update($id, $data);
    }

    public function deleteAnnouncement(string $id)
    {
        return $this->announcementRepository->delete($id);
    }
}
