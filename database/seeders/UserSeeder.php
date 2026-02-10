<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::create([
            'nama_lengkap' => 'Admin Akpol',
            'nim_atau_nrp' => '123456',
            'email' => 'admin@akpol.go.id',
            'password' => bcrypt('admin123'),
            'role' => 'admin',
            'instansi_asal' => 'AKPOL',
        ]);
    }
}
