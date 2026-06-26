<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\SourceCode;
use App\Models\SourceCodeOrder;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class SourceCodeCheckoutController extends Controller
{
    public function show($slug)
    {
        $sourceCode = SourceCode::where('slug', $slug)->where('is_active', true)->firstOrFail();
        
        return Inertia::render('Frontend/SourceCodeCheckout', [
            'sourceCode' => $sourceCode
        ]);
    }

    public function process(Request $request, $slug)
    {
        $sourceCode = SourceCode::where('slug', $slug)->where('is_active', true)->firstOrFail();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8|confirmed',
            'payment_method' => 'required|string',
        ]);

        DB::beginTransaction();
        try {
            $user = Auth::user();

            if (!$user) {
                // Periksa apakah email sudah digunakan
                $user = User::where('email', $request->email)->first();
                
                if (!$user) {
                    // Buat Akun Baru khusus Customer (school_id = null)
                    $user = User::create([
                        'name' => $request->name,
                        'email' => $request->email,
                        'password' => Hash::make($request->password),
                        'school_id' => null, 
                    ]);
                    
                    // Cek ketersediaan Role Customer
                    $roleExists = Role::where('name', 'Customer')->exists();
                    if (!$roleExists) {
                        // Bypass Eloquent model creation untuk memastikan UUID disave sebagai string utuh
                        DB::table('roles')->insert([
                            'id' => Str::uuid()->toString(),
                            'name' => 'Customer',
                            'guard_name' => 'web',
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                    // Assign by name untuk resolusi otomatis dari Spatie
                    $user->assignRole('Customer');
                }
                
                // Login otomatis
                Auth::login($user);
            }

            // Buat Pesanan (Order)
            $order = SourceCodeOrder::create([
                'user_id' => $user->id,
                'source_code_id' => $sourceCode->id,
                'amount' => $sourceCode->price,
                'payment_method' => $request->payment_method,
                'status' => 'pending',
            ]);

            // ==========================================
            // INTEGRASI MIDTRANS (SNAP REDIRECT API)
            // ==========================================
            $serverKey = env('MIDTRANS_SERVER_KEY');
            $isProduction = env('MIDTRANS_IS_PRODUCTION', false);
            
            // URL Base Midtrans (Sandbox vs Production)
            $midtransUrl = $isProduction 
                ? '[https://app.midtrans.com/snap/v1/transactions](https://app.midtrans.com/snap/v1/transactions)' 
                : '[https://app.sandbox.midtrans.com/snap/v1/transactions](https://app.sandbox.midtrans.com/snap/v1/transactions)';

            $paymentUrl = null;

            if (!empty($serverKey)) {
                // MENGGUNAKAN API MIDTRANS ASLI JIKA KEY TERSEDIA
                $payload = [
                    'transaction_details' => [
                        'order_id' => $order->order_number, // Unique order number
                        'gross_amount' => (int) $sourceCode->price,
                    ],
                    'customer_details' => [
                        'first_name' => $user->name,
                        'email' => $user->email,
                    ],
                    'item_details' => [
                        [
                            'id' => $sourceCode->id,
                            'price' => (int) $sourceCode->price,
                            'quantity' => 1,
                            'name' => substr($sourceCode->title, 0, 50), // Midtrans membatasi max 50 chars
                        ]
                    ]
                ];

                $response = Http::withBasicAuth($serverKey, '')
                    ->withHeaders(['Content-Type' => 'application/json', 'Accept' => 'application/json'])
                    ->post($midtransUrl, $payload);

                if ($response->successful()) {
                    $paymentUrl = $response->json('redirect_url');
                } else {
                    DB::rollBack();
                    return back()->withErrors(['error' => 'Gagal terhubung ke Payment Gateway (Midtrans).']);
                }
            } else {
                // MODE SIMULASI (JIKA MIDTRANS KEY KOSONG)
                // Kita akan anggap pembayaran langsung lunas secara otomatis
                $order->update(['status' => 'paid']);
                $paymentUrl = route('customer.dashboard'); 
            }

            DB::commit();

            // Jika mengarah ke halaman external Midtrans, gunakan Inertia::location
            if (!empty($serverKey) && $paymentUrl) {
                return Inertia::location($paymentUrl);
            }

            // Jika mode Simulasi, kembali ke Dashboard biasa
            return redirect()->route('customer.dashboard')->with('success', 'Checkout berhasil (Mode Simulasi Lunas). Anda dapat langsung mengunduh Source Code.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Terjadi kesalahan saat memproses pesanan: ' . $e->getMessage()]);
        }
    }
}