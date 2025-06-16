<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function __construct(
        private UserService $userService
    ) {}

    /**
     * Display a listing of users.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'role', 'status']);
        $perPage = $request->get('per_page', 15);

        $users = $this->userService->getUsers($filters, $perPage);

        return response()->json([
            'success' => true,
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ]
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(CreateUserRequest $request): JsonResponse
    {
        try {
            $user = $this->userService->createUser($request->validated());

            return response()->json([
                'success' => true,
                'data' => $user,
                'message' => 'User created successfully'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('User creation failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create user. Please try again.'
            ], 500);
        }
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): JsonResponse
    {
        $user->load(['roles', 'permissions']);

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        try {
            $user = $this->userService->updateUser($user, $request->validated());

            return response()->json([
                'success' => true,
                'data' => $user,
                'message' => 'User updated successfully'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('User update failed: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update user. Please try again.'
            ], 500);
        }
    }

    /**
     * Remove the specified user.
     */
    public function destroy(User $user): JsonResponse
    {
        try {
            $this->userService->deleteUser($user);

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Assign roles to user (supports both single role and multiple roles).
     */
    public function assignRole(Request $request, User $user): JsonResponse
    {
        // Support both single role_id and multiple role_ids
        $request->validate([
            'role_id' => 'sometimes|integer|exists:roles,id',
            'role_ids' => 'sometimes|array|min:1',
            'role_ids.*' => 'integer|exists:roles,id'
        ]);

        // Ensure at least one is provided
        if (!$request->has('role_id') && !$request->has('role_ids')) {
            return response()->json([
                'success' => false,
                'message' => 'Either role_id or role_ids must be provided',
                'errors' => ['role_ids' => ['Either role_id or role_ids is required']]
            ], 422);
        }

        try {
            if ($request->has('role_ids') && !empty($request->role_ids)) {
                // Assign multiple roles
                $this->userService->assignRoles($user, $request->role_ids);
                $message = 'Roles assigned successfully';
            } elseif ($request->has('role_id')) {
                // Assign single role
                $this->userService->assignRole($user, $request->role_id);
                $message = 'Role assigned successfully';
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'No valid roles provided',
                    'errors' => ['role_ids' => ['At least one role must be provided']]
                ], 422);
            }

            return response()->json([
                'success' => true,
                'message' => $message
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to assign role(s): ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove role from user.
     */
    public function removeRole(User $user, int $roleId): JsonResponse
    {
        try {
            $this->userService->removeRole($user, $roleId);

            return response()->json([
                'success' => true,
                'message' => 'Role removed successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove role: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Assign permission to user.
     */
    public function assignPermission(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'permission_id' => 'required|integer|exists:permissions,id'
        ]);

        try {
            $this->userService->assignPermission($user, $request->permission_id);

            return response()->json([
                'success' => true,
                'message' => 'Permission assigned successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to assign permission: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove permission from user.
     */
    public function removePermission(User $user, int $permissionId): JsonResponse
    {
        try {
            $this->userService->removePermission($user, $permissionId);

            return response()->json([
                'success' => true,
                'message' => 'Permission removed successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove permission: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk assign permissions to user.
     */
    public function assignPermissions(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'permission_ids' => 'required|array',
            'permission_ids.*' => 'integer|exists:permissions,id'
        ]);

        try {
            $this->userService->assignPermissions($user, $request->permission_ids);

            return response()->json([
                'success' => true,
                'message' => 'Permissions assigned successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to assign permissions: ' . $e->getMessage()
            ], 500);
        }
    }
}
