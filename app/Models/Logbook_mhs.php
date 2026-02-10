<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Logbook_mhs extends Model
{
    protected $fillable = [
        'user_id', 'absensi_id', 'judul_kegiatan', 
        'deskripsi_kegiatan', 'foto_kegiatan', 
        'status_verifikasi', 'catatan_mentor'
    ];
    public function user(){
        return $this->belongsTo(User::class);
    }
}
