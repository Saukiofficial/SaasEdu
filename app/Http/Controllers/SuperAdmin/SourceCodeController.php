<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\SourceCodeService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SourceCodeController extends Controller
{
    protected $sourceCodeService;

    public function __construct(SourceCodeService $sourceCodeService)
    {
        $this->sourceCodeService = $sourceCodeService;
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        $sourceCodes = $this->sourceCodeService->getPaginatedSourceCodes(10, $search);

        return Inertia::render('SuperAdmin/SourceCode/Index', [
            'sourceCodes' => $sourceCodes,
            'filters' => [
                'search' => $search,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'demo_url' => 'nullable|url',
            'tech_stack' => 'nullable|array',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'file_archive' => 'nullable|file|mimes:zip,rar,tar,gz|max:102400', // Max 100MB
        ]);

        $data = $request->except(['thumbnail', 'file_archive']);
        
        $this->sourceCodeService->createSourceCode($data, $request->allFiles());

        return redirect()->back()->with('success', 'Source Code berhasil ditambahkan ke Katalog.');
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'demo_url' => 'nullable|url',
            'tech_stack' => 'nullable|array',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'file_archive' => 'nullable|file|mimes:zip,rar,tar,gz|max:102400', // Max 100MB
        ]);

        $data = $request->except(['thumbnail', 'file_archive']);

        $this->sourceCodeService->updateSourceCode($id, $data, $request->allFiles());

        return redirect()->back()->with('success', 'Data Katalog Source Code berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $this->sourceCodeService->deleteSourceCode($id);

        return redirect()->back()->with('success', 'Source Code berhasil dihapus.');
    }
}