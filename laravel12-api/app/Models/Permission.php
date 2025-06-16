<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Permission extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'category',
    ];

    /**
     * The roles that belong to the permission.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_permissions');
    }

    /**
     * The users that have this permission directly.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_permissions');
    }

    /**
     * Get the roles count attribute.
     */
    public function getRolesCountAttribute(): int
    {
        return $this->roles()->count();
    }

    /**
     * Get the users count attribute.
     */
    public function getUsersCountAttribute(): int
    {
        // Users with this permission directly
        $directUserIds = $this->users()->pluck('users.id')->toArray();

        // Users with this permission via roles
        $roleIds = $this->roles()->pluck('roles.id')->toArray();
        $viaRoleUserIds = User::whereHas('roles', function($q) use ($roleIds) {
            $q->whereIn('roles.id', $roleIds);
        })->pluck('id')->toArray();

        // Merge and get unique user IDs count
        $allUserIds = array_unique(array_merge($directUserIds, $viaRoleUserIds));

        return count($allUserIds);
    }

    /**
     * Scope a query to search permissions.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('display_name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }

    /**
     * Scope a query to filter by category.
     */
    public function scopeCategory($query, $category)
    {
        return $query->where('category', $category);
    }
}
