<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\AnnouncementService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    protected AnnouncementService $announcementService;

    public function __construct(AnnouncementService $announcementService)
    {
        $this->announcementService = $announcementService;
    }

    public function index(Request $request)
    {
        if (auth()->user()->school_id !== null) abort(403);

        $search = $request->query('search');
        $announcements = $this->announcementService->getAnnouncements($search);

        return Inertia::render('SuperAdmin/Announcements/Index', [
            'announcements' => $announcements,
            'filters' => ['search' => $search]
        ]);
    }

    public function store(Request $request)
    {
        if (auth()->user()->school_id !== null) abort(403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:info,warning,success,event',
            'is_active' => 'boolean',
        ]);

        $this->announcementService->createAnnouncement($validated);

        return redirect()->back()->with('message', 'Pengumuman berhasil dipublikasikan.');
    }

    public function update(Request $request, string $id)
    {
        if (auth()->user()->school_id !== null) abort(403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:info,warning,success,event',
            'is_active' => 'boolean',
        ]);

        $this->announcementService->updateAnnouncement($id, $validated);

        return redirect()->back()->with('message', 'Pengumuman berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        if (auth()->user()->school_id !== null) abort(403);

        $this->announcementService->deleteAnnouncement($id);
        return redirect()->back()->with('message', 'Pengumuman berhasil dihapus.');
    }
}