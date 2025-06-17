<?php

namespace App\Services;

use App\Models\AIProvider;
use Illuminate\Support\Facades\Http;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\UserAIProvider;
use App\Models\UserAIModel;
use Illuminate\Support\Facades\Log;

class AIProviderService
{
    protected $aiModelService;

    public function __construct(AIModelService $aiModelService)
    {
        $this->aiModelService = $aiModelService;
    }

    public function getProviders(array $filters = [], int $perPage = 15)
    {
        return DB::transaction(function () use ($filters, $perPage)
        {
            try {
                $query = AIProvider::active();

                if (!empty($filters['search'])) {
                    $query->search($filters['search']);
                }

                $providers = $query->orderBy('display_name')
                                  ->paginate($perPage);

                return [
                    'success' => true,
                    'data' => $providers
                ];
            } catch (\Exception $e) {
                throw $e;
            }
        });
    }

    public function storeProviders(array $data)
    {
        return DB::transaction(function () use ($data) {
            $provider = AIProvider::create($data);

            return [
                'success' => true,
                'data' => $provider
            ];
        });
    }

    public function testProvider($providerId, $apiKey)
    {
        try {
            $provider = AIProvider::findOrFail($providerId);

            // Only validate the API key, don't fetch models
            $result = $this->aiModelService->validateApiKey($provider, $apiKey);

            if ($result['success']) {
                return [
                    'success' => true,
                    'message' => $result['message'] ?? 'API key is valid',
                    'data' => [
                        'provider' => $provider,
                        'validated' => true
                    ]
                ];
            } else {
                return [
                    'success' => false,
                    'message' => $result['message'] ?? 'API key validation failed'
                ];
            }
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'API key test failed: ' . $e->getMessage()
            ];
        }
    }

    public function fetchModels(array $filters = [], int $perPage = 15, $providerId)
    {
        return DB::transaction(function () use ($filters, $perPage, $providerId) {
            try {
                $provider = AIProvider::findOrFail($providerId);

                // First, try to get cached models from database
                $cachedModels = AIModel::where('provider_id', $providerId)
                    ->where('is_active', true)
                    ->get();

                // If we have cached models and no force refresh, return them
                if ($cachedModels->isNotEmpty() && !isset($filters['force_refresh'])) {
                    return [
                        'success' => true,
                        'data' => [
                            'models' => $cachedModels,
                            'provider' => $provider,
                            'source' => 'cache'
                        ]
                    ];
                }

                // Otherwise, fetch fresh models from API
                if (!isset($filters['api_key'])) {
                    throw new \Exception('API key is required for fresh model fetch');
                }

                $freshModels = $this->aiModelService->fetchModels($provider, $filters['api_key']);

                // Store/update models in database
                $storedModels = [];
                foreach ($freshModels as $modelData) {
                    $storedModel = AIModel::updateOrCreate(
                        [
                            'provider_id' => $provider->id,
                            'name' => $modelData['name']
                        ],
                        [
                            'display_name' => $modelData['display_name'],
                            'description' => $modelData['description'] ?? null,
                            'is_free' => $modelData['is_free'] ?? false,
                            'max_tokens' => $modelData['max_tokens'] ?? null,
                            'context_window' => $modelData['context_window'] ?? null,
                            'pricing_input' => $modelData['pricing_input'] ?? null,
                            'pricing_output' => $modelData['pricing_output'] ?? null,
                            'is_active' => true
                        ]
                    );
                    $storedModels[] = $storedModel;
                }

                return [
                    'success' => true,
                    'data' => [
                        'models' => $storedModels,
                        'provider' => $provider,
                        'source' => 'api'
                    ]
                ];
            } catch (\Exception $e) {
                return [
                    'success' => false,
                    'message' => 'Failed to fetch models: ' . $e->getMessage()
                ];
            }
        });
    }

    public function getAvailableModels($providerId, $userId = null)
    {
        return DB::transaction(function () use ($providerId, $userId) {
            try {
                // First, verify user has configured this provider
                if ($userId) {
                    $userProvider = UserAIProvider::where('user_id', $userId)
                        ->where('provider_id', $providerId)
                        ->where('is_active', true)
                        ->first();

                    if (!$userProvider) {
                        return [
                            'success' => false,
                            'message' => 'Provider not configured. Please configure this provider first.',
                            'data' => []
                        ];
                    }
                }

                // Get models ONLY for this specific provider
                $models = AIModel::where('provider_id', $providerId)
                    ->where('is_active', true)
                    ->get();

                // If user ID provided, mark which models user has added from THIS provider only
                if ($userId) {
                    $userModelIds = UserAIModel::where('user_id', $userId)
                        ->whereHas('userProvider', function($q) use ($providerId) {
                            $q->where('provider_id', $providerId);
                        })
                        ->pluck('model_id')
                        ->toArray();

                    $models = $models->map(function ($model) use ($userModelIds) {
                        $model->user_has_model = in_array($model->id, $userModelIds);
                        return $model;
                    });
                }

                return [
                    'success' => true,
                    'data' => $models
                ];
            } catch (\Exception $e) {
                return [
                    'success' => false,
                    'message' => 'Failed to get available models: ' . $e->getMessage()
                ];
            }
        });
    }

    public function getModelsForUserConfiguredProviders($userId)
    {
        return DB::transaction(function () use ($userId) {
            try {
                // Get user's configured providers
                $userProviders = UserAIProvider::where('user_id', $userId)
                    ->where('is_active', true)
                    ->with('provider')
                    ->get();

                if ($userProviders->isEmpty()) {
                    return [
                        'success' => true,
                        'data' => [],
                        'message' => 'No providers configured. Please configure a provider first.'
                    ];
                }

                $result = [];
                foreach ($userProviders as $userProvider) {
                    // Get models only for this specific provider
                    $models = AIModel::where('provider_id', $userProvider->provider_id)
                        ->where('is_active', true)
                        ->get();

                    // Mark which models user has added
                    $userModelIds = UserAIModel::where('user_id', $userId)
                        ->where('user_provider_id', $userProvider->id)
                        ->pluck('model_id')
                        ->toArray();

                    $models = $models->map(function ($model) use ($userModelIds) {
                        $model->user_has_model = in_array($model->id, $userModelIds);
                        return $model;
                    });

                    $result[] = [
                        'provider' => $userProvider->provider,
                        'user_provider' => $userProvider,
                        'models' => $models
                    ];
                }

                return [
                    'success' => true,
                    'data' => $result
                ];
            } catch (\Exception $e) {
                return [
                    'success' => false,
                    'message' => 'Failed to get models for configured providers: ' . $e->getMessage()
                ];
            }
        });
    }



}
