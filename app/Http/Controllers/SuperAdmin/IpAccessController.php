<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\IpAccessService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IpAccessController extends Controller
{
    protected $ipAccessService;

    public function __construct(IpAccessService $ipAccessService)
    {
        $this->ipAccessService = $ipAccessService;
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        $type = $request->query('type');

        $ipAccesses = $this->ipAccessService->getPaginatedIpAccesses(15, $search, $type);

        return Inertia::render('SuperAdmin/IpAccess/Index', [
            'ipAccesses' => $ipAccesses,
            'filters' => [
                'search' => $search,
                'type' => $type,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ip_address' => 'required|ip|unique:ip_accesses,ip_address',
            'label' => 'nullable|string|max:255',
            'type' => 'required|in:whitelist,blacklist',
            'notes' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $this->ipAccessService->createIpAccess($validated);

        return redirect()->back()->with('success', 'Aturan Akses IP berhasil ditambahkan.');
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'ip_address' => 'required|ip|unique:ip_accesses,ip_address,' . $id,
            'label' => 'nullable|string|max:255',
            'type' => 'required|in:whitelist,blacklist',
            'notes' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $this->ipAccessService->updateIpAccess($id, $validated);

        return redirect()->back()->with('success', 'Aturan Akses IP berhasil diperbarui.');
    }

    public function toggleStatus(string $id)
    {
        $this->ipAccessService->toggleStatus($id);

        return redirect()->back()->with('success', 'Status Aturan IP berhasil diubah.');
    }

    public function destroy(string $id)
    {
        $this->ipAccessService->deleteIpAccess($id);

        return redirect()->back()->with('success', 'Aturan Akses IP berhasil dihapus.');
    }
}