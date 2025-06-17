<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserAIModel extends Model
{
    use HasFactory;

    protected $table = 'user_ai_models';

    protected $fillable = [
        'user_id',
        'model_id',
        'user_provider_id',
        'is_active',
        'custom_name',
        'is_default',

    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_default' => 'boolean'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function model(): BelongsTo
    {
        return $this->belongsTo(AIModel::class, 'model_id');
    }

    public function userProvider(): BelongsTo
    {
        return $this->belongsTo(UserAIProvider::class, 'user_provider_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}
