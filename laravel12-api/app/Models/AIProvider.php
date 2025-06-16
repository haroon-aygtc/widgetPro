<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AIProvider extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'api_base_url',
        'is_free',
        'is_active',
        'logo_url',
        'documentation_url'
    ];

    protected $casts = [
        'is_free' => 'boolean',
        'is_active' => 'boolean'
    ];

    public function models(): HasMany
    {
        return $this->hasMany(AIModel::class, 'provider_id');
    }

    public function userProviders(): HasMany
    {
        return $this->hasMany(UserAIProvider::class, 'provider_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFree($query)
    {
        return $query->where('is_free', true);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('display_name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }
}
