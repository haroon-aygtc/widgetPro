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
        $result = $this->aiProviderService->testProvider($request->provider_id, $request->api_key);

        return response()->json([
            'success' => $result['success'] ?? true,
            'data' => $result['data'] ?? $result,
            'message' => $result['message'] ?? 'Provider tested successfully'
        ]);
    }

    public function fetchModelsForProvider(Request $request, $providerId)
    {
        $request->validate([
            'api_key' => 'required|string',
            'search' => 'nullable|string'
        ]);

        $result = $this->aiProviderService->fetchModels($request->all(), 15, $providerId);

        return response()->json([
            'success' => $result['success'] ?? true,
            'data' => $result['data'] ?? $result,
            'message' => $result['message'] ?? 'Models retrieved successfully'
        ]);
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




}
