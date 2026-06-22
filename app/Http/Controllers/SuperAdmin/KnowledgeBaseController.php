<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\KnowledgeBaseService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KnowledgeBaseController extends Controller
{
    protected $kbService;

    public function __construct(KnowledgeBaseService $kbService)
    {
        $this->kbService = $kbService;
    }

    public function index()
    {
        $articles = $this->kbService->getAllArticles(10);
        
        return Inertia::render('SuperAdmin/KnowledgeBases/Index', [
            'articles' => $articles
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'content' => 'required|string',
            'is_published' => 'boolean',
        ]);

        $this->kbService->createArticle($validated);

        return redirect()->back()->with('success', 'Artikel Knowledge Base berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'content' => 'required|string',
            'is_published' => 'boolean',
        ]);

        $this->kbService->updateArticle($id, $validated);

        return redirect()->back()->with('success', 'Artikel berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $this->kbService->deleteArticle($id);
        return redirect()->back()->with('success', 'Artikel berhasil dihapus.');
    }
}