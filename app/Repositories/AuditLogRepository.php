<?php

namespace App\Repositories;

use App\Models\AuditLog;
use App\Repositories\Contracts\AuditLogRepositoryInterface;

class AuditLogRepository implements AuditLogRepositoryInterface
{
    public function getAllPaginatedWithUser(int $perPage = 20, array $filters = [])
    {
        $query = AuditLog::with('user')->orderBy('created_at', 'desc');

        // Opsional: Implementasi filter pencarian berdasarkan modul atau aksi
        if (isset($filters['module']) && !empty($filters['module'])) {
            $query->where('module', $filters['module']);
        }
        
        if (isset($filters['action']) && !empty($filters['action'])) {
            $query->where('action', $filters['action']);
        }

        if (isset($filters['search']) && !empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhereHas('user', function($u) use ($search) {
                      $u->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        return $query->paginate($perPage);
    }

    public function logEvent(array $data)
    {
        // Secara otomatis mengambil IP dan User Agent jika tidak disediakan
        if (!isset($data['ip_address'])) {
            $data['ip_address'] = request()->ip();
        }
        if (!isset($data['user_agent'])) {
            $data['user_agent'] = request()->userAgent();
        }
        if (!isset($data['user_id']) && auth()->check()) {
            $data['user_id'] = auth()->id();
        }

        return AuditLog::create($data);
    }
}
