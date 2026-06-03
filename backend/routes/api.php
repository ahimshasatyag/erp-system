<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\Menu;

Route::post('/login', [AuthController::class, 'login']);
Route::get('/login', function () {
    return response()->json(['message' => 'Unauthenticated.'], 401);
})->name('login');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Menu Dynamic Sidebar API
    Route::get('/menu/sidebar', [Menu::class, 'sidebar']);

    // CRUD Menus (Protected by Menu Policy/Middleware inside Controller or routes)
    Route::apiResource('menus', Menu::class);
    
    // CSR Module
    Route::get('/csr-form-data', [\App\Http\Controllers\API\csr\Cform::class, 'formData']);
    Route::post('/csr/confirm', [\App\Http\Controllers\API\csr\Cform::class, 'confirm']);
    Route::post('/csr/cancel', [\App\Http\Controllers\API\csr\Cform::class, 'cancel']);
    Route::post('/csr/isi-otomatis', [\App\Http\Controllers\API\csr\Cform::class, 'isiOtomatis']);
    Route::post('/csr/add-new-cst', [\App\Http\Controllers\API\csr\Cform::class, 'addNewCst']);
    Route::apiResource('csr', \App\Http\Controllers\API\csr\Cform::class)->parameters([
        'csr' => 'csr_code'
    ]);

    // CST Module
    Route::post('/cst/close', [\App\Http\Controllers\API\cst\Cform::class, 'close']);
    Route::post('/cst/cancel', [\App\Http\Controllers\API\cst\Cform::class, 'cancel']);
    Route::apiResource('cst', \App\Http\Controllers\API\cst\Cform::class)->parameters([
        'cst' => 'cst_code'
    ]);

    // LKT Module
    Route::post('/lkt/confirm', [\App\Http\Controllers\API\lkt\Cform::class, 'confirm']);
    Route::post('/lkt/close', [\App\Http\Controllers\API\lkt\Cform::class, 'close']);
    Route::post('/lkt/cancel', [\App\Http\Controllers\API\lkt\Cform::class, 'cancel']);
    Route::post('/lkt/visit', [\App\Http\Controllers\API\lkt\Cform::class, 'saveVisit']);
    Route::get('/lkt/visit/{subCode}', [\App\Http\Controllers\API\lkt\Cform::class, 'getVisit']);
    Route::post('/lkt/visit/cancel', [\App\Http\Controllers\API\lkt\Cform::class, 'cancelVisit']);
    Route::post('/lkt/visit/{subCode}', [\App\Http\Controllers\API\lkt\Cform::class, 'updateVisit']);
    Route::post('/lkt/part', [\App\Http\Controllers\API\lkt\Cform::class, 'savePart']);
    Route::post('/lkt/part-visit', [\App\Http\Controllers\API\lkt\Cform::class, 'savePartVisit']);
    Route::apiResource('lkt', \App\Http\Controllers\API\lkt\Cform::class)->parameters([
        'lkt' => 'lkt_code'
    ]);

    // Log Book Product Module
    Route::apiResource('log-books', \App\Http\Controllers\API\logbookproduct\LogBookProductController::class);
});