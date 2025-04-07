<?php

use App\Http\Controllers\GenderController;
use Database\Factories\GenderFactory;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('utilities/crab/genders', GenderController::class);

    Route::prefix('utilities')->group(function () {
        Route::get('/', function () {
            return inertia('Utilities/Index');
        });

        Route::prefix('crab')->group(function () {
            // Route::get('species', function () {
            //     return inertia('Utilities/Crab/Species');
            // });

            Route::get('gender', function () {
                return inertia('Utilities/Crab/Gender');
            });

            // Route::get('health-status', function () {
            //     return inertia('Utilities/Crab/HealthStatus');
            // });
        });
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/crabs.php';
require __DIR__ . '/ponds.php';
