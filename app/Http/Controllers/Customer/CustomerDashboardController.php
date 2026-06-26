<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\SourceCodeOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CustomerDashboardController extends Controller
{
    public function index()
    {
        $orders = SourceCodeOrder::with('sourceCode')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('Customer/Dashboard', [
            'orders' => $orders
        ]);
    }

    public function download($orderId)
    {
        $order = SourceCodeOrder::with('sourceCode')
            ->where('id', $orderId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Validasi status lunas
        if ($order->status !== 'paid') {
            return back()->with('error', 'Pembayaran belum diselesaikan atau belum dikonfirmasi oleh Admin.');
        }

        if (!$order->sourceCode || !$order->sourceCode->file_path) {
            return back()->with('error', 'File source code tidak ditemukan. Silakan hubungi Support.');
        }

        if (!Storage::disk('local')->exists($order->sourceCode->file_path)) {
            return back()->with('error', 'File fisik tidak ditemukan pada server.');
        }

        // Return Download response (Terproteksi)
        return Storage::disk('local')->download($order->sourceCode->file_path, $order->sourceCode->slug . '.zip');
    }
}