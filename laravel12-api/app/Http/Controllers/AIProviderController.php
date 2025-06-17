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
use App\Services\AIProviderService;

class AIProviderController extends Controller
{
    protected $aiProviderService;

    public function __construct(AIProviderService $aiProviderService)
    {
        $this->aiProviderService = $aiProviderService;
    }

    public function getProviders(Request $request): JsonResponse
    {
        $result = $this->aiProviderService->getProviders($request->all(), 15);

        return response()->json([
            'success' => $result['success'] ?? true ,
            'data' => $result['data'] ?? $result,
            'message' => $result['message'] ?? 'Providers retrieved successfully',
            'pagination' => $result['pagination'] ?? $result
        ]);
    }

    public function testProvider(Request $request)
    {
        // Validate request
        $request->validate([
            'provider_id' => 'required|integer|exists:ai_providers,id',
            'api_key' => 'required|string'
        ]);

        try {
            $result = $this->aiProviderService->testProvider($request->provider_id, $request->api_key);

            return response()->json([
                'success' => $result['success'] ?? true,
                'data' => $result['data'] ?? $result,
                'message' => $result['message'] ?? 'API key validated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'API key validation failed: ' . $e->getMessage()
            ], 400);
        }
    }

    public function fetchModelsForProvider(Request $request, $providerId)
    {
        $request->validate([
            'api_key' => 'required|string',
            'search' => 'nullable|string'
        ]);

        try {
            // Verify user has configured this provider
            $userProvider = UserAIProvider::where('user_id', Auth::id())
                ->where('provider_id', $providerId)
                ->where('is_active', true)
                ->first();

            if (!$userProvider) {
                return response()->json([
                    'success' => false,
                    'message' => 'Provider not configured. Please configure this provider first.',
                    'data' => []
                ], 403);
            }

            $provider = \App\Models\AIProvider::findOrFail($providerId);
            $models = $this->aiProviderService->fetchModels($provider, $request->api_key);

            return response()->json([
                'success' => true,
                'data' => [
                    'models' => $models,
                    'provider' => $provider
                ],
                'message' => 'Models fetched successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch models: ' . $e->getMessage()
            ], 400);
        }
    }

