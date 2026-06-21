<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\SaasSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        if (auth()->user()->school_id !== null) {
            abort(403, 'Akses ditolak.');
        }

        // Ambil semua setting dan jadikan Key-Value Pair
        $settings = SaasSetting::all()->mapWithKeys(function ($item) {
            $value = $item->value;
            if ($item->type === 'boolean') {
                $value = filter_var($item->value, FILTER_VALIDATE_BOOLEAN);
            }
            return [$item->key => $value];
        })->toArray();

        return Inertia::render('SuperAdmin/Settings/Index', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        if (auth()->user()->school_id !== null) abort(403);

        $data = $request->except(['_token', '_method']);

        // Update atau buat setting baru secara iteratif
        foreach ($data as $key => $value) {
            $setting = SaasSetting::where('key', $key)->first();
            
            // Konversi boolean ke string agar aman disimpan di database
            if (is_bool($value)) {
                $value = $value ? 'true' : 'false';
            }

            if ($setting) {
                $setting->update(['value' => $value]);
            } else {
                SaasSetting::create([
                    'key' => $key,
                    'value' => $value,
                    'type' => is_bool($value) ? 'boolean' : 'string',
                    'group' => 'general'
                ]);
            }
        }

        return redirect()->back()->with('message', 'Pengaturan sistem berhasil disimpan.');
    }
}
