<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Logbook_mhs extends Model
{
    use HasFactory;

    // Beri tahu Laravel untuk menggunakan tabel 'logbooks'
    protected $table = 'logbooks';

    // Izinkan Mass Assignment untuk kolom-kolom ini
    protected $fillable = [
        'user_id',
        'absensi_id',
        'judul_kegiatan',
        'deskripsi_kegiatan',
        'foto_kegiatan',
        'status_verifikasi',
        'catatan_mentor'
    ];

    // Relasi ke tabel User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke tabel Absensi
    public function absensi()
    {
        return $this->belongsTo(Absensi_mhs::class, 'absensi_id');
    }
}