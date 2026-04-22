<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CekProfile
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Gunakan Auth::check() yang lebih dikenali IDE
        if (Auth::check()) {
            
            /** @var \App\Models\User $user */
            $user = Auth::user(); // Memberitahu VS Code bahwa ini adalah model User

            if ($user->role === 'mahasiswa') {
                
                // Sekarang VS Code tahu bahwa $user punya kolom is_profile_completed
                if (!$user->is_profile_completed) {
                    
                    if (!$request->routeIs('profile.setup') && !$request->routeIs('profile.setup.store')) {
                        return redirect()->route('profile.setup');
                    }
                }
            }
        }

        return $next($request);
    }
}