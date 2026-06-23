<?php

namespace App\Http\Controllers;

use App\Models\Language;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class LanguageSwitchController extends Controller
{
    public function switch(Request $request)
    {
        $request->validate([
            'code' => 'required|string'
        ]);

        // Pastikan bahasa yang dipilih ada dan berstatus aktif
        $language = Language::where('code', $request->code)->where('is_active', true)->first();

        if ($language) {
            // Simpan preferensi bahasa ke dalam session
            Session::put('locale', $language->code);
        }

        return redirect()->back();
    }
}
