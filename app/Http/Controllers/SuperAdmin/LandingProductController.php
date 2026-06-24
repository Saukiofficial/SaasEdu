<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Repositories\Contracts\LandingProductRepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingProductController extends Controller
{
    protected $productRepository;

    public function __construct(LandingProductRepositoryInterface $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        $products = $this->productRepository->getAllPaginated(10, $search);

        return Inertia::render('SuperAdmin/LandingProduct/Index', [
            'products' => $products,
            'filters' => [
                'search' => $search,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'subtitle' => 'nullable|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'screenshots.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $data = $request->only(['name', 'subtitle', 'features', 'is_active']);

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail_url'] = '/storage/' . $request->file('thumbnail')->store('products', 'public');
        }

        if ($request->hasFile('screenshots')) {
            $paths = [];
            foreach ($request->file('screenshots') as $file) {
                $paths[] = '/storage/' . $file->store('products', 'public');
            }
            $data['screenshots'] = $paths;
        }

        $this->productRepository->create($data);

        return redirect()->back()->with('success', 'Produk & Solusi berhasil ditambahkan.');
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'subtitle' => 'nullable|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'screenshots.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $data = $request->only(['name', 'subtitle', 'features', 'is_active']);

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail_url'] = '/storage/' . $request->file('thumbnail')->store('products', 'public');
        }

        if ($request->hasFile('screenshots')) {
            $paths = [];
            foreach ($request->file('screenshots') as $file) {
                $paths[] = '/storage/' . $file->store('products', 'public');
            }
            $data['screenshots'] = $paths;
        }

        $this->productRepository->update($id, $data);

        return redirect()->back()->with('success', 'Data Produk berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $this->productRepository->delete($id);

        return redirect()->back()->with('success', 'Data Produk berhasil dihapus.');
    }
}