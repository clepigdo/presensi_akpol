<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('logbooks', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        $table->foreignId('absensi_id')->constrained('absensi')->onDelete('cascade');
        $table->string('judul_kegiatan');
        $table->text('deskripsi_kegiatan');
        $table->string('foto_kegiatan')->nullable();
        $table->enum('status_verifikasi', ['pending', 'disetujui', 'ditolak'])->default('pending');
        $table->text('catatan_mentor')->nullable();
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
