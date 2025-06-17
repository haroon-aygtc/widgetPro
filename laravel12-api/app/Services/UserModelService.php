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

    public function storeUserModel(array $data)
    {
        return DB::transaction(function () use ($data) {
            $userModel = UserAIModel::create($data);

            return [
                'success' => true,
                'data' => $userModel
            ];
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
