<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Absensi_mhs;
use App\Models\Logbook_mhs;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        $hari_ini = date('Y-m-d');

        // 1. Statistik
        $total_mahasiswa = User::where('role', 'mahasiswa')->count();
        $hadir_hari_ini = Absensi_mhs::where('tanggal', $hari_ini)->count();
        $logbook_pending = Logbook_mhs::where('status_verifikasi', 'pending')->count();

        // 2. Ambil Semua Data Mahasiswa (Ini yang baru ditambahkan)
        $daftar_mahasiswa = User::where('role', 'mahasiswa')
                                ->orderBy('nama_lengkap', 'asc')
                                ->get();

        $absensi_hari_ini = \App\Models\Absensi_mhs::with('user')
                                ->where('tanggal', $hari_ini)
                                ->orderBy('jam_masuk', 'desc')
                                ->get();

        // 3. Data Logbook
        $logbooks = Logbook_mhs::with(['user', 'absensi'])
                        ->orderBy('created_at', 'desc')
                        ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_mahasiswa' => $total_mahasiswa,
                'hadir_hari_ini' => $hadir_hari_ini,
                'logbook_pending' => $logbook_pending
            ],
            // Kirim daftar mahasiswa ke frontend
            'daftar_mahasiswa' => $daftar_mahasiswa,
            'absensi_hari_ini' => $absensi_hari_ini, 
            'logbooks' => $logbooks
            
        ]);
    }

    // FUNGSI INI TETAP ADA UNTUK MEMPROSES TOMBOL "SETUJUI / TOLAK"
    public function verifyLogbook(Request $request, $id)
    {
        $request->validate([
            'status_verifikasi' => 'required|in:disetujui,ditolak',
            'catatan_mentor' => 'nullable|string'
        ]);

        $logbook = Logbook_mhs::findOrFail($id);
        $logbook->update([
            'status_verifikasi' => $request->status_verifikasi,
            'catatan_mentor' => $request->catatan_mentor
        ]);

        return redirect()->back()->with('success', 'Status logbook berhasil diperbarui.');
    }
}