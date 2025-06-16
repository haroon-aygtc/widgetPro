<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\UserActivityController;

// CSRF Cookie Route (for SPA authentication)
Route::get('/sanctum/csrf-cookie', [AuthController::class, 'csrfCookie']);

// Public Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Password Reset Routes
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Email Verification Routes
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->middleware(['signed'])
    ->name('verification.verify');

// Protected Authentication Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Email Verification for authenticated users
    Route::post('/email/verification-notification', [AuthController::class, 'sendEmailVerification']);
});

// User Management Routes
Route::prefix('users')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::post('/', [UserController::class, 'store']);
    Route::get('/{user}', [UserController::class, 'show']);
    Route::put('/{user}', [UserController::class, 'update']);
    Route::delete('/{user}', [UserController::class, 'destroy']);

    // Role assignment
    Route::post('/{user}/roles', [UserController::class, 'assignRole']);
    Route::delete('/{user}/roles/{role}', [UserController::class, 'removeRole']);

    // Permission assignment
    Route::post('/{user}/permissions', [UserController::class, 'assignPermission']);
    Route::delete('/{user}/permissions/{permission}', [UserController::class, 'removePermission']);
    Route::post('/{user}/permissions/bulk', [UserController::class, 'assignPermissions']);
});

// Role Management Routes
Route::prefix('roles')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [RoleController::class, 'index']);
    Route::post('/', [RoleController::class, 'store']);
    Route::get('/{role}', [RoleController::class, 'show']);
    Route::put('/{role}', [RoleController::class, 'update']);
    Route::delete('/{role}', [RoleController::class, 'destroy']);
});

// Get permissions grouped by category (moved outside roles prefix)
Route::get('/permissions/grouped', [RoleController::class, 'permissions'])->middleware('auth:sanctum');

// Permission Management Routes
Route::prefix('permissions')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [PermissionController::class, 'index']);
    Route::post('/', [PermissionController::class, 'store']);
    Route::get('/{permission}', [PermissionController::class, 'show']);
    Route::put('/{permission}', [PermissionController::class, 'update']);
    Route::delete('/{permission}', [PermissionController::class, 'destroy']);
    Route::get('/categories/list', [PermissionController::class, 'categories']);
    Route::get('/{permission}/users', [PermissionController::class, 'users']);
    Route::get('/{permission}/roles', [PermissionController::class, 'roles']);
});

// User Activity Routes
Route::prefix('user-activities')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [UserActivityController::class, 'index']);
    Route::get('/statistics', [UserActivityController::class, 'statistics']);
    Route::get('/types', [UserActivityController::class, 'types']);
    Route::get('/export', [UserActivityController::class, 'export']);
});

// Widget Management Routes
Route::prefix('widgets')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [App\Http\Controllers\WidgetController::class, 'index']);
    Route::post('/', [App\Http\Controllers\WidgetController::class, 'store']);
    Route::get('/{widget}', [App\Http\Controllers\WidgetController::class, 'show']);
    Route::put('/{widget}', [App\Http\Controllers\WidgetController::class, 'update']);
    Route::delete('/{widget}', [App\Http\Controllers\WidgetController::class, 'destroy']);

    // Widget specific actions
    Route::patch('/{widget}/toggle', [App\Http\Controllers\WidgetController::class, 'toggle']);
    Route::get('/{widget}/embed', [App\Http\Controllers\WidgetController::class, 'embed']);
    Route::get('/{widget}/analytics', [App\Http\Controllers\WidgetController::class, 'analytics']);
    Route::post('/{widget}/duplicate', [App\Http\Controllers\WidgetController::class, 'duplicate']);
    Route::get('/{widget}/export', [App\Http\Controllers\WidgetController::class, 'export']);

    // Widget utilities
    Route::post('/import', [App\Http\Controllers\WidgetController::class, 'import']);
    Route::post('/validate', [App\Http\Controllers\WidgetController::class, 'validate']);
    Route::post('/test', [App\Http\Controllers\WidgetController::class, 'test']);
});

