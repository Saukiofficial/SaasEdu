<?php

namespace App\Repositories\Contracts;

interface SettingRepositoryInterface
{
    public function getAll();
    public function getByKey(string $key);
    public function updateOrCreate(string $key, $value, string $group = 'general');
    public function updateMultiple(array $settings);
}
