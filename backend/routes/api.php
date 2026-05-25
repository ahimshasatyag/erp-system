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
});