<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Failed;
use App\Services\LoginActivityService;
use Illuminate\Http\Request;

class RecordLoginActivity
{
    protected $loginActivityService;
    protected $request;

    public function __construct(LoginActivityService $loginActivityService, Request $request)
    {
        $this->loginActivityService = $loginActivityService;
        $this->request = $request;
    }

    // Tangani saat login sukses
    public function handleLogin(Login $event)
    {
        $this->loginActivityService->recordLogin([
            'user_id' => $event->user->id,
            'email' => $event->user->email,
            'ip_address' => $this->request->ip(),
            'user_agent' => $this->request->userAgent(),
            'status' => 'success',
            'login_at' => now(),
        ]);
    }

    // Tangani saat login gagal (password salah, dll)
    public function handleFailedLogin(Failed $event)
    {
        $this->loginActivityService->recordLogin([
            'user_id' => $event->user ? $event->user->id : null,
            'email' => $event->credentials['email'] ?? 'unknown',
            'ip_address' => $this->request->ip(),
            'user_agent' => $this->request->userAgent(),
            'status' => 'failed',
            'login_at' => now(),
        ]);
    }
}
