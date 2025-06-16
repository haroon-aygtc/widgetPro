<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreatePermissionRequest;
use App\Http\Requests\UpdatePermissionRequest;
use App\Models\Permission;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PermissionController extends Controller
{
    public function __construct(
        private PermissionService $permissionService
    ) {}

    /**
     * Display a listing of permissions.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'category']);
        $perPage = $request->get('per_page', 15);

        $permissions = $this->permissionService->getPermissions($filters, $perPage);

        return response()->json([
            'success' => true,
            'data' => $permissions->items(),
            'meta' => [
                'current_page' => $permissions->currentPage(),
                'last_page' => $permissions->lastPage(),
                'per_page' => $permissions->perPage(),
                'total' => $permissions->total(),
            ]
        ]);
    }

    /**
     * Store a newly created permission.
     */
    public function store(CreatePermissionRequest $request): JsonResponse
    {
        try {
            $permission = $this->permissionService->createPermission($request->validated());

            return response()->json([
                'success' => true,
                'data' => $permission,
                'message' => 'Permission created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create permission: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified permission.
     */
    public function show(Permission $permission): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $permission
        ]);
    }

    /**
     * Update the specified permission.
     */
    public function update(UpdatePermissionRequest $request, Permission $permission): JsonResponse
    {
        try {
            $permission = $this->permissionService->updatePermission($permission, $request->validated());

            return response()->json([
                'success' => true,
                'data' => $permission,
                'message' => 'Permission updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update permission: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified permission.
     */
    public function destroy(Permission $permission): JsonResponse
    {
        try {
            $this->permissionService->deletePermission($permission);

            return response()->json([
                'success' => true,
                'message' => 'Permission deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete permission: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all permission categories.
     */
    public function categories(): JsonResponse
    {
        $categories = $this->permissionService->getCategories();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * Get users with this permission.
     */
    public function users(Permission $permission): \Illuminate\Http\JsonResponse
    {
        // Users with this permission directly
        $directUserIds = $permission->users()->pluck('users.id')->toArray();

        // Users with this permission via roles
        $roleIds = $permission->roles()->pluck('roles.id')->toArray();
        $viaRoleUserIds = \App\Models\User::whereHas('roles', function($q) use ($roleIds) {
            $q->whereIn('roles.id', $roleIds);
        })->pluck('id')->toArray();

        // Merge and get unique user IDs
        $allUserIds = array_unique(array_merge($directUserIds, $viaRoleUserIds));

        // Fetch users with their roles
        $users = \App\Models\User::whereIn('id', $allUserIds)->with('roles')->get();

        return response()->json(['success' => true, 'data' => $users]);
    }

    /**
     * Get roles with this permission.
     */
    public function roles(Permission $permission): \Illuminate\Http\JsonResponse
    {
        $roles = $permission->roles()->withCount('users')->get();
        return response()->json(['success' => true, 'data' => $roles]);
    }
}
