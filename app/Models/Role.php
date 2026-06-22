<?php

namespace App\Models;

use App\Traits\UsesUuid;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    use UsesUuid;

    protected $fillable = [
        'name',
        'guard_name',
        'description',
        'permissions',
        'is_system'
    ];

    protected $casts = [
        'permissions' => 'array',
        'is_system' => 'boolean',
    ];

    public function roleUsers()
    {
        return $this->hasMany(User::class, 'role_id');
    }
}