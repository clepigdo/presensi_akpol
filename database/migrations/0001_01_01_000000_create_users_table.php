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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nama_lengkap');
            $table->string('nim_atau_nrp')->unique();
            $table->string('email')->unique();
            $table->string('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('role', ['admin', 'mahasiswa'])->default('mahasiswa');
            $table->string('instansi_asal')->nullable();
            $table->string('foto_profil')->nullable();
            $table->string('no_hp')->nullable();
            $table->string('jenis_kelamin', 1)->nullable();
            $table->text('alamat_domisili')->nullable();
            $table->longText('face_data')->nullable();
            $table->boolean('is_profile_completed')->default(false);
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
