<?php

namespace App\Models;

use App\Traits\UsesUuid;
use Spatie\Permission\Models\Permission as SpatiePermission;

class Permission extends SpatiePermission
{
    use UsesUuid;
}