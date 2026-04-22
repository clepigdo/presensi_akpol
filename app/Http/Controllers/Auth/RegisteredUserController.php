<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // 1. Tambahkan validasi untuk 4 data baru dari React
        $request->validate([
            'nama_lengkap' => ['required', 'string', 'max:255'], 
            'nim_atau_nrp' => ['required', 'string', 'max:20', 'unique:'.User::class], 
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            
            // [TAMBAHAN BARU]: Validasi data tambahan & biometrik
            'no_hp' => ['required', 'string', 'max:20'],
            'jenis_kelamin' => ['required', 'string', 'in:Laki-laki,Perempuan'],
            'alamat_domisili' => ['required', 'string'],
            'face_data' => ['required', 'string'], // Wajib ada foto wajah
            
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'nama_lengkap' => $request->nama_lengkap, 
            'nim_atau_nrp' => $request->nim_atau_nrp,
            'email' => $request->email,
            'no_hp' => $request->no_hp,
            'jenis_kelamin' => $request->jenis_kelamin,
            'alamat_domisili' => $request->alamat_domisili,
            'face_data' => $request->face_data,
            
            'password' => Hash::make($request->password),
            'role' => 'mahasiswa', 
        ]);

        event(new Registered($user));

        return redirect()->route('login')->with('status', 'Registrasi & Perekaman Biometrik Berhasil! Data Anda telah diamankan. Silakan masuk (login) untuk melanjutkan.');
    }
}
