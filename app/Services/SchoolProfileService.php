<?php

namespace App\Services;

use App\Repositories\Contracts\SchoolProfileRepositoryInterface;

class SchoolProfileService
{
    public function __construct(
        protected SchoolProfileRepositoryInterface $schoolProfileRepository
    ) {}

    public function getProfile(string $schoolId)
    {
        return $this->schoolProfileRepository->findBySchoolId($schoolId);
    }

    public function updateProfile(string $schoolId, array $data)
    {
        // Catatan: Jika nanti Anda ingin menambahkan fitur upload file Logo (menyimpan ke storage public), 
        // Anda bisa menyisipkan logikanya di sini sebelum memanggil updateOrCreate.
        
        return $this->schoolProfileRepository->updateOrCreate($schoolId, $data);
    }
}
