<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Absensi_mhs extends Model
{
    protected $table = 'absensi';
    protected $fillable = [
        'user_id', 'tanggal', 'jam_masuk', 'jam_pulang', 'lat_masuk', 'long_masuk', 'lat_pulang',
        'foto_masuk', 'foto_pulang', 'status', 'long_pulang'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
