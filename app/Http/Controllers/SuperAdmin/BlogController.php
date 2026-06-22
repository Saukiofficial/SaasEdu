<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\BlogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class BlogController extends Controller
{
    protected $blogService;

    public function __construct(BlogService $blogService)
    {
        $this->blogService = $blogService;
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        $status = $request->query('status');

        $blogs = $this->blogService->getPaginatedBlogs(10, $search, $status);

        return Inertia::render('SuperAdmin/Blog/Index', [
            'blogs' => $blogs,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048' 
        ]);

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('blogs', 'public');
            $validated['thumbnail'] = '/storage/' . $path;
        }

        $this->blogService->createBlog($validated);

        return redirect()->back()->with('success', 'Artikel Blog berhasil ditambahkan.');
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
            'thumbnail' => 'nullable' // Bisa berupa file baru, bisa kosong
        ]);

        // Jika user mengupload file baru
        if ($request->hasFile('thumbnail')) {
            $request->validate(['thumbnail' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048']);
            $path = $request->file('thumbnail')->store('blogs', 'public');
            $validated['thumbnail'] = '/storage/' . $path;
        } else {
            // Jika tidak ada upload baru, hapus 'thumbnail' dari validated 
            // agar data path yang lama di database tidak ter-overwrite menjadi null
            unset($validated['thumbnail']);
        }

        $this->blogService->updateBlog($id, $validated);

        return redirect()->back()->with('success', 'Artikel Blog berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $this->blogService->deleteBlog($id);

        return redirect()->back()->with('success', 'Artikel Blog berhasil dihapus.');
    }
}