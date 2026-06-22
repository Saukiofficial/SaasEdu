<?php

namespace App\Services;

use App\Repositories\Contracts\AuditLogRepositoryInterface;
use Illuminate\Support\Facades\Log;
use Exception;

class AuditLogService
{
    protected $auditRepo;

    public function __construct(AuditLogRepositoryInterface $auditRepo)
    {
        $this->auditRepo = $auditRepo;
    }

    public function getLogs(int $perPage = 20, array $filters = [])
    {
        return $this->auditRepo->getAllPaginatedWithUser($perPage, $filters);
    }

    // Method ini bisa dipanggil dari Controller lain (misal dari InvoiceController setelah sukses bayar)
    // untuk mencatat histori ke database
    public function recordLog(string $module, string $action, string $description, array $oldValues = null, array $newValues = null)
    {
        try {
            $this->auditRepo->logEvent([
                'module' => $module,
                'action' => $action,
                'description' => $description,
                'old_values' => $oldValues,
                'new_values' => $newValues,
            ]);
        } catch (Exception $e) {
            // Kita log ke file log laravel biasa agar aplikasi tidak crash jika gagal insert ke DB audit
            Log::error('Failed to write Audit Log to Database: ' . $e->getMessage());
        }
    }
}
