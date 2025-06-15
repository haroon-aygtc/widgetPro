<?php

namespace App\Services;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class RoleService
{
    /**
     * Get paginated roles with optional filters.
     */
    public function getRoles(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Role::with(['permissions'])->withCount('users');

        if (!empty($filters['search'])) {
            $query->search($filters['search']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Create a new role.
     */
    public function createRole(array $data): Role
    {
        return DB::transaction(function () use ($data) {
            $role = Role::create([
                'name' => $data['name'],
                'description' => $data['description'],
            ]);

            if (!empty($data['permission_ids'])) {
                $role->permissions()->sync($data['permission_ids']);
            }

            return $role->load(['permissions']);
        });
    }

    /**
     * Update an existing role.
     */
    public function updateRole(Role $role, array $data): Role
    {
        return DB::transaction(function () use ($role, $data) {
            $role->update(array_filter([
                'name' => $data['name'] ?? null,
                'description' => $data['description'] ?? null,
            ]));

            if (isset($data['permission_ids'])) {
                $role->permissions()->sync($data['permission_ids']);
            }

            return $role->load(['permissions']);
        });
    }

    /**
     * Delete a role.
     */
    public function deleteRole(Role $role): bool
    {
        return DB::transaction(function () use ($role) {
            // Detach all users and permissions
            $role->users()->detach();
            $role->permissions()->detach();

            return $role->delete();
        });
    }

    /**
     * Get all permissions grouped by category.
     */
    public function getPermissionsByCategory(): array
    {
        $permissions = Permission::orderBy('category')->orderBy('name')->get();

        return $permissions->groupBy('category')->toArray();
    }
}
