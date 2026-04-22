<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\MahasiswaController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Mahasiswa\SetupProfileController;
use App\Http\Controllers\LogbookMhsController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::get('/dashboard', function () {
    $user = Auth::user();
    if ($user->role === 'admin') {
        return redirect()->route('admin.dashboard');
    } 
    return redirect()->route('mahasiswa.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


// ==========================================
// RUTE ADMIN
// ==========================================
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/logbooks', [AdminController::class, 'indexLogbook'])->name('logbooks.index');
    Route::post('/logbooks/{id}/verify', [AdminController::class, 'verifyLogbook'])->name('logbooks.verify');
});


// ==========================================
// RUTE MAHASISWA
// ==========================================
Route::middleware(['auth', 'role:mahasiswa'])->group(function () {
    
    // 1. Rute Setup Profil (Bisa diakses walau profil belum lengkap)
    // 1. Rute Setup Profil
    Route::get('/setup-profile', [ProfileController::class, 'setup'])->name('profile.setup');
    Route::post('/setup-profile', [ProfileController::class, 'storeSetup'])->name('profile.setup.store');

    Route::get('/mahasiswa/logbook', [LogbookMhsController::class, 'index'])->name('mahasiswa.logbook');
    Route::post('/mahasiswa/logbook', [LogbookMhsController::class, 'store'])->name('mahasiswa.logbook.store');
    Route::post('/mahasiswa/logbook/submit-mingguan', [LogbookMhsController::class, 'submitMingguan'])->name('mahasiswa.logbook.submit_mingguan');
    Route::put('/mahasiswa/logbook/{id}', [LogbookMhsController::class, 'update'])->name('mahasiswa.logbook.update');

    // 2. Rute Inti Mahasiswa (DILINDUNGI oleh middleware 'profile.completed')
    Route::middleware(['profile.completed'])->group(function () {
        Route::get('/mahasiswa/dashboard', [MahasiswaController::class, 'index'])->name('mahasiswa.dashboard');
        Route::post('/mahasiswa/absen', [MahasiswaController::class, 'store'])->name('mahasiswa.absen');
    });

});

require __DIR__.'/auth.php';