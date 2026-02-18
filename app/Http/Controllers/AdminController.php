<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Absensi_mhs;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function index()
    {
        $total_taruna = User::where('role', 'mahasiswa')->count();
        $hadir_hari_ini = Absensi_mhs::where('tanggal', date('Y-m-d'))->count();
        $belum_hadir = $total_taruna - $hadir_hari_ini;
        $log_terbaru = Absensi_mhs::with('user') 
                        ->orderBy('created_at', 'desc')
                        ->take(10)
                        ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total' => $total_taruna,
                'hadir' => $hadir_hari_ini,
                'absen' => $belum_hadir,
            ],
            'logs' => $log_terbaru
        ]);
    }
    public function map()
    {
        $locations = Absensi_mhs::with('user')
                        ->where('tanggal', date('Y-m-d'))
                        ->whereNotNull('latitude')
                        ->whereNotNull('longitude')
                        ->get();

        return Inertia::render('Admin/MonitoringMap', [
            'locations' => $locations
        ]);
    }
}