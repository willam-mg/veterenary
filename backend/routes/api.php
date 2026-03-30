<?php

use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\ClinicalRecordController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PetController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\VeterinarianController;
use App\Http\Controllers\Api\VeterinaryServiceController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('/health', fn () => response()->json([
        'message' => 'Veterinary API is healthy.',
        'data' => ['status' => 'ok'],
    ]));

    Route::prefix('auth')->group(function (): void {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::middleware('auth:sanctum')->group(function (): void {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
        });
    });

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/dashboard', [DashboardController::class, 'index']);

        Route::apiResource('users', UserController::class);
        Route::apiResource('clients', ClientController::class);
        Route::apiResource('pets', PetController::class);
        Route::apiResource('veterinarians', VeterinarianController::class);
        Route::apiResource('appointments', AppointmentController::class);
        Route::apiResource('clinical-records', ClinicalRecordController::class);
        Route::apiResource('veterinary-services', VeterinaryServiceController::class);
    });
});
