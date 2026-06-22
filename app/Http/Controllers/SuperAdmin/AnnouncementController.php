<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\AnnouncementService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    protected $announcementService;

    public function __construct(AnnouncementService $announcementService)
    {
        $this->announcementService = $announcementService;
    }

    public function index()
    {
        $announcements = $this->announcementService->getAllAnnouncements(10);
        
        return Inertia::render('SuperAdmin/Announcements/Index', [
            'announcements' => $announcements
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:info,warning,success,promo',
            'is_active' => 'boolean',
        ]);

        $this->announcementService->createAnnouncement($validated);

        return redirect()->back()->with('success', 'Broadcast pengumuman berhasil dibuat.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:info,warning,success,promo',
            'is_active' => 'boolean',
        ]);

        $this->announcementService->updateAnnouncement($id, $validated);

        return redirect()->back()->with('success', 'Broadcast pengumuman berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $this->announcementService->deleteAnnouncement($id);
        
        return redirect()->back()->with('success', 'Broadcast berhasil dihapus.');
    }
}