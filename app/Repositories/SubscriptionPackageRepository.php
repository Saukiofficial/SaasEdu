<?php

namespace App\Repositories;

use App\Models\SubscriptionPackage;
use App\Repositories\Contracts\SubscriptionPackageRepositoryInterface;

class SubscriptionPackageRepository extends BaseRepository implements SubscriptionPackageRepositoryInterface
{
    public function __construct(SubscriptionPackage $model)
    {
        parent::__construct($model);
    }

    public function getPaginated(int $perPage = 10)
    {
        return $this->model->latest()->paginate($perPage);
    }
}