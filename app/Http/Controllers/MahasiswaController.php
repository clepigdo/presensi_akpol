<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Absensi;
use App\Models\Absensi_mhs;
use App\Models\Logbook_mhs; // [TAMBAHAN]: Import model Logbook
use Carbon\Carbon;
use Inertia\Inertia; 

class MahasiswaController extends Controller
{
    // 1. Tampilkan Halaman Dashboard
    // 1. Tampilkan Halaman Dashboard
    public function index()
    {
        $user_id = Auth::id();
        $hari_ini = date('Y-m-d');

        // [DEBUG MODE]: Cari absen hari ini yang BELUM check-out
        $cek_absen = Absensi_mhs::where('user_id', $user_id)
                            ->where('tanggal', $hari_ini)
                            ->whereNull('jam_pulang') // Syarat utama agar bisa looping
                            ->first();

        $riwayat_absen = Absensi_mhs::where('user_id', $user_id)
                                ->orderBy('id', 'desc') // Diurutkan berdasarkan ID agar absen berulang terlihat urut
                                ->get();
                                
        $riwayat_logbook = \App\Models\Logbook_mhs::where('user_id', $user_id)
                                ->orderBy('created_at', 'desc')
                                ->get();
                                
        return Inertia::render('Mahasiswa/Dashboard', [
            'cek_absen' => $cek_absen,
            'riwayat_absen' => $riwayat_absen,
            'riwayat_logbook' => $riwayat_logbook,
            'flash' => [
                'success' => session('success')
            ] 
        ]);
    }

    // 2. Proses Absen (Masuk / Pulang)
    public function store(Request $request)
    {
        $user_id = Auth::id();
        $hari_ini = date('Y-m-d');
        $jam_sekarang = date('H:i:s');
        
        // Cari sesi absen yang masih terbuka (belum pulang) hari ini
        $cek_absen = Absensi_mhs::where('user_id', $user_id)
                            ->where('tanggal', $hari_ini)
                            ->whereNull('jam_pulang')
                            ->first();

        if ($cek_absen) {
            // === PROSES ABSEN PULANG ===
            $cek_absen->update([
                'jam_pulang' => $jam_sekarang,
                'status' => 'hadir',
                'lat_pulang' => $request->lat,   
                'long_pulang' => $request->long, 
            ]);
            return redirect()->back()->with('success', '[DEBUG] Absen pulang berhasil. Anda bisa Check-In lagi.');

        } else {
            // === PROSES ABSEN MASUK (Akan selalu membuat baris baru jika tidak ada sesi terbuka) ===
            Absensi_mhs::create([
                'user_id' => $user_id,
                'tanggal' => $hari_ini,
                'jam_masuk' => $jam_sekarang,
                'status' => 'hadir',
                'lat_masuk' => $request->lat,   
                'long_masuk' => $request->long, 
            ]);
            return redirect()->back()->with('success', '[DEBUG] Sesi Check-In baru berhasil dibuat.');
        }
    }
}