<?php

use App\Http\Controllers\CrabTypeController;
use App\Http\Controllers\GenderController;
use Illuminate\Support\Facades\Route;

Route::prefix('utilities')->group(function () {
    Route::get('/', function () {
        return inertia('Utilities/Index');
    });
});

Route::resource('utilities/crab/genders', GenderController::class);

Route::resource('utilities/crab/crabTypes', CrabTypeController::class);
