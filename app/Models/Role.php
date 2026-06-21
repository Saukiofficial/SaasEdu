<?php

namespace App\Models;

use App\Traits\UsesUuid;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    use UsesUuid;
}