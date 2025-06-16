<?php

namespace App\Services;

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use App\Models\UserActivity;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class UserService
{
    /**
     * Get paginated users with optional filters.
     */
    public function getUsers(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = User::with(['roles', 'permissions']);

        if (!empty($filters['search'])) {
            $query->search($filters['search']);
        }

        if (!empty($filters['role'])) {
            $query->withRole($filters['role']);
        }

        if (!empty($filters['status'])) {
            $query->status($filters['status']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Create a new user.
     */
    public function createUser(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'status' => 'active',
            ]);

            if (!empty($data['role_ids'])) {
                $user->roles()->sync($data['role_ids']);
            }

            $this->logActivity($user->id, 'user_create', "User account created: {$user->email}");

            return $user->load(['roles', 'permissions']);
        });
    }

    /**
     * Update an existing user.
     */
    public function updateUser(User $user, array $data): User
    {
        return DB::transaction(function () use ($user, $data) {
            $user->update(array_filter([
                'name' => $data['name'] ?? null,
                'email' => $data['email'] ?? null,
                'status' => $data['status'] ?? null,
            ]));

            if (isset($data['role_ids'])) {
                $user->roles()->sync($data['role_ids']);
            }

            $this->logActivity($user->id, 'user_update', "User account updated: {$user->email}");

            return $user->load(['roles', 'permissions']);
        });
    }

    /**
     * Delete a user.
     */
    public function deleteUser(User $user): bool
    {
        $this->logActivity($user->id, 'user_delete', "User account deleted: {$user->email}");

        return $user->delete();
    }

    /**
     * Assign a role to a user.
     */
    public function assignRole(User $user, int $roleId): void
    {
        $role = Role::findOrFail($roleId);

        if (!$user->hasRole($roleId)) {
            $user->roles()->attach($roleId);
            $this->logActivity($user->id, 'role_assign', "Role '{$role->name}' assigned to user");
        }
    }

    /**
     * Remove a role from a user.
     */
    public function removeRole(User $user, int $roleId): void
    {
        $role = Role::findOrFail($roleId);

        if ($user->hasRole($roleId)) {
            $user->roles()->detach($roleId);
            $this->logActivity($user->id, 'role_remove', "Role '{$role->name}' removed from user");
        }
    }

    /**
     * Bulk assign roles to a user.
     */
    public function assignRoles(User $user, array $roleIds): void
    {
        $user->roles()->sync($roleIds);
        $count = count($roleIds);
        $this->logActivity($user->id, 'roles_bulk_assign', "Bulk assigned {$count} roles to user");
    }

    /**
     * Assign a permission to a user.
     */
    public function assignPermission(User $user, int $permissionId): void
    {
        $permission = Permission::findOrFail($permissionId);

        if (!$user->permissions->contains($permissionId)) {
            $user->permissions()->attach($permissionId);
            $this->logActivity($user->id, 'permission_assign', "Permission '{$permission->name}' assigned to user");
        }
    }

    /**
     * Remove a permission from a user.
     */
    public function removePermission(User $user, int $permissionId): void
    {
        $permission = Permission::findOrFail($permissionId);

        if ($user->permissions->contains($permissionId)) {
            $user->permissions()->detach($permissionId);
            $this->logActivity($user->id, 'permission_remove', "Permission '{$permission->name}' removed from user");
        }
    }

    /**
     * Bulk assign permissions to a user.
     */
    public function assignPermissions(User $user, array $permissionIds): void
    {
        $user->permissions()->sync($permissionIds);
        $count = count($permissionIds);
        $this->logActivity($user->id, 'permissions_bulk_assign', "Bulk assigned {$count} permissions to user");
    }

    /**
     * Log user activity.
     */
    private function logActivity(int $userId, string $action, string $description, string $status = 'success'): void
    {
        UserActivity::create([
            'user_id' => $userId,
            'action' => $action,
            'description' => $description,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'location' => $this->getLocationFromIp(request()->ip()),
            'status' => $status,
            'details' => json_encode(request()->all()),
        ]);
    }

    /**
     * Get location from IP address (simplified).
     */
    private function getLocationFromIp(string $ip): string
    {
        // In a real application, you would use a service like GeoIP
        return 'Unknown Location';
    }
}
