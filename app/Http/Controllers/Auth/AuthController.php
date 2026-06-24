<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\Subscription;
use App\Models\SubscriptionInvoice;
use App\Models\SubscriptionPackage;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            return redirect()->intended('/dashboard');
        }

        return back()->withErrors([
            'email' => 'Email atau password yang Anda masukkan salah.',
        ])->onlyInput('email');
    }

    public function showRegister(Request $request)
    {
        $selectedPackage = null;

        // Tangkap ID paket dari parameter URL jika ada
        if ($request->has('package_id')) {
            $selectedPackage = SubscriptionPackage::find($request->package_id);
        }

        return Inertia::render('Auth/Register', [
            'selectedPackage' => $selectedPackage
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'school_name' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'package_id' => 'nullable|exists:subscription_packages,id',
            'payment_method' => 'nullable|string',
            'promo_code' => 'nullable|string'
        ]);

        DB::beginTransaction();

        try {
            // 1. Buat Tenant (Sekolah) Baru
            $school = School::create([
                'name' => $request->school_name,
                'status' => 'active',
            ]);

            // 2. Buat User (Owner Tenant)
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'school_id' => $school->id,
            ]);

            // 3. Beri Role Owner ke user tersebut
            $user->assignRole('Owner');

            // 4. Logika Paket & Langganan
            $package = null;
            if ($request->package_id) {
                $package = SubscriptionPackage::find($request->package_id);
            }

            if ($package && $package->price > 0) {
                // Jika paket berbayar -> Buat Invoice & Set status langganan ke 'pending'
                $discount = 0;
                
                // (Opsional: Logika validasi promo_code bisa ditambahkan di sini nantinya)
                // if ($request->promo_code === 'DISKON50') { $discount = 50000; }

                $finalAmount = max(0, $package->price - $discount);

                Subscription::create([
                    'school_id' => $school->id,
                    'plan_name' => $package->name,
                    'start_date' => Carbon::now(),
                    'end_date' => $package->billing_cycle === 'yearly' ? Carbon::now()->addYear() : Carbon::now()->addMonth(),
                    'status' => 'pending', // Menunggu pembayaran
                ]);

                SubscriptionInvoice::create([
                    'school_id' => $school->id,
                    'amount' => $finalAmount,
                    'description' => "Tagihan Langganan Paket: " . $package->name,
                    'status' => 'unpaid',
                    'due_date' => Carbon::now()->addDays(3), // Jatuh tempo 3 hari
                    'payment_method' => $request->payment_method ?? 'bank_transfer',
                ]);

            } else {
                // Jika tidak memilih paket, atau memilih paket gratis -> Berikan Free Trial 14 Hari
                Subscription::create([
                    'school_id' => $school->id,
                    'plan_name' => 'Free Trial',
                    'start_date' => Carbon::now(),
                    'end_date' => Carbon::now()->addDays(14),
                    'status' => 'active',
                ]);
            }

            DB::commit();

            Auth::login($user);

            // Jika status langganan 'pending', arahkan ke halaman billing/invoice (bisa disesuaikan nanti)
            // Untuk saat ini, kita arahkan semua ke dashboard terlebih dahulu.
            return redirect()->route('dashboard');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Terjadi kesalahan saat registrasi: ' . $e->getMessage()])->withInput();
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}