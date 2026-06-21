<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdmissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PPDBAdminController extends Controller
{
    protected AdmissionService $admissionService;

    public function __construct(AdmissionService $admissionService)
    {
        $this->admissionService = $admissionService;
    }

    public function index()
    {
        $admissions = $this->admissionService->getAdminAdmissions();
        return Inertia::render('Admin/PPDB/Index', [
            'admissions' => $admissions
        ]);
    }

    public function updateStatus(Request $request, string $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $this->admissionService->updateStatus($id, $validated['status']);

        return redirect()->back()->with('message', 'Status pendaftaran berhasil diperbarui.');
    }
}
