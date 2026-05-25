<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\Menu;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Menu Dynamic Sidebar API
    Route::get('/menu/sidebar', [Menu::class, 'sidebar']);

    // CRUD Menus (Protected by Menu Policy/Middleware inside Controller or routes)
    Route::apiResource('menus', Menu::class);
    
    // CSR Module
    Route::post('/csr/confirm', [\App\Http\Controllers\API\csr\Cform::class, 'confirm']);
    Route::post('/csr/cancel', [\App\Http\Controllers\API\csr\Cform::class, 'cancel']);
    Route::post('/csr/isi-otomatis', [\App\Http\Controllers\API\csr\Cform::class, 'isiOtomatis']);
    Route::apiResource('csr', \App\Http\Controllers\API\csr\Cform::class)->parameters([
        'csr' => 'csr_code'
    ]);
});