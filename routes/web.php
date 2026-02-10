<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\MahasiswaController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return view('welcome');
});

// Penengah Arus (Satu-satunya rute /dashboard)
Route::get('/dashboard', function () {
    $user = Auth::user();
    // Kita liat sistem ngebaca role kamu apa
    return "Role kamu di sistem adalah: " . ($user->role ?? 'KOSONG/NULL'); 
})->middleware(['auth']);

// Jalur Admin
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
});

// Jalur Mahasiswa
Route::middleware(['auth', 'role:mahasiswa'])->group(function () {
    Route::get('/mahasiswa/dashboard', [MahasiswaController::class, 'index'])->name('mahasiswa.dashboard');
});

require __DIR__.'/auth.php';