    public function configureProvider(Request $request)
    {
        $request->validate([
            'provider_id' => 'required|integer|exists:ai_providers,id',
            'api_key' => 'required|string'
        ]);

        try {
            // First test the provider
            $testResult = $this->aiProviderService->testProvider($request->provider_id, $request->api_key);

            if (!$testResult['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $testResult['message']
                ], 400);
            }

            // Create or update user provider
            $userProvider = UserAIProvider::updateOrCreate(
                [
                    'user_id' => Auth::id(),
                    'provider_id' => $request->provider_id
                ],
                [
                    'api_key' => encrypt($request->api_key),
                    'test_status' => 'success',
                    'last_tested_at' => now()
                ]
            );

            // Get available models
            $modelsResult = $this->aiProviderService->fetchModels($request->all(), 50, $request->provider_id);
            $availableModels = $modelsResult['success'] ? $modelsResult['data']['models'] : [];

            return response()->json([
                'success' => true,
                'message' => 'Provider configured successfully',
                'data' => [
                    'user_provider' => $userProvider,
                    'available_models' => $availableModels
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Provider configuration failed', [
                'provider_id' => $request->provider_id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to configure provider: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getUserProviders()
    {
        try {
            $userProviders = UserAIProvider::with('provider')
                ->where('user_id', Auth::id())
                ->get()
                ->map(function ($userProvider) {
                    return [
                        'id' => $userProvider->id,
                        'provider_id' => $userProvider->provider_id,
                        'provider' => $userProvider->provider,
                        'test_status' => $userProvider->test_status,
                        'last_tested_at' => $userProvider->last_tested_at,
                        'api_key' => decrypt($userProvider->api_key),
                        'created_at' => $userProvider->created_at,
                        'updated_at' => $userProvider->updated_at
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $userProviders,
                'message' => 'User providers retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve user providers: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getUserModels()
    {
        try {
            $userModels = UserAIModel::with(['model.provider', 'userProvider'])
                ->whereHas('userProvider', function ($query) {
                    $query->where('user_id', Auth::id());
                })
                ->get();

            return response()->json([
                'success' => true,
                'data' => $userModels,
                'message' => 'User models retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve user models: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateUserProvider(Request $request, $providerId)
    {
        $request->validate([
            'api_key' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'is_default' => 'nullable|boolean'
        ]);

        try {
            $userProvider = UserAIProvider::where('user_id', Auth::id())
                ->where('id', $providerId)
                ->firstOrFail();

            // If setting as default, unset all other defaults for this user
            if ($request->get('is_default', false)) {
                UserAIProvider::where('user_id', Auth::id())
                    ->where('id', '!=', $providerId)
                    ->where('is_default', true)
                    ->update(['is_default' => false]);
            }

            $updateData = [];
            if ($request->has('api_key')) {
                $updateData['api_key'] = encrypt($request->api_key);
            }
            if ($request->has('is_active')) {
                $updateData['is_active'] = $request->is_active;
            }
            if ($request->has('is_default')) {
                $updateData['is_default'] = $request->is_default;
            }

            $userProvider->update($updateData);
            $userProvider->load('provider');

            return response()->json([
                'success' => true,
                'data' => $userProvider,
                'message' => 'User provider updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user provider: ' . $e->getMessage()
            ], 500);
        }
    }

    public function addUserModel(Request $request)
    {
        $request->validate([
            'model_id' => 'required|integer|exists:ai_models,id',
            'user_provider_id' => 'required|integer|exists:user_ai_providers,id',
            'custom_name' => 'nullable|string'
        ]);

        try {
            // Verify the user provider belongs to the authenticated user
            $userProvider = UserAIProvider::where('user_id', Auth::id())
                ->where('id', $request->user_provider_id)
                ->firstOrFail();

            $userModel = UserAIModel::updateOrCreate(
                [
                    'user_id' => Auth::id(),
                    'model_id' => $request->model_id,
                    'user_provider_id' => $request->user_provider_id
                ],
                [
                    'custom_name' => $request->custom_name,
                    'is_active' => true
                ]
            );

            $userModel->load(['model.provider', 'userProvider']);

            return response()->json([
                'success' => true,
                'data' => $userModel,
                'message' => 'User model added successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add user model: ' . $e->getMessage()
            ], 500);
        }
    }

    public function deleteUserProvider(Request $request)
    {
        $request->validate([
            'provider_id' => 'required|integer|exists:ai_providers,id',
        ]);
    }

    public function updateUserModel(Request $request, $modelId)
    {
        $request->validate([
            'model_id' => 'required|integer|exists:ai_models,id',
            'user_provider_id' => 'required|integer|exists:user_ai_providers,id',
            'custom_name' => 'nullable|string'
        ]);

        try {
            // Verify the user provider belongs to the authenticated user
            $userProvider = UserAIProvider::where('user_id', Auth::id())
                ->where('id', $request->user_provider_id)
                ->firstOrFail();

            $userModel = UserAIModel::updateOrCreate(
                [
                    'user_id' => Auth::id(),
                    'model_id' => $request->model_id,
                    'user_provider_id' => $request->user_provider_id
                ],
                [
                    'custom_name' => $request->custom_name,
                    'is_active' => true
                ]
            );

            $userModel->load(['model.provider', 'userProvider']);

            return response()->json([
                'success' => true,
                'data' => $userModel,
                'message' => 'User model added successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add user model: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getAvailableModelsForProvider(Request $request, $providerId)
    {
        try {
            $result = $this->aiProviderService->getAvailableModels($providerId, Auth::id());

            return response()->json([
                'success' => $result['success'] ?? true,
                'data' => $result['data'] ?? [],
                'message' => $result['message'] ?? 'Available models retrieved successfully'
            ], $result['success'] ? 200 : 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get available models: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getUserConfiguredProviderModels(Request $request)
    {
        try {
            $result = $this->aiProviderService->getModelsForUserConfiguredProviders(Auth::id());

            return response()->json([
                'success' => $result['success'] ?? true,
                'data' => $result['data'] ?? [],
                'message' => $result['message'] ?? 'Models for configured providers retrieved successfully'
            ], $result['success'] ? 200 : 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get models for configured providers: ' . $e->getMessage()
            ], 500);
        }
    }




}
