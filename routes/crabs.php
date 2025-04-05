<?php

use App\Http\Controllers\CrabController;
use Illuminate\Support\Facades\Route;
// use Inertia\Inertia;

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::resource('crabs', CrabController::class);
// });

Route::resource('crabs', CrabController::class);
