<?php

namespace App\Repositories;

use App\Models\Classroom;
use App\Repositories\Contracts\ClassroomRepositoryInterface;

class ClassroomRepository extends BaseRepository implements ClassroomRepositoryInterface
{
    public function __construct(Classroom $model)
    {
        parent::__construct($model);
    }
}