<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin role if it doesn't exist
        $adminRole = Role::firstOrCreate(
            ['name' => 'admin'],
            [
                'name' => 'admin',
                'description' => 'Administrator with full system access'
            ]
        );

        // Create super admin role if it doesn't exist
        $superAdminRole = Role::firstOrCreate(
            ['name' => 'super_admin'],
            [
                'name' => 'super_admin',
                'description' => 'Super Administrator with unrestricted access'
            ]
        );

        // Create user role if it doesn't exist
        $userRole = Role::firstOrCreate(
            ['name' => 'user'],
            [
                'name' => 'user',
                'description' => 'Regular user with basic access'
            ]
        );

        // Get all permissions
        $allPermissions = Permission::all();

        // Assign all permissions to super admin role
        if ($allPermissions->isNotEmpty()) {
            $superAdminRole->permissions()->sync($allPermissions->pluck('id'));
        }

        // Assign most permissions to admin role (excluding super admin specific ones)
        $adminPermissions = $allPermissions->filter(function ($permission) {
            return !in_array($permission->name, [
                'settings.edit', // Only super admin can edit system settings
            ]);
        });

        if ($adminPermissions->isNotEmpty()) {
            $adminRole->permissions()->sync($adminPermissions->pluck('id'));
        }

        // Assign basic permissions to user role
        $userPermissions = $allPermissions->filter(function ($permission) {
            return in_array($permission->name, [
                'widgets.view',
                'widgets.create',
                'widgets.edit',
                'analytics.view',
                'settings.view',
            ]);
        });

        if ($userPermissions->isNotEmpty()) {
            $userRole->permissions()->sync($userPermissions->pluck('id'));
        }

        // Create super admin user only if it doesn't exist
        // In production, you should change these credentials immediately after first login
        $superAdminEmail = env('SUPER_ADMIN_EMAIL', 'admin@yourdomain.com');
        $superAdminPassword = env('SUPER_ADMIN_PASSWORD', 'ChangeMe@123');

        $superAdmin = User::firstOrCreate(
            ['email' => $superAdminEmail],
            [
                'name' => 'System Administrator',
                'email' => $superAdminEmail,
                'password' => Hash::make($superAdminPassword),
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        // Assign super admin role
        if (!$superAdmin->hasRole('super_admin')) {
            $superAdmin->roles()->attach($superAdminRole->id);
        }

        $this->command->info('System administrator created successfully.');
        $this->command->info('Email: ' . $superAdminEmail);
        $this->command->warn('IMPORTANT: Change the default password immediately after first login!');

        if ($superAdminPassword === 'ChangeMe@123') {
            $this->command->error('WARNING: Using default password! Set SUPER_ADMIN_PASSWORD in .env file.');
        }
    }
}
