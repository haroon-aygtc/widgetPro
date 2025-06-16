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
        return DB::transaction(function () use ($data)
        {
        try {
        $userId = Auth::id();
        $modelId = $data['model_id'];
        $userProviderId = $data['user_provider_id'];
        $customName = $data['custom_name'];

        $userProvider = UserAIProvider::where('id', $userProviderId)
                                     ->where('user_id', $userId)
                                     ->firstOrFail();

        $model = AIModel::findOrFail($modelId);

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

        if ($model->provider_id !== $userProvider->provider_id) {
            Log::error('Model does not belong to the specified provider', [
                'model_id' => $modelId,
                'user_provider_id' => $userProviderId,
                'user_id' => $userId
            ]);
            return [
                'success' => false,
                'message' => 'Model does not belong to the specified provider'
            ];
        }

            $userModel = UserAIModel::updateOrCreate(
                [
                    'user_id' => $userId,
                    'model_id' => $modelId,
                    'user_provider_id' => $userProviderId
                ],
                [
                    'user_id' => $userId,
                    'model_id' => $modelId
                ],
                [
                    'user_provider_id' => $userProviderId,
                    'is_active' => true,
                    'custom_name' => $customName
                ]
            );

            $userModel->load(['model.provider', 'userProvider']);

                return [
                'success' => true,
                'message' => 'AI model added successfully',
                'data' => $userModel
            ];
            } catch (\Exception $e) {
            Log::error('Failed to add AI model', [
                'user_id' => $userId,
                'model_id' => $modelId,
                'error' => $e->getMessage()
            ]);
            return [
                'success' => false,
                'message' => 'Failed to add AI model'
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
