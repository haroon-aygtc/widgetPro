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
        return DB::transaction(function () use ($providerId, $apiKey)
        {
            try {
                $provider = AIProvider::findOrFail($providerId);

                $models = $this->aiModelService->fetchModels($provider, $apiKey);

                return [
                'success' => true,
                    'message' => 'API key is valid and working',
                'data' => [
                    'models' => $models,
                    'provider' => $provider
                ]
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'API key test failed: ' . $e->getMessage()
            ];
            }
        });
    }

    public function fetchModels(array $filters = [], int $perPage = 15, $providerId)
    {
        return DB::transaction(function () use ($filters, $perPage, $providerId) {
            try {
                $provider = AIProvider::findOrFail($providerId);
                
                if (!isset($filters['api_key'])) {
                    throw new \Exception('API key is required');
                }
                
                $models = $this->aiModelService->fetchModels($provider, $filters['api_key']);

                // Store models in database if they don't exist
                $storedModels = [];
                foreach ($models as $modelData) {
                    $storedModel = AIModel::updateOrCreate(
                        [
                            'provider_id' => $provider->id,
                            'name' => $modelData['name']
                        ],
                        [
                            'display_name' => $modelData['display_name'],
                            'description' => $modelData['description'] ?? null,
                            'is_free' => $modelData['is_free'] ?? false,
                            'is_active' => true
                        ]
                    );
                    $storedModels[] = $storedModel;
                }

                return [
                    'success' => true,
                    'data' => [
                        'models' => $storedModels,
                        'provider' => $provider
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



}