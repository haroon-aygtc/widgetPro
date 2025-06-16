<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\UserAIProvider;
use Illuminate\Support\Facades\Auth;

class UserProviderService
{
    public function getUserProvider(array $filters = [], int $perPage = 15)
    {
        return DB::transaction(function () use ($filters, $perPage) {
            $userProviders = UserAIProvider::with('provider')
                ->forUser(Auth::id())
                ->active()
                ->paginate($perPage);

            return [
                'success' => true,
                'data' => $userProviders
            ];
        });
    }

    public function storeUserProvider(array $data)
    {
        return DB::transaction(function () use ($data) {
            $userProvider = UserAIProvider::create($data);
            return [
                'success' => true,
                'data' => $userProvider
            ];
        });
    }

    public function updateUserProviderStatus($data)
    {
        return DB::transaction(function () use ($data) {
            try {
                $userProvider = UserAIProvider::where('user_id', $data['user_id'])->firstOrFail();
                $userProvider->update(['is_active' => $data['is_active']]);

                return [
                    'success' => true,
                    'message' => 'AI provider status updated successfully',
                    'data' => $userProvider
                ];
            } catch (\Exception $e) {
                throw $e;
            }
        });
    }

    public function deleteUserProvider($providerId)
    {
        return DB::transaction(function () use ($providerId) {
            $userProvider = UserAIProvider::findOrFail($providerId);
            $userProvider->delete();


        return [
            'success' => true,
            'data' => $userProvider
        ];
        });
    }


}