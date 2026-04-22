<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Logbook_mhs;
use App\Models\Absensi_mhs;
use Inertia\Inertia;

class LogbookMhsController extends Controller
{
    /**
     * 1. Menampilkan Halaman Logbook
     */
    public function index()
    {
        $user_id = Auth::id();
        $hari_ini = date('Y-m-d');

        $cek_absen = Absensi_mhs::where('user_id', $user_id)
                                ->where('tanggal', $hari_ini)
                                ->first();

        $riwayat_logbook = Logbook_mhs::where('user_id', $user_id)
                                    ->with('absensi')
                                    ->orderBy('created_at', 'desc')
                                    ->get();

        return Inertia::render('Mahasiswa/Dashboard', [ // Sesuaikan path jika Dashboard/Logbook digabung
            'cek_absen' => $cek_absen,
            'riwayat_logbook' => $riwayat_logbook,
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    /**
     * 2. Proses Menyimpan Logbook Baru (Sebagai Draft)
     */
    public function store(Request $request)
    {
        $request->validate([
            'judul_kegiatan' => 'required|string|max:255',
            'deskripsi_kegiatan' => 'required|string',
        ]);

        $user_id = Auth::id();
        $hari_ini = date('Y-m-d');

        $absensiHariIni = Absensi_mhs::where('user_id', $user_id)
                                    ->where('tanggal', $hari_ini)
                                    ->first();

        if (!$absensiHariIni) {
            return redirect()->back()->with('error', 'Akses ditolak! Anda wajib Check-In terlebih dahulu.');
        }

        Logbook_mhs::create([
            'user_id' => $user_id,
            'absensi_id' => $absensiHariIni->id,
            'judul_kegiatan' => $request->judul_kegiatan,
            'deskripsi_kegiatan' => $request->deskripsi_kegiatan,
            'is_draft' => true, // Menandai sebagai draft
            'status_verifikasi' => 'pending'
        ]);

        return redirect()->back()->with('success', 'Draft aktivitas berhasil disimpan.');
    }

    /**
     * 3. Fungsi Baru: Update / Edit Logbook
     */
    public function update(Request $request, $id)
    {
        $logbook = Logbook_mhs::where('user_id', Auth::id())->findOrFail($id);

        // PROTEKSI: Hanya izinkan edit jika masih Draft ATAU statusnya Ditolak
        if (!$logbook->is_draft && $logbook->status_verifikasi !== 'ditolak') {
            return redirect()->back()->with('error', 'Laporan yang sudah dikirim atau disetujui tidak dapat diubah.');
        }

        $request->validate([
            'judul_kegiatan' => 'required|string|max:255',
            'deskripsi_kegiatan' => 'required|string',
        ]);

        $logbook->update([
            'judul_kegiatan' => $request->judul_kegiatan,
            'deskripsi_kegiatan' => $request->deskripsi_kegiatan,
            // Jika tadinya ditolak, kembalikan statusnya agar bisa diproses lagi
            'status_verifikasi' => $logbook->status_verifikasi === 'ditolak' ? 'pending' : $logbook->status_verifikasi,
        ]);

        return redirect()->back()->with('success', 'Perubahan logbook berhasil disimpan.');
    }

    /**
     * 4. Mengirim Semua Draft Mingguan
     */
    public function submitMingguan()
    {
        $user_id = Auth::id();
        
        Logbook_mhs::where('user_id', $user_id)
            ->where('is_draft', true)
            ->update([
                'is_draft' => false, 
                'status_verifikasi' => 'pending'
            ]);

        return redirect()->back()->with('success', 'Misi Selesai! Logbook mingguan berhasil dikirim ke Admin.');
    }
}