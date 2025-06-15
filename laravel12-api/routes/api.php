<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\UserActivityController;

// CSRF Cookie Route
Route::get('/sanctum/csrf-cookie', [AuthController::class, 'csrfCookie']);

// Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Get authenticated user
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');

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
});

// User Activity Routes
Route::prefix('user-activities')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [UserActivityController::class, 'index']);
    Route::get('/statistics', [UserActivityController::class, 'statistics']);
    Route::get('/types', [UserActivityController::class, 'types']);
    Route::get('/export', [UserActivityController::class, 'export']);
});
