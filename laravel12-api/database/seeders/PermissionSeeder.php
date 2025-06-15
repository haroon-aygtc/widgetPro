<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // User Management
            [
                'name' => 'users.view',
                'display_name' => 'View Users',
                'description' => 'Can view user list and details',
                'category' => 'User Management'
            ],
            [
                'name' => 'users.create',
                'display_name' => 'Create Users',
                'description' => 'Can create new users',
                'category' => 'User Management'
            ],
            [
                'name' => 'users.edit',
                'display_name' => 'Edit Users',
                'description' => 'Can edit user information',
                'category' => 'User Management'
            ],
            [
                'name' => 'users.delete',
                'display_name' => 'Delete Users',
                'description' => 'Can delete users',
                'category' => 'User Management'
            ],
            
            // Role Management
            [
                'name' => 'roles.view',
                'display_name' => 'View Roles',
                'description' => 'Can view role list and details',
                'category' => 'Role Management'
            ],
            [
                'name' => 'roles.create',
                'display_name' => 'Create Roles',
                'description' => 'Can create new roles',
                'category' => 'Role Management'
            ],
            [
                'name' => 'roles.edit',
                'display_name' => 'Edit Roles',
                'description' => 'Can edit role information',
                'category' => 'Role Management'
            ],
            [
                'name' => 'roles.delete',
                'display_name' => 'Delete Roles',
                'description' => 'Can delete roles',
                'category' => 'Role Management'
            ],
            
            // Permission Management
            [
                'name' => 'permissions.view',
                'display_name' => 'View Permissions',
                'description' => 'Can view permission list and details',
                'category' => 'Permission Management'
            ],
            [
                'name' => 'permissions.create',
                'display_name' => 'Create Permissions',
                'description' => 'Can create new permissions',
                'category' => 'Permission Management'
            ],
            [
                'name' => 'permissions.edit',
                'display_name' => 'Edit Permissions',
                'description' => 'Can edit permission information',
                'category' => 'Permission Management'
            ],
            [
                'name' => 'permissions.delete',
                'display_name' => 'Delete Permissions',
                'description' => 'Can delete permissions',
                'category' => 'Permission Management'
            ],
            
            // Widget Management
            [
                'name' => 'widgets.view',
                'display_name' => 'View Widgets',
                'description' => 'Can view widget configurations',
                'category' => 'Widget Management'
            ],
            [
                'name' => 'widgets.create',
                'display_name' => 'Create Widgets',
                'description' => 'Can create new widget configurations',
                'category' => 'Widget Management'
            ],
            [
                'name' => 'widgets.edit',
                'display_name' => 'Edit Widgets',
                'description' => 'Can edit widget configurations',
                'category' => 'Widget Management'
            ],
            [
                'name' => 'widgets.delete',
                'display_name' => 'Delete Widgets',
                'description' => 'Can delete widget configurations',
                'category' => 'Widget Management'
            ],
            
            // Analytics
            [
                'name' => 'analytics.view',
                'display_name' => 'View Analytics',
                'description' => 'Can view analytics dashboard and reports',
                'category' => 'Analytics'
            ],
            [
                'name' => 'analytics.export',
                'display_name' => 'Export Analytics',
                'description' => 'Can export analytics data',
                'category' => 'Analytics'
            ],
            
            // System Settings
            [
                'name' => 'settings.view',
                'display_name' => 'View Settings',
                'description' => 'Can view system settings',
                'category' => 'System Settings'
            ],
            [
                'name' => 'settings.edit',
                'display_name' => 'Edit Settings',
                'description' => 'Can edit system settings',
                'category' => 'System Settings'
            ]
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission['name']],
                $permission
            );
        }
    }
}
