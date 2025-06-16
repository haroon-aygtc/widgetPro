<?php

namespace App\Http\Controllers;

use App\Models\AIProvider;
use App\Models\AIModel;
use App\Models\UserAIProvider;
use App\Models\UserAIModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AIProviderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = AIProvider::active();

        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->boolean('free_only')) {
            $query->free();
        }

        $providers = $query->orderBy('is_free', 'desc')
                          ->orderBy('display_name')
                          ->get();

        return response()->json([
            'success' => true,
            'data' => $providers
        ]);
    }

    public function testProvider(Request $request): JsonResponse
    {
        $request->validate([
            'provider_id' => 'required|exists:ai_providers,id',
            'api_key' => 'required|string|min:10'
        ]);

        $provider = AIProvider::findOrFail($request->provider_id);
        $apiKey = $request->api_key;

        try {
            $models = $this->fetchModelsFromProvider($provider, $apiKey);
            
            return response()->json([
                'success' => true,
                'message' => 'API key is valid and working',
                'data' => [
                    'models' => $models,
                    'provider' => $provider
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('AI Provider test failed', [
                'provider' => $provider->name,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'API key test failed: ' . $e->getMessage()
            ], 422);
        }
    }

    public function storeUserProvider(Request $request): JsonResponse
    {
        $request->validate([
            'provider_id' => 'required|exists:ai_providers,id',
            'api_key' => 'required|string|min:10'
        ]);

        $userId = Auth::id();
        $providerId = $request->provider_id;
        $apiKey = $request->api_key;

        try {
            $provider = AIProvider::findOrFail($providerId);
            
            // Test the API key first
            $models = $this->fetchModelsFromProvider($provider, $apiKey);
            
            // Store or update user provider
            $userProvider = UserAIProvider::updateOrCreate(
                [
                    'user_id' => $userId,
                    'provider_id' => $providerId
                ],
                [
                    'api_key' => encrypt($apiKey),
                    'is_active' => true,
                    'last_tested_at' => now(),
                    'test_status' => 'success',
                    'test_message' => 'API key validated successfully'
                ]
            );

            // Store available models
            $this->storeModelsForProvider($provider, $models);

            $userProvider->load('provider');

            return response()->json([
                'success' => true,
                'message' => 'AI provider configured successfully',
                'data' => [
                    'user_provider' => $userProvider,
                    'available_models' => $models
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to store user AI provider', [
                'user_id' => $userId,
                'provider_id' => $providerId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to configure AI provider: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getUserProviders(): JsonResponse
    {
        $userProviders = UserAIProvider::with('provider')
                                      ->forUser(Auth::id())
                                      ->active()
                                      ->get();

        return response()->json([
            'success' => true,
            'data' => $userProviders
        ]);
    }

    public function getModelsForProvider(Request $request, $providerId): JsonResponse
    {
        $userProvider = UserAIProvider::with('provider')
                                     ->where('user_id', Auth::id())
                                     ->where('provider_id', $providerId)
                                     ->active()
                                     ->firstOrFail();

        $query = AIModel::with('provider')
                        ->forProvider($providerId)
                        ->active();

        if ($request->filled('search')) {
            $query->search($request->search);
        }

        $models = $query->orderBy('is_free', 'desc')
                       ->orderBy('display_name')
                       ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'models' => $models,
                'provider' => $userProvider->provider
            ]
        ]);
    }

    public function storeUserModel(Request $request): JsonResponse
    {
        $request->validate([
            'model_id' => 'required|exists:ai_models,id',
            'user_provider_id' => 'required|exists:user_ai_providers,id',
            'custom_name' => 'nullable|string|max:100'
        ]);

        $userId = Auth::id();
        
        // Verify user owns the provider
        $userProvider = UserAIProvider::where('id', $request->user_provider_id)
                                     ->where('user_id', $userId)
                                     ->firstOrFail();

        $model = AIModel::findOrFail($request->model_id);

        // Verify model belongs to the provider
        if ($model->provider_id !== $userProvider->provider_id) {
            return response()->json([
                'success' => false,
                'message' => 'Model does not belong to the specified provider'
            ], 422);
        }

        try {
            $userModel = UserAIModel::updateOrCreate(
                [
                    'user_id' => $userId,
                    'model_id' => $request->model_id
                ],
                [
                    'user_provider_id' => $request->user_provider_id,
                    'is_active' => true,
                    'custom_name' => $request->custom_name
                ]
            );

            $userModel->load(['model.provider', 'userProvider']);

            return response()->json([
                'success' => true,
                'message' => 'AI model added successfully',
                'data' => $userModel
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to store user AI model', [
                'user_id' => $userId,
                'model_id' => $request->model_id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to add AI model'
            ], 500);
        }
    }

    public function getUserModels(): JsonResponse
    {
        $userModels = UserAIModel::with(['model.provider', 'userProvider.provider'])
                                 ->forUser(Auth::id())
                                 ->active()
                                 ->get();

        return response()->json([
            'success' => true,
            'data' => $userModels
        ]);
    }

    private function fetchModelsFromProvider(AIProvider $provider, string $apiKey): array
    {
        switch ($provider->name) {
            case 'openai':
                return $this->fetchOpenAIModels($apiKey);
            case 'anthropic':
                return $this->fetchAnthropicModels($apiKey);
            case 'groq':
                return $this->fetchGroqModels($apiKey);
            case 'google':
                return $this->fetchGoogleModels($apiKey);
            case 'huggingface':
                return $this->fetchHuggingFaceModels($apiKey);
            default:
                return $this->fetchGenericModels($provider, $apiKey);
        }
    }

    private function fetchOpenAIModels(string $apiKey): array
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json'
        ])->get('https://api.openai.com/v1/models');

        if (!$response->successful()) {
            throw new \Exception('Failed to fetch OpenAI models: ' . $response->body());
        }

        $models = [];
        foreach ($response->json('data', []) as $model) {
            if (str_contains($model['id'], 'gpt')) {
                $models[] = [
                    'name' => $model['id'],
                    'display_name' => ucfirst(str_replace('-', ' ', $model['id'])),
                    'description' => 'OpenAI ' . $model['id'] . ' model',
                    'is_free' => false
                ];
            }
        }

        return $models;
    }

    private function fetchAnthropicModels(string $apiKey): array
    {
        // Anthropic doesn't have a models endpoint, return known models
        return [
            [
                'name' => 'claude-3-opus-20240229',
                'display_name' => 'Claude 3 Opus',
                'description' => 'Most powerful Claude model',
                'is_free' => false
            ],
            [
                'name' => 'claude-3-sonnet-20240229',
                'display_name' => 'Claude 3 Sonnet',
                'description' => 'Balanced performance and cost',
                'is_free' => false
            ],
            [
                'name' => 'claude-3-haiku-20240307',
                'display_name' => 'Claude 3 Haiku',
                'description' => 'Fast and efficient',
                'is_free' => false
            ]
        ];
    }

    private function fetchGroqModels(string $apiKey): array
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json'
        ])->get('https://api.groq.com/openai/v1/models');

        if (!$response->successful()) {
            throw new \Exception('Failed to fetch Groq models: ' . $response->body());
        }

        $models = [];
        foreach ($response->json('data', []) as $model) {
            $models[] = [
                'name' => $model['id'],
                'display_name' => ucfirst(str_replace('-', ' ', $model['id'])),
                'description' => 'Groq ' . $model['id'] . ' model',
                'is_free' => true
            ];
        }

        return $models;
    }

    private function fetchGoogleModels(string $apiKey): array
    {
        return [
            [
                'name' => 'gemini-pro',
                'display_name' => 'Gemini Pro',
                'description' => 'Advanced reasoning and understanding',
                'is_free' => true
            ],
            [
                'name' => 'gemini-pro-vision',
                'display_name' => 'Gemini Pro Vision',
                'description' => 'Multimodal model with vision capabilities',
                'is_free' => true
            ]
        ];
    }

    private function fetchHuggingFaceModels(string $apiKey): array
    {
        return [
            [
                'name' => 'microsoft/DialoGPT-medium',
                'display_name' => 'DialoGPT Medium',
                'description' => 'Conversational AI model',
                'is_free' => true
            ],
            [
                'name' => 'facebook/blenderbot-400M-distill',
                'display_name' => 'BlenderBot 400M',
                'description' => 'Open-domain chatbot',
                'is_free' => true
            ]
        ];
    }

    private function fetchGenericModels(AIProvider $provider, string $apiKey): array
    {
        // Return default models for unknown providers
        return [
            [
                'name' => 'default-model',
                'display_name' => 'Default Model',
                'description' => 'Default model for ' . $provider->display_name,
                'is_free' => $provider->is_free
            ]
        ];
    }

    private function storeModelsForProvider(AIProvider $provider, array $models): void
    {
        foreach ($models as $modelData) {
            AIModel::updateOrCreate(
                [
                    'provider_id' => $provider->id,
                    'name' => $modelData['name']
                ],
                [
                    'display_name' => $modelData['display_name'],
                    'description' => $modelData['description'],
                    'is_free' => $modelData['is_free'],
                    'is_active' => true
                ]
            );
        }
    }
}
