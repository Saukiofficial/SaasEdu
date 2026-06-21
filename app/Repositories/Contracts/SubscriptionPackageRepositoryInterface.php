<?php

namespace App\Repositories\Contracts;

interface SubscriptionPackageRepositoryInterface extends BaseRepositoryInterface
{
    public function getPaginated(int $perPage = 10);
}
