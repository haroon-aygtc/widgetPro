<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserAIProvider extends Model
{
    use HasFactory;

    protected $table = 'user_ai_providers';

    protected $fillable = [
        'user_id',
        'provider_id',
        'api_key',
        'is_active',
        'is_default',
        'last_tested_at',
        'test_status',
        'test_message'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_default' => 'boolean',
        'last_tested_at' => 'datetime'
    ];

    protected $hidden = [
        'api_key'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(AIProvider::class, 'provider_id');
    }

    public function userModels(): HasMany
    {
        return $this->hasMany(UserAIModel::class, 'user_provider_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeTestStatus($query, $status)
    {
        return $query->where('test_status', $status);
    }
}
