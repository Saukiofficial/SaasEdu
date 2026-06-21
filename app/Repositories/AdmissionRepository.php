<?php

namespace App\Repositories;

use App\Models\Admission;
use App\Repositories\Contracts\AdmissionRepositoryInterface;
use Illuminate\Support\Str;

class AdmissionRepository extends BaseRepository implements AdmissionRepositoryInterface
{
    public function __construct(Admission $model)
    {
        parent::__construct($model);
    }

    public function generateRegistrationNumber(string $schoolId): string
    {
        $prefix = 'REG-' . date('Y') . '-';
        do {
            $number = $prefix . strtoupper(Str::random(5));
        } while ($this->model->where('registration_number', $number)->exists());

        return $number;
    }

    public function getPaginatedBySchool(string $schoolId, int $perPage = 10)
    {
        // Data sudah otomatis ter-filter oleh BelongsToTenant scope
        return $this->model->latest()->paginate($perPage);
    }
}
