<?php

namespace App\Repositories\Contracts;

interface AnnouncementRepositoryInterface extends BaseRepositoryInterface
{
    public function getPaginated(int $perPage = 10, string $search = null);
    public function getActiveAnnouncements(int $limit = 5);
}
