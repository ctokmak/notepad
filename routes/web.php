<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // API Routes for Notes (using web middleware for CSRF protection)
    Route::prefix('api')->middleware('throttle:60,1')->group(function () {
        Route::get('/notes', [NoteController::class, 'index'])->name('notes.index');
        Route::post('/notes', [NoteController::class, 'store'])->name('notes.store')->middleware('throttle:10,1');
        Route::get('/notes/{note}', [NoteController::class, 'show'])->name('notes.show');
        Route::put('/notes/{note}', [NoteController::class, 'update'])->name('notes.update')->middleware('throttle:20,1');
        Route::delete('/notes/{note}', [NoteController::class, 'destroy'])->name('notes.destroy')->middleware('throttle:5,1');
        Route::post('/notes/{note}/toggle-favorite', [NoteController::class, 'toggleFavorite'])->name('notes.toggle-favorite');
        Route::post('/notes/{note}/toggle-archive', [NoteController::class, 'toggleArchive'])->name('notes.toggle-archive');
        Route::get('/notes-stats', [NoteController::class, 'stats'])->name('notes.stats');
    });
});

require __DIR__.'/auth.php';
