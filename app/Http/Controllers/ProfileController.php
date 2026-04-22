<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\View\View;
use Inertia\Inertia; // Tambahkan import Inertia
use Inertia\Response;

class ProfileController extends Controller
{
    // ==========================================
    // FITUR BARU: SETUP PROFIL & BIOMETRIK
    // ==========================================

    /**
     * Menampilkan halaman Setup Profile (Onboarding) untuk Mahasiswa.
     */
    public function setup(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        // Jika profil sudah lengkap, cegah akses dan kembalikan ke dashboard
        if ($user->is_profile_completed) {
            return redirect()->route('mahasiswa.dashboard');
        }

        // Tampilkan halaman React Setup Wizard
        return Inertia::render('Mahasiswa/Profile');
    }

    /**
     * Menyimpan data Setup Profile dan Biometrik Wajah dari tahap Onboarding.
     */
    public function storeSetup(Request $request): RedirectResponse
    {
        $request->validate([
            'no_hp' => ['required', 'string', 'max:20'],
            'jenis_kelamin' => ['required', 'string', 'in:L,P'],
            'alamat_domisili' => ['required', 'string'],
            'face_data' => ['required', 'string'], // Menerima base64 image dari React
        ]);

        $user = $request->user();

        // Simpan data dan ubah status profil menjadi lengkap
        $user->update([
            'no_hp' => $request->no_hp,
            'jenis_kelamin' => $request->jenis_kelamin,
            'alamat_domisili' => $request->alamat_domisili,
            'face_data' => $request->face_data,
            'is_profile_completed' => true, 
        ]);

        // Lempar ke dashboard dengan pesan sukses hijau
        return redirect()->route('mahasiswa.dashboard')->with('success', 'Profil dan Data Biometrik berhasil diamankan. Selamat bertugas.');
    }

    // ==========================================
    // FITUR BAWAAN LARAVEL BREEZE (Tetap dipertahankan)
    // ==========================================

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): View
    {
        return view('profile.edit', [
            'user' => $request->user(),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}