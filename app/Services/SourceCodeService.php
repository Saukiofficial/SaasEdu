<?php

namespace App\Services;

use App\Repositories\Contracts\SourceCodeRepositoryInterface;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SourceCodeService
{
    protected $sourceCodeRepository;

    public function __construct(SourceCodeRepositoryInterface $sourceCodeRepository)
    {
        $this->sourceCodeRepository = $sourceCodeRepository;
    }

    public function getPaginatedSourceCodes(int $perPage = 10, ?string $search = null)
    {
        return $this->sourceCodeRepository->getAllPaginated($perPage, $search);
    }

    public function createSourceCode(array $data, $files)
    {
        try {
            if (isset($files['thumbnail'])) {
                $path = $files['thumbnail']->store('source_codes/thumbnails', 'public');
                $data['thumbnail'] = '/storage/' . $path;
            }

            // SIMPAN FILE ZIP KE DISK LOCAL (PRIVATE)
            if (isset($files['file_archive'])) {
                $path = $files['file_archive']->store('source_codes/archives', 'local');
                $data['file_path'] = $path;
            }

            return $this->sourceCodeRepository->create($data);
        } catch (\Exception $e) {
            Log::error("Gagal menambahkan Source Code: " . $e->getMessage());
            throw $e;
        }
    }

    public function updateSourceCode(string $id, array $data, $files)
    {
        try {
            $sourceCode = $this->sourceCodeRepository->findById($id);

            if (isset($files['thumbnail'])) {
                if ($sourceCode->thumbnail) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $sourceCode->thumbnail));
                }
                $path = $files['thumbnail']->store('source_codes/thumbnails', 'public');
                $data['thumbnail'] = '/storage/' . $path;
            }

            if (isset($files['file_archive'])) {
                // Hapus ZIP lama jika ada
                if ($sourceCode->file_path) {
                    Storage::disk('local')->delete($sourceCode->file_path);
                }
                $path = $files['file_archive']->store('source_codes/archives', 'local');
                $data['file_path'] = $path;
            }

            return $this->sourceCodeRepository->update($id, $data);
        } catch (\Exception $e) {
            Log::error("Gagal memperbarui Source Code: " . $e->getMessage());
            throw $e;
        }
    }

    public function deleteSourceCode(string $id)
    {
        try {
            $sourceCode = $this->sourceCodeRepository->findById($id);
            
            if ($sourceCode->thumbnail) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $sourceCode->thumbnail));
            }
            if ($sourceCode->file_path) {
                Storage::disk('local')->delete($sourceCode->file_path);
            }

            return $this->sourceCodeRepository->delete($id);
        } catch (\Exception $e) {
            Log::error("Gagal menghapus Source Code: " . $e->getMessage());
            throw $e;
        }
    }
}