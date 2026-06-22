<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\FaqService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FaqController extends Controller
{
    protected $faqService;

    public function __construct(FaqService $faqService)
    {
        $this->faqService = $faqService;
    }

    public function index()
    {
        $faqs = $this->faqService->getAllFaqs(15);
        
        return Inertia::render('SuperAdmin/Faqs/Index', [
            'faqs' => $faqs
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'category' => 'required|string|max:100',
            'order_num' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        if(!isset($validated['order_num'])) {
            $validated['order_num'] = 0;
        }

        $this->faqService->createFaq($validated);

        return redirect()->back()->with('success', 'FAQ baru berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'category' => 'required|string|max:100',
            'order_num' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $this->faqService->updateFaq($id, $validated);

        return redirect()->back()->with('success', 'Data FAQ berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $this->faqService->deleteFaq($id);
        
        return redirect()->back()->with('success', 'FAQ berhasil dihapus.');
    }
}
