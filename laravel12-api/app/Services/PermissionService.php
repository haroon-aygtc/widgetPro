<?php

namespace App\Services;

use App\Models\Permission;
use Illuminate\Pagination\LengthAwarePaginator;

class PermissionService
{
    /**
     * Get paginated permissions with optional filters.
     */
    public function getPermissions(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Permission::withCount(['roles', 'users']);

        if (!empty($filters['search'])) {
            $query->search($filters['search']);
        }

        if (!empty($filters['category'])) {
            $query->category($filters['category']);
        }

        return $query->orderBy('category')->orderBy('name')->paginate($perPage);
    }

    /**
     * Create a new permission.
     */
    public function createPermission(array $data): Permission
    {
        return Permission::create([
            'name' => $data['name'],
            'display_name' => $data['display_name'],
            'description' => $data['description'],
            'category' => $data['category'],
        ]);
    }

    /**
     * Update an existing permission.
     */
    public function updatePermission(Permission $permission, array $data): Permission
    {
        $permission->update(array_filter([
            'name' => $data['name'] ?? null,
            'display_name' => $data['display_name'] ?? null,
            'description' => $data['description'] ?? null,
            'category' => $data['category'] ?? null,
        ]));

        return $permission;
    }

    /**
     * Delete a permission.
     */
    public function deletePermission(Permission $permission): bool
    {
        // Detach from all roles and users
        $permission->roles()->detach();
        $permission->users()->detach();

        return $permission->delete();
    }

    /**
     * Get all permission categories.
     */
    public function getCategories(): array
    {
        return Permission::distinct('category')
            ->orderBy('category')
            ->pluck('category')
            ->toArray();
    }
}
