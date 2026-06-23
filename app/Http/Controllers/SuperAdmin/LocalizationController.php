<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\LanguageService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocalizationController extends Controller
{
    protected $languageService;

    public function __construct(LanguageService $languageService)
    {
        $this->languageService = $languageService;
    }

    public function index(Request $request)
    {
        $search = $request->query('search');

        $languages = $this->languageService->getPaginatedLanguages(15, $search);

        return Inertia::render('SuperAdmin/Localization/Index', [
            'languages' => $languages,
            'filters' => [
                'search' => $search,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:10|unique:languages,code',
            'name' => 'required|string|max:255',
            'is_active' => 'boolean',
            'is_default' => 'boolean',
        ]);

        $this->languageService->createLanguage($validated);

        return redirect()->back()->with('success', 'Bahasa berhasil ditambahkan.');
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:10|unique:languages,code,' . $id,
            'name' => 'required|string|max:255',
            'is_active' => 'boolean',
            'is_default' => 'boolean',
        ]);

        $this->languageService->updateLanguage($id, $validated);

        return redirect()->back()->with('success', 'Bahasa berhasil diperbarui.');
    }

    public function setAsDefault(string $id)
    {
        $this->languageService->setAsDefault($id);

        return redirect()->back()->with('success', 'Bahasa default berhasil diubah.');
    }

    public function destroy(string $id)
    {
        try {
            $this->languageService->deleteLanguage($id);
            return redirect()->back()->with('success', 'Bahasa berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}