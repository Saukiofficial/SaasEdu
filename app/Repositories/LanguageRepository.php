<?php

namespace App\Repositories;

use App\Models\Language;
use App\Repositories\Contracts\LanguageRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class LanguageRepository implements LanguageRepositoryInterface
{
    public function getAllPaginated(int $perPage = 15, ?string $search = null): LengthAwarePaginator
    {
        $query = Language::query()->orderBy('name', 'asc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        return $query->paginate($perPage);
    }

    public function findById(string $id): ?Language
    {
        return Language::findOrFail($id);
    }

    public function create(array $data): Language
    {
        return Language::create($data);
    }

    public function update(string $id, array $data): Language
    {
        $language = $this->findById($id);
        $language->update($data);
        return $language;
    }

    public function delete(string $id): bool
    {
        $language = $this->findById($id);
        return $language->delete();
    }

    public function resetDefaultLanguage(): void
    {
        // Set semua bahasa menjadi bukan default
        Language::where('is_default', true)->update(['is_default' => false]);
    }
}