<?php

namespace App\Repositories;

use App\Models\Announcement;
use App\Repositories\Contracts\AnnouncementRepositoryInterface;

class AnnouncementRepository extends BaseRepository implements AnnouncementRepositoryInterface
{
    public function __construct(Announcement $model)
    {
        parent::__construct($model);
    }

    public function getPaginated(int $perPage = 10, string $search = null)
    {
        return $this->model
            ->when($search, function ($query) use ($search) {
                $query->where('title', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($perPage);
    }

    public function getActiveAnnouncements(int $limit = 5)
    {
        return $this->model->where('is_active', true)->latest()->take($limit)->get();
    }
}
