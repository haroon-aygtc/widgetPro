<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\UserAIProvider;
use App\Models\AIProvider;
use Illuminate\Support\Facades\Auth;
use App\Services\AIModelService;

class UserProviderService
{
    protected $aiModelService;

    public function __construct(AIModelService $aiModelService)
    {
        $this->aiModelService = $aiModelService;
    }
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
            try {
                // Validate required fields
                if (!isset($data['provider_id']) || !isset($data['api_key'])) {
                    throw new \Exception('Provider ID and API key are required');
                }

                // Add user_id to data
                $data['user_id'] = Auth::id();
                $data['is_active'] = true;
                $data['test_status'] = 'pending';

                // Check if user already has this provider configured
                $existingProvider = UserAIProvider::where('user_id', Auth::id())
                    ->where('provider_id', $data['provider_id'])
                    ->first();

                if ($existingProvider) {
                    // Update existing provider
                    $existingProvider->update([
                        'api_key' => $data['api_key'],
                        'is_active' => true,
                        'test_status' => 'pending'
                    ]);
                    $userProvider = $existingProvider;
                } else {
                    // Create new provider
                    $userProvider = UserAIProvider::create($data);
                }

                // Load the provider relationship
                $userProvider->load('provider');

                return [
                    'success' => true,
                    'data' => $userProvider,
                    'message' => 'Provider configured successfully'
                ];
            } catch (\Exception $e) {
                return [
                    'success' => false,
                    'message' => 'Failed to configure provider: ' . $e->getMessage()
                ];
            }
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

    public function configureProviderWithModels(array $data)
    {
        return DB::transaction(function () use ($data) {
            try {
                // First, store/update the user provider
                $providerResult = $this->storeUserProvider($data);
                
                if (!$providerResult['success']) {
                    return $providerResult;
                }

                $userProvider = $providerResult['data'];
                
                // Then fetch available models from the provider
                $provider = AIProvider::findOrFail($data['provider_id']);
                $availableModels = $this->aiModelService->fetchModels($provider, $data['api_key']);

                // Update test status to success
                $userProvider->update([
                    'test_status' => 'success',
                    'test_message' => 'API key validated successfully',
                    'last_tested_at' => now()
                ]);

                // Reload the provider relationship
                $userProvider->load('provider');

                return [
                    'success' => true,
                    'data' => [
                        'user_provider' => $userProvider,
                        'available_models' => $availableModels
                    ],
                    'message' => 'Provider configured and models fetched successfully'
                ];
            } catch (\Exception $e) {
                // Update test status to failed if provider was created
                if (isset($userProvider)) {
                    $userProvider->update([
                        'test_status' => 'failed',
                        'test_message' => $e->getMessage(),
                        'last_tested_at' => now()
                    ]);
                }

                return [
                    'success' => false,
                    'message' => 'Failed to configure provider: ' . $e->getMessage()
                ];
            }
        });
    }

}