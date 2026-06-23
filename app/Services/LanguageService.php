<?php

namespace App\Services;

use App\Repositories\Contracts\LanguageRepositoryInterface;
use Illuminate\Support\Facades\Log;

class LanguageService
{
    protected $languageRepository;

    public function __construct(LanguageRepositoryInterface $languageRepository)
    {
        $this->languageRepository = $languageRepository;
    }

    public function getPaginatedLanguages(int $perPage = 15, ?string $search = null)
    {
        return $this->languageRepository->getAllPaginated($perPage, $search);
    }

    public function createLanguage(array $data)
    {
        try {
            if (isset($data['is_default']) && $data['is_default']) {
                $this->languageRepository->resetDefaultLanguage();
                $data['is_active'] = true; // Bahasa default harus aktif
            }

            return $this->languageRepository->create($data);
        } catch (\Exception $e) {
            Log::error("Gagal menambahkan Bahasa: " . $e->getMessage());
            throw $e;
        }
    }

    public function updateLanguage(string $id, array $data)
    {
        try {
            if (isset($data['is_default']) && $data['is_default']) {
                $this->languageRepository->resetDefaultLanguage();
                $data['is_active'] = true; // Bahasa default harus aktif
            }

            return $this->languageRepository->update($id, $data);
        } catch (\Exception $e) {
            Log::error("Gagal memperbarui Bahasa: " . $e->getMessage());
            throw $e;
        }
    }

    public function setAsDefault(string $id)
    {
        try {
            $this->languageRepository->resetDefaultLanguage();
            return $this->languageRepository->update($id, [
                'is_default' => true,
                'is_active' => true // Pastikan bahasa yang dijadikan default statusnya aktif
            ]);
        } catch (\Exception $e) {
            Log::error("Gagal mengatur Bahasa Default: " . $e->getMessage());
            throw $e;
        }
    }

    public function deleteLanguage(string $id)
    {
        try {
            $language = $this->languageRepository->findById($id);
            if ($language->is_default) {
                throw new \Exception("Tidak dapat menghapus bahasa utama (default). Silakan ubah bahasa default terlebih dahulu.");
            }

            return $this->languageRepository->delete($id);
        } catch (\Exception $e) {
            Log::error("Gagal menghapus Bahasa: " . $e->getMessage());
            throw $e;
        }
    }
}
