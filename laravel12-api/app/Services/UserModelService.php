<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\UserAIModel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\AIModel;
use App\Models\UserAIProvider;

class UserModelService
{
    public function getUserModels($filters = [])
    {
        return DB::transaction(function () use ($filters) {
            $query = UserAIModel::with('model.provider', 'userProvider.provider')
                ->forUser(Auth::id())
                ->active();

            // Apply provider filter if specified
            if (!empty($filters['provider_id'])) {
                $query->whereHas('userProvider', function($q) use ($filters) {
                    $q->where('provider_id', $filters['provider_id']);
                });
            }

            $userModels = $query->get();

            return [
                'success' => true,
                'data' => $userModels
            ];
        });
    }

    public function storeUserModel($data)
    {
        return DB::transaction(function () use ($data) {
            try {
                $userId = Auth::id();
                $modelId = $data['model_id'];
                $userProviderId = $data['user_provider_id'];
                $customName = $data['custom_name'] ?? null;

                // Validate user provider exists and belongs to user
                $userProvider = UserAIProvider::where('id', $userProviderId)
                                             ->where('user_id', $userId)
                                             ->first();

                if (!$userProvider) {
                    Log::error('User provider not found', [
                        'user_provider_id' => $userProviderId,
                        'user_id' => $userId
                    ]);
                    return [
                        'success' => false,
                        'message' => 'User provider not found'
                    ];
                }

                // Validate model exists
                $model = AIModel::find($modelId);
                if (!$model) {
                    Log::error('Model not found', [
                        'model_id' => $modelId,
                        'user_id' => $userId
                    ]);
                    return [
                        'success' => false,
                        'message' => 'Model not found'
                    ];
                }

                // Validate model belongs to the provider
                if ($model->provider_id !== $userProvider->provider_id) {
                    Log::error('Model does not belong to the specified provider', [
                        'model_id' => $modelId,
                        'model_provider_id' => $model->provider_id,
                        'user_provider_id' => $userProvider->provider_id,
                        'user_id' => $userId
                    ]);
                    return [
                        'success' => false,
                        'message' => 'Model does not belong to the specified provider'
                    ];
                }

                // Check if model is already added by this user
                $existingUserModel = UserAIModel::where('user_id', $userId)
                                                ->where('model_id', $modelId)
                                                ->where('user_provider_id', $userProviderId)
                                                ->first();

                if ($existingUserModel) {
                    // Update existing model
                    $existingUserModel->update([
                        'is_active' => true,
                        'custom_name' => $customName
                    ]);
                    $userModel = $existingUserModel;
                    
                    Log::info('Updated existing user model', [
                        'user_model_id' => $userModel->id,
                        'user_id' => $userId,
                        'model_id' => $modelId
                    ]);
                } else {
                    // Create new user model
                    $userModel = UserAIModel::create([
                        'user_id' => $userId,
                        'model_id' => $modelId,
                        'user_provider_id' => $userProviderId,
                        'is_active' => true,
                        'custom_name' => $customName
                    ]);
                    
                    Log::info('Created new user model', [
                        'user_model_id' => $userModel->id,
                        'user_id' => $userId,
                        'model_id' => $modelId
                    ]);
                }

                // Load relationships
                $userModel->load(['model.provider', 'userProvider.provider']);

                return [
                    'success' => true,
                    'message' => 'AI model added successfully',
                    'data' => $userModel
                ];
            } catch (\Exception $e) {
                Log::error('Failed to add AI model', [
                    'user_id' => $userId ?? null,
                    'model_id' => $modelId ?? null,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                return [
                    'success' => false,
                    'message' => 'Failed to add AI model: ' . $e->getMessage()
                ];
            }
        });
    }


    public function updateUserModel(array $data, $modelId)
    {
        return DB::transaction(function () use ($data, $modelId) {
            $userModel = UserAIModel::findOrFail($modelId);
            $userModel->update($data);

            return [
                'success' => true,
                'data' => $userModel
            ];
        });
    }

    public function deleteUserModel($modelId)
    {
        return DB::transaction(function () use ($modelId) {
            $userModel = UserAIModel::findOrFail($modelId);
            $userModel->delete();

            return [
                'success' => true,
                'data' => $userModel
            ];
        });
    }

    public function updateUserModelStatus($modelId, array $data)
    {
        return DB::transaction(function () use ($modelId, $data) {
            $userModel = UserAIModel::findOrFail($modelId);
            $userModel->update($data);

            return [
                'success' => true,
                'data' => $userModel
            ];
        });
    }

    public function isDefultUserModel($modelId)
    {
        return DB::transaction(function () use ($modelId) {
            $userModel = UserAIModel::findOrFail($modelId);
            $userModel->is_default = true;
            $userModel->save();

            return [
                'success' => true,
                'data' => $userModel
            ];
        });
    }
}
