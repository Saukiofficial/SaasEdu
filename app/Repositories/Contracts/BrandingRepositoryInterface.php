<?php

namespace App\Repositories\Contracts;

interface BrandingRepositoryInterface
{
    public function getGlobalBranding();
    public function updateGlobalBranding(array $data);
}
