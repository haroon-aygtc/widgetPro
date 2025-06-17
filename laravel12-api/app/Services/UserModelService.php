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
            try {
                // Get user's configured providers first
                $userProviderIds = UserAIProvider::where('user_id', Auth::id())
                    ->where('is_active', true)
                    ->pluck('id')
                    ->toArray();

                if (empty($userProviderIds)) {
                    return [
                        'success' => true,
                        'data' => [],
                        'message' => 'No providers configured. Please configure a provider first.'
                    ];
                }

                $query = UserAIModel::with(['model.provider', 'userProvider.provider'])
                    ->where('user_id', Auth::id())
                    ->whereIn('user_provider_id', $userProviderIds) // Only user's configured providers
                    ->where('is_active', true);

                // Apply specific provider filter if specified
                if (!empty($filters['provider_id'])) {
                    $query->whereHas('userProvider', function($q) use ($filters) {
                        $q->where('provider_id', $filters['provider_id'])
                          ->where('user_id', Auth::id()); // Double-check user ownership
                    });
                }

                $userModels = $query->orderBy('is_default', 'desc')
                    ->orderBy('created_at', 'desc')
                    ->get();

                return [
                    'success' => true,
                    'data' => $userModels
                ];
            } catch (\Exception $e) {
                return [
                    'success' => false,
                    'message' => 'Failed to retrieve user models: ' . $e->getMessage()
                ];
            }
        });
    }

    public function storeUserModel(array $data)
    {
        return DB::transaction(function () use ($data) {
            try {
                // Validate required fields
                if (!isset($data['model_id']) || !isset($data['user_provider_id'])) {
                    throw new \Exception('Model ID and User Provider ID are required');
                }

                // Verify user owns the provider
                $userProvider = UserAIProvider::where('id', $data['user_provider_id'])
                    ->where('user_id', Auth::id())
                    ->where('is_active', true)
                    ->first();

                if (!$userProvider) {
                    throw new \Exception('Provider not found or not configured by user');
                }

                // Verify model belongs to the same provider
                $model = AIModel::where('id', $data['model_id'])
                    ->where('provider_id', $userProvider->provider_id)
                    ->where('is_active', true)
                    ->first();

                if (!$model) {
                    throw new \Exception('Model not found or does not belong to the configured provider');
                }

                // Add user_id to data
                $data['user_id'] = Auth::id();
                $data['is_active'] = $data['is_active'] ?? true;
                $data['is_default'] = $data['is_default'] ?? false;

                // If setting as default, unset other default models for this user and provider
                if ($data['is_default']) {
                    UserAIModel::where('user_id', Auth::id())
                        ->where('user_provider_id', $data['user_provider_id'])
                        ->where('is_default', true)
                        ->update(['is_default' => false]);
                }

                // Check if user already has this model
                $existingModel = UserAIModel::where('user_id', Auth::id())
                    ->where('model_id', $data['model_id'])
                    ->where('user_provider_id', $data['user_provider_id'])
                    ->first();

                if ($existingModel) {
                    // Update existing model
                    $existingModel->update([
                        'is_active' => $data['is_active'] ?? true,
                        'is_default' => $data['is_default'] ?? false,
                        'custom_name' => $data['custom_name'] ?? $existingModel->custom_name
                    ]);
                    $userModel = $existingModel;
                } else {
                    // Create new model
                    $userModel = UserAIModel::create($data);
                }

                // Load relationships
                $userModel->load(['model.provider', 'userProvider.provider']);

                return [
                    'success' => true,
                    'data' => $userModel,
                    'message' => 'Model added to your collection successfully'
                ];
            } catch (\Exception $e) {
                return [
                    'success' => false,
                    'message' => 'Failed to add model: ' . $e->getMessage()
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
            try {
                // Ensure user isolation - only delete models owned by authenticated user
                $userModel = UserAIModel::where('id', $modelId)
                    ->where('user_id', Auth::id())
                    ->firstOrFail();

                $userModel->delete();

                return [
                    'success' => true,
                    'data' => $userModel,
                    'message' => 'Model removed successfully'
                ];
            } catch (\Exception $e) {
                return [
                    'success' => false,
                    'message' => 'Failed to remove model: ' . $e->getMessage()
                ];
            }
        });
    }

    public function updateUserModelStatus($modelId, array $data)
    {
        return DB::transaction(function () use ($modelId, $data) {
            try {
                // Ensure user isolation - only update models owned by authenticated user
                $userModel = UserAIModel::where('id', $modelId)
                    ->where('user_id', Auth::id())
                    ->firstOrFail();

                // If setting as default, unset other default models for this user
                if (isset($data['is_default']) && $data['is_default']) {
                    UserAIModel::where('user_id', Auth::id())
                        ->where('id', '!=', $modelId)
                        ->where('is_default', true)
                        ->update(['is_default' => false]);
                }

                $userModel->update($data);
                $userModel->load(['model.provider', 'userProvider.provider']);

                return [
                    'success' => true,
                    'data' => $userModel,
                    'message' => 'Model status updated successfully'
                ];
            } catch (\Exception $e) {
                return [
                    'success' => false,
                    'message' => 'Failed to update model status: ' . $e->getMessage()
                ];
            }
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
