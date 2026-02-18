<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Absensi;
use App\Models\Absensi_mhs;
use Carbon\Carbon;
use Inertia\Inertia; 

class MahasiswaController extends Controller
{
    // 1. Tampilkan Halaman Dashboard
    public function index()
    {
        $user_id = Auth::id();
        $hari_ini = date('Y-m-d');

        $cek_absen = Absensi_mhs::where('user_id', $user_id)
                            ->where('tanggal', $hari_ini)
                            ->first();

        $riwayat_absen = Absensi_mhs::where('user_id', $user_id)
                                ->orderBy('tanggal', 'desc')
                                ->get();
        return Inertia::render('Mahasiswa/Dashboard', [
        'cek_absen' => $cek_absen,
        'riwayat_absen' => $riwayat_absen,
        'flash' => [
            'success' => session('success')
        ] 
    ]);

        return view('user.dashboard', compact('cek_absen', 'riwayat_absen'));
    }

    // 2. Proses Absen (Masuk / Pulang)
    public function store(Request $request)
    {
        $user_id = Auth::id();
        $hari_ini = date('Y-m-d');
        $jam_sekarang = date('H:i:s');
        $cek_absen = Absensi_mhs::where('user_id', $user_id)
                            ->where('tanggal', $hari_ini)
                            ->first();

        if ($cek_absen) {
            $cek_absen->update([
                'jam_pulang' => $jam_sekarang,
                'status' => 'hadir'
            ]);
            return redirect()->back()->with('success', 'Hati-hati di jalan! Absen pulang berhasil.');

        } else {
            Absensi_mhs::create([
                'user_id' => $user_id,
                'tanggal' => $hari_ini,
                'jam_masuk' => $jam_sekarang,
                'status' => 'hadir',
            ]);
            return redirect()->back()->with('success', 'Selamat bekerja! Absen masuk berhasil.');
        }
    }
}