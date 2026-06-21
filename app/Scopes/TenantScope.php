<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class TenantScope implements Scope
{
    /**
     * Terapkan scope ke query builder Eloquent yang diberikan.
     */
    public function apply(Builder $builder, Model $model): void
    {
        // Cek apakah ada user yang sedang login
        if (Auth::hasUser()) {
            $user = Auth::user();
            
            // Jika user memiliki school_id (bukan Super Admin), filter query-nya
            if ($user->school_id !== null) {
                $builder->where($model->getTable() . '.school_id', $user->school_id);
            }
        }
    }
}
